import { defineConfig, devices } from '@playwright/test'

const PORT = process.env.PORT || 3000
const baseURL = `http://localhost:${PORT}`

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    process.env.CI ? ['github'] : ['html'],
    [
      '@argos-ci/playwright/reporter',
      { uploadToArgos: !!process.env.CI && !!process.env.UPLOAD_TO_ARGOS },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium-e2e',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /.*smoke\.spec\.ts/,
    },
    {
      name: 'production',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://timomeh.de',
      },
      retries: 2,
      testMatch: /.*smoke\.spec\.ts/,
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer:
    process.env.PLAYWRIGHT_WEB_SERVER !== '0'
      ? {
          command: 'pnpm dev',
          url: baseURL,
          reuseExistingServer: !process.env.CI,
        }
      : undefined,
})
