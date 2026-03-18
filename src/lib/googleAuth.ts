// src/lib/googleAuth.ts

const SCOPE = 'https://www.googleapis.com/auth/drive.file'

let cachedToken: string | null = null
let tokenExpiry = 0

type TokenResponse = {
  access_token: string
  expires_in: number
  error?: string
}

type TokenClient = {
  requestAccessToken: () => void
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (r: TokenResponse) => void
            error_callback?: (e: { type?: string }) => void
          }) => TokenClient
        }
      }
    }
  }
}

export function getGoogleAccessToken(): Promise<string> {
  if (!window.google?.accounts?.oauth2) {
    return Promise.reject(new Error('Google Sign-In not loaded'))
  }

  // Return cached token if still valid (60s buffer)
  if (cachedToken && Date.now() < tokenExpiry - 60_000) {
    return Promise.resolve(cachedToken)
  }

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

  return new Promise<string>((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPE,
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error))
          return
        }
        cachedToken = response.access_token
        tokenExpiry = Date.now() + (response.expires_in ?? 3600) * 1000
        resolve(response.access_token)
      },
      error_callback: (err) => {
        reject(new Error(err.type ?? 'auth_error'))
      },
    })
    client.requestAccessToken()
  })
}

/** Clear cached token (e.g. on expiry) */
export function clearGoogleToken() {
  cachedToken = null
  tokenExpiry = 0
}
