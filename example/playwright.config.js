// @ts-check
const { defineConfig } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [
    ['list'],
    [path.join(__dirname, '..', 'src', 'reporter.js'), {
      outputFile: path.join(__dirname, 'test-results', 'otel-spans.json'),
      serviceName: 'playwright-otel-example',
    }],
  ],
  use: {
    trace: 'on-first-retry',
  },
});
