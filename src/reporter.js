/**
 * Playwright reporter → OpenTelemetry-inspired JSON spans.
 * @typedef {{ outputFile?: string, serviceName?: string }} OtelReporterOptions
 */
const fs = require('fs');
const path = require('path');

class PlaywrightOtelReporter {
  /**
   * @param {OtelReporterOptions} [options]
   */
  constructor(options = {}) {
    this.outputFile = options.outputFile || 'test-results/otel-spans.json';
    this.serviceName = options.serviceName || 'playwright';
    /** @type {any[]} */
    this.spans = [];
  }

  onBegin() {
    this.spans = [];
  }

  /**
   * @param {import('@playwright/test/reporter').TestCase} test
   * @param {import('@playwright/test/reporter').TestResult} result
   */
  onTestEnd(test, result) {
    const start = BigInt(result.startTime.getTime()) * 1000000n;
    const end = start + BigInt(Math.max(result.duration, 0)) * 1000000n;
    const statusCode = result.status === 'passed' ? 1 : result.status === 'skipped' ? 0 : 2;
    const titlePath = [...test.titlePath()].filter(Boolean).join(' › ');

    this.spans.push({
      name: titlePath || test.title,
      kind: 1,
      startTimeUnixNano: start.toString(),
      endTimeUnixNano: end.toString(),
      status: {
        code: statusCode,
        message: result.status === 'passed' ? undefined : result.error?.message,
      },
      attributes: [
        { key: 'test.status', value: { stringValue: result.status } },
        { key: 'test.file', value: { stringValue: test.location.file } },
        { key: 'test.title', value: { stringValue: test.title } },
        { key: 'test.project', value: { stringValue: test.parent?.project()?.name || 'default' } },
        { key: 'test.retries', value: { intValue: result.retry } },
        { key: 'test.duration_ms', value: { intValue: result.duration } },
      ],
    });
  }

  async onEnd() {
    const payload = {
      resourceSpans: [
        {
          resource: {
            attributes: [
              { key: 'service.name', value: { stringValue: this.serviceName } },
              { key: 'telemetry.sdk.name', value: { stringValue: 'playwright-otel-reporter' } },
              { key: 'telemetry.sdk.version', value: { stringValue: '0.1.0' } },
            ],
          },
          scopeSpans: [
            {
              scope: { name: 'playwright', version: '0.1.0' },
              spans: this.spans,
            },
          ],
        },
      ],
    };

    const out = path.resolve(this.outputFile);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(payload, null, 2), 'utf8');
    console.log(`[playwright-otel-reporter] wrote ${this.spans.length} span(s) → ${out}`);
  }
}

module.exports = PlaywrightOtelReporter;
