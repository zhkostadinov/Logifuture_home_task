// @ts-check
/* eslint-disable */
const { defineConfig } = require('@playwright/test');

export default defineConfig({
  timeout: 6 * 60 * 1000,
  testDir: '../tests/',
});
