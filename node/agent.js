import Queue from './queue';

import Animator from './animator';
import Balloon from './balloon';

export class Agent {
    constructor(path, data, sounds) {
        this.path = path;

        this._queue = new Queue($.proxy(this._onQueueEmpty, this));

        this._el = $('<div class="clippy"></div>').hide();

        $(document.body).append(this._el);

        this._animator = new Animator(this._el, path, data, sounds);

        this._balloon = new Balloon(this._el);

        this._setupEvents();
    }

    /**************************** API ************************************/

    /***
     *
     * @param {Number} x
     * @param {Number} y
     */
    gestureAt(x, y) {
        var d = this._getDirection(x, y);
        var gAnim = 'Gesture' + d;
        var lookAnim = 'Look' + d;

        var animation = this.hasAnimation(gAnim) ? gAnim : lookAnim;
        return this.play(animation);
    }

    /***
     *
     * @param {Boolean=} fast
     *
     */
    hide(fast, callback) {
        this._hidden = true;
        var el = this._el;
        this.stop();
        if (fast) {
            this._el.hide();
            this.stop();
            this.pause();
            if (callback) callback();
            return;
        }

        this._addToQueue(function(complete) {
            this._animator.showAnimation('Hide', $.proxy(function(name, state) {
                if (state === clippy.Animator.States.EXITED) {
                    el.hide();
                    this.pause();
                    if (callback) callback();
                    complete();
                }
            }, this));
        }, this);
    }

    moveTo(x, y, duration) {
        var dir = this._getDirection(x, y);
        var anim = 'Move' + dir;
        if (duration === undefined) duration = 1000;

        this._addToQueue(function(complete) {
            // the simple case
            if (duration === 0) {
                this._el.css({top: y, left: x});
                this.reposition();
                complete();
                return;
            }

            // no animations
            if (!this.hasAnimation(anim)) {
                this._el.animate({top: y, left: x}, duration, complete);
                return;
            }

            var callback = $.proxy(function(name, state) {
                // when exited, complete
                if (state === clippy.Animator.States.EXITED) {
                    complete();
                }
                // if waiting,
                if (state === clippy.Animator.States.WAITING) {
                    this._el.animate(
                        {top: y, left: x}, duration, $.proxy(function() {
                            // after we're done with the movement, do the exit
                            // animation
                            this._animator.exitAnimation();
                        }, this));
                }

            }, this);

            this._animator.showAnimation(anim, callback);
        }, this);
    }

    play(animation, timeout, cb) {
        if (!this.hasAnimation(animation)) return false;

        if (timeout === undefined) timeout = 5000;

        this._addToQueue(function(complete) {
            var completed = false;
            // handle callback
            var callback = function(name, state) {
                if (state === clippy.Animator.States.EXITED) {
                    completed = true;
                    if (cb) cb();
                    complete();
                }
            };

            // if has timeout, register a timeout function
            if (timeout) {
                window.setTimeout($.proxy(function() {
                    if (completed) return;
                    // exit after timeout
                    this._animator.exitAnimation();
                }, this), timeout)
            }

            this._animator.showAnimation(animation, callback);
        }, this);

        return true;
    }

    /***
     *
     * @param {Boolean=} fast
     */
    show(fast) {
        this._hidden = false;
        if (fast) {
            this._el.show();
            this.resume();
            this._onQueueEmpty();
            return;
        }

        if (this._el.css('top') === 'auto' ||
            !this._el.css('left') === 'auto') {
            var left = $(window).width() * 0.8;
            var top = ($(window).height() + $(document).scrollTop()) * 0.8;
            this._el.css({top: top, left: left});
        }

        this.resume();
        return this.play('Show');
    }

    /***
     *
     * @param {String} text
     */
    speak(text, hold) {
        this._addToQueue(function(complete) {
            this._balloon.speak(complete, text, hold);
        }, this);
    }

    /***
     *
     * @param {String} text
     */
    ask(text, choices, callback) {
        this._addToQueue(function(complete) {
            this._balloon.ask(complete, text, choices, callback);
        }, this);
    }

    /***
     * Close the current balloon
     */
    closeBalloon() { this._balloon.close(); }

    delay(time) {
        time = time || 250;

        this._addToQueue(function(complete) {
            window.setTimeout(complete, time);
        }, this);
    }

    /***
     * Skips the current animation
     */
    stopCurrent() {
        this._animator.exitAnimation();
        this._balloon.close();
    }

    stop() {
        // clear the queue
        this._queue.clear();
        this._animator.exitAnimation();
        this._balloon.close();
    }

    /***
     *
     * @param {String} name
     * @returns {Boolean}
     */
    hasAnimation(name) { return this._animator.hasAnimation(name); }

    /***
     * Gets a list of animation names
     *
     * @return {Array.<string>}
     */
    animations() { return this._animator.animations(); }

    /***
     * Play a random animation
     * @return {jQuery.Deferred}
     */
    animate() {
        var animations = this.animations();
        var anim = animations[Math.floor(Math.random() * animations.length)];
        // skip idle animations
        if (anim.indexOf('Idle') === 0 || anim == 'Show' || anim == 'Hide') {
            return this.animate();
        }
        return this.play(anim);
    }

    /**************************** Utils ************************************/

    /***
     *
     * @param {Number} x
     * @param {Number} y
     * @return {String}
     * @private
     */
    _getDirection(x, y) {
        var offset = this._el.offset();
        var h = this._el.height();
        var w = this._el.width();

        var centerX = (offset.left + w / 2);
        var centerY = (offset.top + h / 2);

        var a = centerY - y;
        var b = centerX - x;

        var r = Math.round((180 * Math.atan2(a, b)) / Math.PI);

        // Left and Right are for the character, not the screen :-/
        if (-45 <= r && r < 45) return 'Right';
        if (45 <= r && r < 135) return 'Up';
        if (135 <= r && r <= 180 || -180 <= r && r < -135) return 'Left';
        if (-135 <= r && r < -45) return 'Down';

        // sanity check
        return 'Top';
    }

    /**************************** Queue and Idle handling
     * ************************************/

    /***
     * Handle empty queue.
     * We need to transition the animation to an idle state
     * @private
     */
    _onQueueEmpty() {
        if (this._hidden || this._isIdleAnimation()) return;
        var idleAnim = this._getIdleAnimation();
        this._idleDfd = $.Deferred();

        this._animator.showAnimation(
            idleAnim, $.proxy(this._onIdleComplete, this));
    }

    _onIdleComplete(name, state) {
        if (state === clippy.Animator.States.EXITED) {
            this._idleDfd.resolve();

            // Always play some idle animation.
            this._queue.next();
        }
    }

    /***
     * Is an Idle animation currently playing?
     * @return {Boolean}
     * @private
     */
    _isIdleAnimation() {
        var c = this._animator.currentAnimationName;
        return c && c.indexOf('Idle') == 0 && this._idleDfd &&
            this._idleDfd.state() === 'pending';
    }

    /**
     * Gets a random Idle animation
     * @return {String}
     * @private
     */
    _getIdleAnimation() {
        var animations = this.animations();
        var r = [];
        for (var i = 0; i < animations.length; i++) {
            var a = animations[i];
            if (a.indexOf('Idle') === 0) {
                r.push(a);
            }
        }

        // pick one
        var idx = Math.floor(Math.random() * r.length);
        return r[idx];
    }

    /**************************** Events ************************************/

    _setupEvents() {
        $(window).on('resize', $.proxy(this.reposition, this));

        this._el.on('mousedown', $.proxy(this._onMouseDown, this));

        this._el.on('dblclick', $.proxy(this._onDoubleClick, this));
    }

    _onDoubleClick() {
        if (!this.play('ClickedOn')) {
            this.animate();
        }
    }

    reposition() {
        if (!this._el.is(':visible')) return;
        var o = this._el.offset();
        var bH = this._el.outerHeight();
        var bW = this._el.outerWidth();

        var wW = $(window).width();
        var wH = $(window).height();
        var sT = $(window).scrollTop();
        var sL = $(window).scrollLeft();

        var top = o.top - sT;
        var left = o.left - sL;
        var m = 5;
        if (top - m < 0) {
            top = m;
        } else if ((top + bH + m) > wH) {
            top = wH - bH - m;
        }

        if (left - m < 0) {
            left = m;
        } else if (left + bW + m > wW) {
            left = wW - bW - m;
        }

        this._el.css({left: left, top: top});
        // reposition balloon
        this._balloon.reposition();
    }

    _onMouseDown(e) {
        e.preventDefault();
        this._startDrag(e);
    }


    /**************************** Drag ************************************/

    _startDrag(e) {
        // pause animations
        this.pause();
        this._balloon.hide();
        this._offset = this._calculateClickOffset(e);

        this._moveHandle = $.proxy(this._dragMove, this);
        this._upHandle = $.proxy(this._finishDrag, this);

        $(window).on('mousemove', this._moveHandle);
        $(window).on('mouseup', this._upHandle);

        this._dragUpdateLoop =
            window.setTimeout($.proxy(this._updateLocation, this), 10);
    }

    _calculateClickOffset(e) {
        var mouseX = e.pageX;
        var mouseY = e.pageY;
        var o = this._el.offset();
        return { top: mouseY - o.top, left: mouseX - o.left }
    }

    _updateLocation() {
        this._el.css({top: this._targetY, left: this._targetX});
        this._dragUpdateLoop =
            window.setTimeout($.proxy(this._updateLocation, this), 10);
    }

    _dragMove(e) {
        e.preventDefault();
        var x = e.clientX - this._offset.left;
        var y = e.clientY - this._offset.top;
        this._targetX = x;
        this._targetY = y;
    }

    _finishDrag() {
        window.clearTimeout(this._dragUpdateLoop);
        // remove handles
        $(window).off('mousemove', this._moveHandle);
        $(window).off('mouseup', this._upHandle);
        // resume animations
        this._balloon.show();
        this.reposition();
        this.resume();
    }

    _addToQueue(func, scope) {
        if (scope) func = $.proxy(func, scope);

        // if we're inside an idle animation,
        if (this._isIdleAnimation()) {
            this._idleDfd.done(
                $.proxy(function() { this._queue.queue(func); }, this));
            this._animator.exitAnimation();
            return;
        }

        this._queue.queue(func);
    }

    /**************************** Pause and Resume
     * ************************************/

    pause() {
        this._animator.pause();
        this._balloon.pause();
    }

    resume() {
        this._animator.resume();
        this._balloon.resume();
    }
};
