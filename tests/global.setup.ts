import { expect, test as setup } from '@playwright/test'

setup('seed database', async ({ request }) => {
  const response = await request.get(
    `/webhooks/nuke?soft=true&secret=${process.env.NUKE_SECRET}`,
  )
  await expect(response).toBeOK()
})
