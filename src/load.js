import $ from 'jquery';

import Agent from './agent';

export const BASE_PATH = 'agents/';

export function clippyLoad(name, successCb, failCb, path) {
  path = path || BASE_PATH + name;

  var mapDfd = clippyLoad._loadMap(path);
  var agentDfd = clippyLoad._loadAgent(name, path);
  var soundsDfd = clippyLoad._loadSounds(name, path);

  var data;
  agentDfd.done((d) => {
    data = d;
  });

  var sounds;
  soundsDfd.done((d) => {
    sounds = d;
  });

  // wrapper to the success callback
  var cb = function() {
    var a = new Agent(path, data, sounds);
    successCb(a);
  };

  $.when(mapDfd, agentDfd, soundsDfd).done(cb).fail(failCb);
}

clippyLoad._maps = {};
clippyLoad._loadMap = function(path) {
  var dfd = clippyLoad._maps[path];
  if (dfd)
    return dfd;

  // set dfd if not defined
  dfd = clippyLoad._maps[path] = $.Deferred();

  var src = path + '/map.png';
  var img = new Image();

  img.onload = dfd.resolve;
  img.onerror = dfd.reject;

  // start loading the map;
  img.setAttribute('src', src);

  return dfd.promise();
};

clippyLoad._sounds = {};
clippyLoad._loadSounds = function(name, path) {
  var dfd = clippyLoad._sounds[name];
  if (dfd)
    return dfd;

  // set dfd if not defined
  dfd = clippyLoad._sounds[name] = $.Deferred();

  var audio = document.createElement('audio');
  var canPlayMp3 = !!audio.canPlayType && '' != audio.canPlayType('audio/mpeg');
  var canPlayOgg = !!audio.canPlayType &&
                   '' != audio.canPlayType('audio/ogg; codecs="vorbis"');

  if (!canPlayMp3 && !canPlayOgg) {
    dfd.resolve({});
  } else {
    var src = path + (canPlayMp3 ? '/sounds-mp3.js' : '/sounds-ogg.js');
    // load
    clippyLoad._loadScript(src);
  }

  return dfd.promise();
};

clippyLoad._data = {};
clippyLoad._loadAgent = function(name, path) {
  var dfd = clippyLoad._data[name];
  if (dfd)
    return dfd;

  dfd = clippyLoad._getAgentDfd(name);

  var src = path + '/agent.js';

  clippyLoad._loadScript(src);

  return dfd.promise();
};

clippyLoad._loadScript = function(src) {
  var script = document.createElement('script');
  script.setAttribute('src', src);
  script.setAttribute('async', 'async');
  script.setAttribute('type', 'text/javascript');

  var dochead = document.head || document.getElementsByTagName('head')[0];
  dochead.appendChild(script);
};

clippyLoad._getAgentDfd = function(name) {
  var dfd = clippyLoad._data[name];
  if (!dfd) {
    dfd = clippyLoad._data[name] = $.Deferred();
  }
  return dfd;
};

export function clippyReady(name, data) {
  var dfd = clippyLoad._getAgentDfd(name);
  dfd.resolve(data);
}

export function clippySoundsReady(name, data) {
  var dfd = clippyLoad._sounds[name];
  if (!dfd) {
    dfd = clippyLoad._sounds[name] = $.Deferred();
  }

  dfd.resolve(data);
}
