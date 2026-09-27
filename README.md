# Playwright API Automation Framework

A TypeScript-based API automation framework built with Playwright Test, featuring schema validation, reusable API clients, Dockerized execution, and Jenkins CI/CD integration.

## Tech Stack

* TypeScript
* Playwright Test
* Playwright APIRequestContext
* Zod
* Docker
* Jenkins
* GitHub
* JUnit reporting
* Playwright HTML reporting

## Framework Features

* API test automation using Playwright
* Reusable API client and service-layer architecture
* Request and response validation using Zod schemas
* Authentication and token management
* Environment-based configuration
* Structured logging
* Parallel test execution
* CI-specific retry configuration
* Dockerized test execution
* JUnit test reporting
* Playwright HTML reports
* GitHub webhook-triggered Jenkins builds

## Test Coverage

The framework currently contains API tests covering:

* Authentication / Login
* Users
* Products
* Cart operations

The current test suite contains **24 API tests**.

## Architecture & CI/CD

A push to the `main` branch triggers the Jenkins pipeline through a GitHub webhook.

```text
Developer Push
      │
      ▼
   GitHub
      │
      │ Webhook
      ▼
Cloudflare Tunnel
      │
      ▼
   Jenkins
      │
      ▼
 Docker Build
      │
      ▼
Playwright API Tests
      │
      ├──────────────► JUnit Results
      │
      └──────────────► Playwright HTML Report
```

The Jenkins pipeline:

1. Checks out the repository.
2. Builds the Docker image.
3. Injects CI environment variables and credentials.
4. Runs the API tests inside Docker.
5. Collects JUnit test results.
6. Archives the Playwright HTML report.

The Docker image uses the official Playwright image, providing a consistent and reproducible test environment.

> **Note:** The current Jenkins instance and Cloudflare Tunnel run on a local development machine. An always-available CI server is planned as a future improvement.

## Docker Execution

The tests can be executed inside Docker using:

```bash
docker build -t playwright-api-tests .
```

Then:

```bash
docker run --rm \
  -e CI=true \
  -e API_BASE_URL="https://dummyjson.com" \
  -e LOG_LEVEL="info" \
  -e API_USERNAME="<username>" \
  -e API_PASSWORD="<password>" \
  playwright-api-tests
```

Credentials should not be committed to the repository.

## Local Execution

Install dependencies:

```bash
npm ci
```

Create a `.env` file containing the required environment variables.

Example:

```text
API_BASE_URL=https://dummyjson.com
LOG_LEVEL=info
API_USERNAME=<username>
API_PASSWORD=<password>
```

Run all tests:

```bash
npm test
```

Run individual suites:

```bash
npm run test:login
npm run test:users
npm run test:products
npm run test:cart
```

Generate and open the Playwright HTML report:

```bash
npx playwright show-report
```

## Project Structure

```text
pw-api/
│
├── src/
│   ├── api/
│   │   ├── client/
│   │   │   └── apiClient.ts
│   │   └── schema/
│   │       ├── auth.schema.ts
│   │       ├── cart.schema.ts
│   │       ├── product.schema.ts
│   │       ├── user.schema.ts
│   │       └── validate.schema.ts
│   │
│   ├── fixtures/
│   │   └── apiFixtures.ts
│   │
│   ├── tests/
│   │   ├── cart.api.spec.ts
│   │   ├── login.api.spec.ts
│   │   ├── products.api.spec.ts
│   │   └── users.api.spec.ts
│   │
│   └── utils/
│       ├── logger.ts
│       ├── reporter.ts
│       └── retry.ts
│
├── Dockerfile
├── Jenkinsfile
├── playwright.config.ts
├── package.json
├── package-lock.json
├── .dockerignore
└── .gitignore
```

## Reporting

### JUnit

Jenkins consumes the generated JUnit XML report:

```text
test-results/results.xml
```

### Playwright HTML Report

The Playwright HTML report is archived by Jenkins and published as a build artifact.

## CI Environment

The Jenkins pipeline uses environment variables and Jenkins Credentials for configuration and authentication.

Sensitive credentials are injected at build time rather than stored in the source code.

The `.env` file is excluded from version control.

## Future Improvements

* Run Jenkins on an always-available CI server
* Add additional API test coverage
* Add API contract testing
* Add test environment configuration
* Add scheduled regression execution
