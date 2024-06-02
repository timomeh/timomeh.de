import { env } from '@/env'
import { PayloadRequest } from 'payload/types'
import { RevalidateAction } from '@/app/api/revalidate/route'

export async function revalidateHook(
  action: RevalidateAction,
  req: PayloadRequest,
) {
  req.payload.logger.info(`Revalidating hook ${action}`)

  try {
    const res = await fetch(
      `${env.PAYLOAD_PUBLIC_SERVER_URL}/api/revalidate?action=${action}`,
      {
        headers: {
          'x-secret': env.PAYLOAD_NEXT_BRIDGE_SECRET,
        },
      },
    )

    if (res.ok) {
      req.payload.logger.info(`Revalidated hook ${action}`)
    } else {
      req.payload.logger.error(`Error in revalidate hook ${action}`)
    }
  } catch (e) {
    req.payload.logger.error(`Failed to call revalidate api for hook ${action}`)
  }
}
