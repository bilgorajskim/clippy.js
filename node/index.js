import Agent from './agent';
import Animator from './animator';
import Balloon from './balloon';
import {BASE_PATH, load, ready, soundsReady} from './load';
import Queue from './queue';

export const clippy = {
  Agent: Agent,
  Animator: Animator,
  Balloon: Balloon,
  BASE_PATH: BASE_PATH,
  load: load,
  ready: ready,
  soundsReady: soundsReady
};
