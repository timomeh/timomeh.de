import { cache } from 'react'
import { Vla } from 'vla'

export const kernel = new Vla.Kernel()

Vla.setInvokeKernelProvider(cache(() => kernel.scoped()))
