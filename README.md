# playwright-otel-reporter

Playwright **custom reporter** that emits **OpenTelemetry-style spans** for each test (and optional steps) as JSON — so CI and observability backends can treat test runs like production telemetry.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)

> Phase-4 growth sample from the AIQA / observability roadmap · [Portfolio](https://avinash258.github.io/portfolio/)

## Why

Screenshots alone are weak triage signals. Emitting spans per test lets you:

- Correlate slow tests with wall-clock and retries
- Feed dashboards (Jaeger / Grafana / custom) without a proprietary format
- Keep the same “tests as software” mindset as product services

This v0.1 exporter writes an **OTLP-inspired JSON** file. Wiring a live OTLP/HTTP exporter is on the roadmap.

## Install

```bash
npm install -D playwright-otel-reporter
# or use from this repo path during development:
# npm install -D ./path/to/playwright-otel-reporter
```

## Configure Playwright

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['list'],
    ['playwright-otel-reporter', { outputFile: 'test-results/otel-spans.json' }],
  ],
});
```

Or with a relative path while developing this repo:

```ts
reporter: [
  ['list'],
  ['./node_modules/playwright-otel-reporter/src/reporter.js', { outputFile: 'otel-spans.json' }],
],
```

## Output shape (simplified)

```json
{
  "resourceSpans": [
    {
      "resource": { "attributes": [{ "key": "service.name", "value": { "stringValue": "playwright" } }] },
      "scopeSpans": [
        {
          "spans": [
            {
              "name": "chromium â€º cart â€º View Cart with Multiple Items",
              "kind": 1,
              "startTimeUnixNano": "...",
              "endTimeUnixNano": "...",
              "status": { "code": 1 },
              "attributes": [
                { "key": "test.status", "value": { "stringValue": "passed" } },
                { "key": "test.file", "value": { "stringValue": "tests/cart.spec.ts" } }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Options

| Option | Default | Description |
|---|---|---|
| `outputFile` | `test-results/otel-spans.json` | Where to write the JSON export |
| `serviceName` | `playwright` | `service.name` resource attribute |

## Local demo

```bash
npm ci
npm test
# writes example-project/test-results/otel-spans.json when run from example
```

See `example/` for a minimal Playwright project wired to the reporter.

## Roadmap

- [x] Custom reporter → OTLP-inspired JSON file
- [ ] OTLP/HTTP exporter (env: `OTEL_EXPORTER_OTLP_ENDPOINT`)
- [ ] Step-level spans from Playwright hooks
- [ ] Publish to npm as `playwright-otel-reporter`

## License

MIT — see [LICENSE](LICENSE).

## Author

**Avinash Sharma** — QA Automation Architect / Lead SDET  
[GitHub](https://github.com/Avinash258) · [Portfolio](https://avinash258.github.io/portfolio/)
