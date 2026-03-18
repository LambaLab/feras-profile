// __mocks__/docx.ts
export class Document {
  constructor(_opts: unknown) {}
}
export class Paragraph {
  constructor(_opts: unknown) {}
}
export class TextRun {
  constructor(_opts: unknown) {}
}
export class Packer {
  static toBlob(_doc: unknown): Promise<Blob> {
    return Promise.resolve(
      new Blob(['mock-docx'], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })
    )
  }
}
export const BorderStyle = { SINGLE: 'single' }
