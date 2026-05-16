'use client'

import { Tooltip } from 'react-tooltip'

export function TooltipInit() {
  return (
    <Tooltip
      id="page-tt"
      className="page-tooltip"
      opacity={1}
      border="1px solid currentColor"
    />
  )
}
