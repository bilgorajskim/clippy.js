
import clippy from '../../src';

describe('Agent', () => {
  it('exists', () => {
    expect(clippy.Agent).toBeDefined();
  });

  describe('creating the agent', () => {
    var theAgent;
    beforeEach(function(done) {
      clippy.load('Clippy', function(agent) {
        theAgent = agent;
        done();
      });
    });

    it('works', (done) => {
      expect(theAgent).toBeTruthy();
      done();
    });
  });
});
