declare module 'rehype-external-img-size'
declare module '@torchlight-api/torchlight-cli' {
  export class Block {
    constructor(init: { language: string; code: string })
  }

  type Highlighted = {
    code: string
    language: string
    theme: string
    highlighted: string
    classes: string
    styles: string
  }

  export const torchlight: {
    init(opts: { token: string; theme: string }): void
    highlight(blocks: Block[]): Promise<Highlighted[]>
  }
}
