/* eslint node: true */
'use strict';

function normalizeEnv(arg) {
  if (arg === 'development' || arg === 'd') {
    return 'development';
  } else if (arg === 'test' || arg === 't') {
    return 'test';
  } else if (arg === 'production' || arg === 'p') {
    return 'production';
  }
}

function validEnvArg(arg) {
  let normalized = normalizeEnv(arg);
  return (normalized && typeof normalized === 'string');
}

function env(arg) {
  if (arg && validEnvArg(arg)) {
    env.__env = normalizeEnv(arg);
  } else if (process.env.NODE_ENV && validEnvArg(process.env.NODE_ENV)) {
    env.__env = normalizeEnv(process.env.NODE_ENV);
  } else {
    env.__env = 'development';
  }

  return env.__env;
}

env.__env = process.env.NODE_ENV || 'development';

env.development = (arg = false) => {
  if (arg) {
    env.__env = 'development';
  }

  return env.__env === 'development';
};

env.production = (arg = false) => {
  if (arg) {
    env.__env = 'production';
  }

  return env.__env === 'production';
};

env.test = (arg = false) => {
  if (arg) {
    env.__env = 'test';
  }

  return env.__env === 'test';
};

module.exports = env;
