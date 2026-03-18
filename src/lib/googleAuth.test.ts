// src/lib/googleAuth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('getGoogleAccessToken', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('calls initTokenClient and resolves with the access token', async () => {
    const mockRequestAccessToken = vi.fn()
    let capturedCallback: (r: { access_token: string; expires_in: number }) => void

    Object.defineProperty(window, 'google', {
      value: {
        accounts: {
          oauth2: {
            initTokenClient: vi.fn((config) => {
              capturedCallback = config.callback
              return { requestAccessToken: mockRequestAccessToken }
            }),
          },
        },
      },
      writable: true,
      configurable: true,
    })

    const { getGoogleAccessToken } = await import('./googleAuth')
    const promise = getGoogleAccessToken()
    capturedCallback!({ access_token: 'tok_123', expires_in: 3600 })
    const token = await promise
    expect(token).toBe('tok_123')
    expect(mockRequestAccessToken).toHaveBeenCalled()
  })

  it('rejects when google.accounts.oauth2 is not loaded', async () => {
    Object.defineProperty(window, 'google', {
      value: undefined,
      writable: true,
      configurable: true,
    })

    const { getGoogleAccessToken } = await import('./googleAuth')
    await expect(getGoogleAccessToken()).rejects.toThrow('Google Sign-In not loaded')
  })
})
