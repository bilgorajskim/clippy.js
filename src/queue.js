/******
 * Tiny Queue
 *
 * @constructor
 */

import $ from 'jquery';

export class Queue {
  constructor(onEmptyCallback) {
    this._queue = [];
    this._onEmptyCallback = onEmptyCallback;
  }

  /***
   *
   * @param {function(Function)} func
   * @returns {jQuery.Deferred}
   */
  queue(func) {
    this._queue.push(func);
    this.next();
  }

  next() {
    if (this._active)
      return;

    // stop if nothing left in queue
    if (!this._queue.length) {
      this._onEmptyCallback();
      return;
    }

    var f = this._queue.shift();
    this._active = true;

    // execute function
    var completeFunction = $.proxy(this._finish, this);
    f(completeFunction);
  }

  _finish() {
    this._active = false;
    this.next();
  }

  clear() {
    this._queue = [];
  }
}
