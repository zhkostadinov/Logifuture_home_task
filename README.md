## Main Concepts

Code decomposition.

There should be a balance between code and template engines (JSON). Practicality is key.

We follow the industry's good practices where applicable and sensible. Tests follow AAA pattern


IMPORTANT When adding dependency to the project (a package), be sure to list it in the package.json, we use YARN.

Read the official Playwright documentation at https://playwright.dev/docs/intro

All sensitive data is kept as env vars. Passwords, accounts, etc. are set as secrets.

The hermetic pattern states that every test should be completely independent and self-sufficient! This is achieved by proper Fixture strategies


Abstractions live longer than details, so when creating test logic, invest in the abstractions, not the concrete implementation. Abstractions can survive the barrage of changes from different implementations and new technologies.


Convention over Configuration: It is better to utilize the playwright's support (config) for configuration instead of our own. We try to minimize OS reading and later on, just use it in all configs. Implement an enum for the configs, so all hardcoded data is in SSOT place.

Favour Dynamic over Static test data. New users, Disposable temporary e-mail addresses etc. should be part of Fresh Fixture.

Parallel test execution, and horizontal scaling of Test agent/runner containers (due to virtualization issues with non-GPU browser rendering). Always keep in mind the CI server execution, when creating tests.

Retry - retrying several times when a call to the app fails.

## Architecture

- [Playwright](https://playwright.dev/) to enable Web and API tests
- [env-cmd](https://www.npmjs.com/package/env-cmd) that loads environment variables are to be injected in the configs
- [nvm](https://github.com/nvm-sh/nvm) node version manager
- [prettier](https://prettier.io/docs/en/) code formatter
- [eslint](https://eslint.org/) statically code analyzes

### Project structure breakdown

`configs` - test configurations

`core` - contains the main FW functions organized like:

    api - contains functionality and helpers for API calls. The idea is to support back door manipulation patterns etc.

`data` - UI element locators, static data

`tests` - Web and API tests split by functionality

`utils` - Data loader and models

## Development

`npm v10.5.0`

`node v20.12.1`

`yarn v1.22.22`


### Running Tests Locally

1. Run code formatter and code Beautifier

```sh
yarn run prettier
```

```sh
yarn add lint
```

### Running Tests Locally

1. Setup your IDE to use the Playwright plugins
2. Create the file `.env.vault` in the root project folder. Add needed environmental variables to it.
3. Install dependencies with:

```sh
yarn
```

4. Run backend tests with:

```sh
yarn run tests:api
```
