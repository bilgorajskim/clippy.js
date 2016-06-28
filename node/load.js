import $ from 'jQuery';
import Agent from './agent';

export const BASE_PATH = 'agents/';


export function load(name, successCb, failCb, path) {
  path = path || BASE_PATH + name;

  var mapDfd = load._loadMap(path);
  var agentDfd = load._loadAgent(name, path);
  var soundsDfd = load._loadSounds(name, path);

  var data;
  agentDfd.done(function(d) { data = d; });

  var sounds;

  soundsDfd.done(function(d) { sounds = d; });

  // wrapper to the success callback
  var cb = function() {
    var a = new Agent(path, data, sounds);
    successCb(a);
  };

  $.when(mapDfd, agentDfd, soundsDfd).done(cb).fail(failCb);
};

load._maps = {};
load._loadMap = function(path) {
  var dfd = load._maps[path];
  if (dfd) return dfd;

  // set dfd if not defined
  dfd = load._maps[path] = $.Deferred();

  var src = path + '/map.png';
  var img = new Image();

  img.onload = dfd.resolve;
  img.onerror = dfd.reject;

  // start loading the map;
  img.setAttribute('src', src);

  return dfd.promise();
};

load._sounds = {};

load._loadSounds = function(name, path) {
  var dfd = load._sounds[name];
  if (dfd) return dfd;

  // set dfd if not defined
  dfd = load._sounds[name] = $.Deferred();

  var audio = document.createElement('audio');
  var canPlayMp3 = !!audio.canPlayType && '' != audio.canPlayType('audio/mpeg');
  var canPlayOgg = !!audio.canPlayType &&
      '' != audio.canPlayType('audio/ogg; codecs="vorbis"');

  if (!canPlayMp3 && !canPlayOgg) {
    dfd.resolve({});
  } else {
    var src = path + (canPlayMp3 ? '/sounds-mp3.js' : '/sounds-ogg.js');
    // load
    load._loadScript(src);
  }

  return dfd.promise()
};

load._data = {};
load._loadAgent = function(name, path) {
  var dfd = load._data[name];
  if (dfd) return dfd;

  dfd = load._getAgentDfd(name);

  var src = path + '/agent.js';

  load._loadScript(src);

  return dfd.promise();
};

load._loadScript = function(src) {
  var script = document.createElement('script');
  script.setAttribute('src', src);
  script.setAttribute('async', 'async');
  script.setAttribute('type', 'text/javascript');

  var dochead = document.head || document.getElementsByTagName('head')[0];
  dochead.appendChild(script);
};

load._getAgentDfd = function(name) {
  var dfd = load._data[name];
  if (!dfd) {
    dfd = load._data[name] = $.Deferred();
  }
  return dfd;
};

export function ready(name, data) {
  var dfd = load._getAgentDfd(name);
  dfd.resolve(data);
};

export function soundsReady(name, data) {
  var dfd = load._sounds[name];
  if (!dfd) {
    dfd = load._sounds[name] = $.Deferred();
  }

  dfd.resolve(data);
};
