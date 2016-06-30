/* eslint node: true */

import clippy from '../src';

describe('clippy', () => {
  it('should exist', () => {
    expect(clippy).toBeDefined();
  });

  it('has an Agent', () => {
    expect(clippy.Agent).toBeDefined();
  });

  it('has Animator', () => {
    expect(clippy.Animator).toBeDefined();
  });

  it('has Balloon', () => {
    expect(clippy.Balloon).toBeDefined();
  });

  it('has load', () => {
    expect(clippy.load).toBeDefined();
    expect(clippy.load).toEqual(jasmine.any(Function));
  });

  it('has ready', () => {
    expect(clippy.ready).toBeDefined();
    expect(clippy.ready).toEqual(jasmine.any(Function));
  });

  it('has soundsReady', () => {
    expect(clippy.soundsReady).toBeDefined();
    expect(clippy.soundsReady).toEqual(jasmine.any(Function));
  });

  it('has queue', () => {
    expect(clippy.Queue).toBeDefined();
  });
});
