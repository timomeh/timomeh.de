import { test as setup } from '@playwright/test'

setup('seed database', async ({ request }) => {
  await request.get(
    `/webhooks/nuke?soft=true&secret=${process.env.NUKE_SECRET}`,
  )
})
