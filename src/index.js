/* jslint node: true */
'use strict';

import Agent from './agent';
import Animator from './animator';
import Balloon from './balloon';
import {BASE_PATH, clippyLoad, clippyReady, clippySoundsReady} from './load';
import Queue from './queue';

export const clippy = {
  Agent: Agent,
  Animator: Animator,
  Balloon: Balloon,
  BASE_PATH: BASE_PATH,
  load: clippyLoad,
  ready: clippyReady,
  soundsReady: clippySoundsReady,
  Queue: Queue,
};

(function() { return window.clippy = clippy; })();
