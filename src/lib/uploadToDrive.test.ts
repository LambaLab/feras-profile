// src/lib/uploadToDrive.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { uploadDocxToDrive } from './uploadToDrive'

describe('uploadDocxToDrive', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('POSTs to Drive API and returns a Google Docs URL', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'abc123' }),
    }))

    const blob = new Blob(['test'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    const url = await uploadDocxToDrive(blob, 'My Resume', 'tok_test')

    expect(url).toBe('https://docs.google.com/document/d/abc123/edit')
    const fetchCall = vi.mocked(fetch).mock.calls[0]
    expect(fetchCall[0]).toContain('upload/drive/v3/files')
    expect((fetchCall[1]?.headers as Record<string, string>)?.Authorization).toBe('Bearer tok_test')
  })

  it('throws when Drive API returns an error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
    }))

    const blob = new Blob(['test'])
    await expect(uploadDocxToDrive(blob, 'My Resume', 'bad_token')).rejects.toThrow('Drive upload failed: 403')
  })
})
