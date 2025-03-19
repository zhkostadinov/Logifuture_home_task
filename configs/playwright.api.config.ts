// @ts-check
/* eslint-disable */
const { defineConfig, devices } = require('@playwright/test');
import baseConfig from './playwright.default.config.ts';

export default defineConfig({
  ...baseConfig,
  reporter: 'line',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    trace: 'off',
    actionTimeout: 90000,
  },
});
