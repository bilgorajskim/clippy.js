/* jslint node: true */
'use strict';

const Agent = require('./agent');
const Animator = require('./animator');
const Balloon = require('./balloon');
const clippyCommon = require('./load');
const Queue = require('./queue');
require('./scss/clippy.scss');

module.exports = {
  Agent: Agent,
  Animator: Animator,
  Balloon: Balloon,
  BASE_PATH: clippyCommon.BASE_PATH,
  load: clippyCommon.load,
  ready: clippyCommon.ready,
  soundsReady: clippyCommon.soundsReady,
  Queue: Queue,
};
