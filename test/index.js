const testsContext = require.context('.', true, /_test$/);
testsContext.keys().forEach(testsContext);

const clippyContext = require.context('../src/', true, /index\.js$/);
clippyContext.keys().forEach(clippyContext);
