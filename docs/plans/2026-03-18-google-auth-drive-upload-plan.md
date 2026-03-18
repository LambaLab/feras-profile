# Google Auth + Drive Upload Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** When a viewer clicks "Google Doc", authenticate with Google GIS, upload the generated .docx as a native Google Doc to their Drive, and open it in a new tab.

**Architecture:** Pure client-side. GIS `gsi/client` script loaded in `index.html`. `getGoogleAccessToken()` opens a popup and caches the token in memory. `uploadDocxToDrive()` posts a multipart request to the Drive v3 REST API with `mimeType=application/vnd.google-apps.document` so Drive auto-converts the .docx to a Google Doc.

**Tech Stack:** Google Identity Services (GIS), Google Drive REST API v3, Vite env vars (`VITE_GOOGLE_CLIENT_ID`), TypeScript, Vitest

---

### Task 1: Env var + GIS script

**Files:**
- Create: `feras-profile/.env.local`
- Modify: `feras-profile/index.html`

**Step 1: Create `.env.local`**

```
VITE_GOOGLE_CLIENT_ID=965948064160-n5j9ol4se2j199toq3lbl90tn2spkfil.apps.googleusercontent.com
```

**Step 2: Add GIS script to `index.html` (before closing `</body>`)**

```html
  <div id="root"></div>
  <script src="https://accounts.google.com/gsi/client" async></script>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

**Step 3: Verify build still passes**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm run build
```
Expected: no errors

**Step 4: Commit**

```bash
git add index.html .env.local
# NOTE: .env.local is in .gitignore — only index.html will be staged
git add index.html
git commit -m "feat: load GIS script for Google OAuth"
```

---

### Task 2: `googleAuth.ts` — token client

**Files:**
- Create: `src/lib/googleAuth.ts`
- Test: `src/lib/googleAuth.test.ts`

**Step 1: Write the failing test**

Create `src/lib/googleAuth.test.ts`:

```typescript
// src/lib/googleAuth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// We can't test real OAuth — test the token caching logic by mocking window.google
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
```

**Step 2: Run to verify it fails**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run src/lib/googleAuth.test.ts
```
Expected: FAIL — module not found

**Step 3: Implement `src/lib/googleAuth.ts`**

```typescript
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

/** Clear cached token (e.g. on sign-out or expiry) */
export function clearGoogleToken() {
  cachedToken = null
  tokenExpiry = 0
}
```

**Step 4: Run tests**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run src/lib/googleAuth.test.ts
```
Expected: 2 passing

**Step 5: Commit**

```bash
git add src/lib/googleAuth.ts src/lib/googleAuth.test.ts
git commit -m "feat: add getGoogleAccessToken with GIS token client and memory cache"
```

---

### Task 3: `uploadToDrive.ts` — multipart Drive upload

**Files:**
- Create: `src/lib/uploadToDrive.ts`
- Test: `src/lib/uploadToDrive.test.ts`

**Step 1: Write the failing test**

Create `src/lib/uploadToDrive.test.ts`:

```typescript
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
```

**Step 2: Run to verify it fails**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run src/lib/uploadToDrive.test.ts
```
Expected: FAIL — module not found

**Step 3: Implement `src/lib/uploadToDrive.ts`**

```typescript
// src/lib/uploadToDrive.ts

export async function uploadDocxToDrive(
  blob: Blob,
  fileName: string,
  accessToken: string
): Promise<string> {
  const metadata = {
    name: fileName,
    mimeType: 'application/vnd.google-apps.document',
  }

  const form = new FormData()
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  )
  form.append('file', blob)

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    }
  )

  if (!response.ok) {
    throw new Error(`Drive upload failed: ${response.status}`)
  }

  const { id } = await response.json() as { id: string }
  return `https://docs.google.com/document/d/${id}/edit`
}
```

**Step 4: Run tests**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run src/lib/uploadToDrive.test.ts
```
Expected: 2 passing

**Step 5: Commit**

```bash
git add src/lib/uploadToDrive.ts src/lib/uploadToDrive.test.ts
git commit -m "feat: add uploadDocxToDrive — multipart Drive REST API upload"
```

---

### Task 4: Wire up `ResumeDownloadButton.tsx`

**Files:**
- Modify: `src/components/resume/ResumeDownloadButton.tsx`

**Step 1: Replace the Google Doc click handlers**

The current Google Doc buttons call `triggerDocxDownload(profile, 'resume', true)`.

Replace both (mobile `menu-item` variant and desktop `pill` variant) with a new `handleGoogleDoc` async function. Add `googleDocStatus` state to the component.

Full updated `ResumeDownloadButton.tsx`:

```typescript
// src/components/resume/ResumeDownloadButton.tsx
import { useState, useRef, useEffect } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ResumePDF } from './ResumePDF'
import { generateDocxBlob } from './generateDocx'
import { getGoogleAccessToken } from '../../lib/googleAuth'
import { uploadDocxToDrive } from '../../lib/uploadToDrive'
import type { Profile } from '../../data/profileData'

interface ResumeDownloadButtonProps {
  profile: Profile
  variant: 'pill' | 'menu-item'
  onClose?: () => void
}

type GoogleDocStatus = 'idle' | 'signing-in' | 'uploading' | 'error'

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function triggerDocxDownload(profile: Profile, suffix: string) {
  const blob = await generateDocxBlob(profile)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${slugify(profile.name)}-${suffix}.docx`
  a.click()
  URL.revokeObjectURL(url)
}

export function ResumeDownloadButton({ profile, variant, onClose }: ResumeDownloadButtonProps) {
  const [open, setOpen] = useState(false)
  const [googleDocStatus, setGoogleDocStatus] = useState<GoogleDocStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const pdfFileName = `${slugify(profile.name)}-resume.pdf`

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  async function handleGoogleDoc(closeParent?: () => void) {
    try {
      setGoogleDocStatus('signing-in')
      const token = await getGoogleAccessToken()

      setGoogleDocStatus('uploading')
      const blob = await generateDocxBlob(profile)
      const docUrl = await uploadDocxToDrive(
        blob,
        `${profile.name} — Resume`,
        token
      )

      setGoogleDocStatus('idle')
      closeParent?.()
      window.open(docUrl, '_blank', 'noopener')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      // Treat user cancellation silently
      if (msg === 'access_denied' || msg === 'popup_closed_by_user') {
        setGoogleDocStatus('idle')
        return
      }
      setErrorMsg('Upload failed — try again')
      setGoogleDocStatus('error')
      setTimeout(() => setGoogleDocStatus('idle'), 3000)
    }
  }

  function googleDocLabel(status: GoogleDocStatus) {
    if (status === 'signing-in') return 'Signing in…'
    if (status === 'uploading') return 'Uploading…'
    if (status === 'error') return errorMsg
    return 'Google Doc'
  }

  if (variant === 'menu-item') {
    return (
      <>
        <PDFDownloadLink
          document={<ResumePDF profile={profile} />}
          fileName={pdfFileName}
          onClick={onClose}
        >
          {({ loading }) => (
            <span className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full cursor-pointer">
              {loading ? 'Building PDF…' : 'Download PDF'}
            </span>
          )}
        </PDFDownloadLink>
        <button
          data-testid="download-word"
          onClick={() => { triggerDocxDownload(profile, 'resume'); onClose?.() }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full text-left"
        >
          Download Word
        </button>
        <button
          data-testid="download-google-doc"
          disabled={googleDocStatus !== 'idle'}
          onClick={() => handleGoogleDoc(onClose)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full text-left disabled:opacity-60"
        >
          {googleDocLabel(googleDocStatus)}
        </button>
      </>
    )
  }

  // Desktop pill variant
  return (
    <div className="hidden sm:block relative" ref={ref} data-testid="download-cv-wrapper">
      <button
        data-testid="download-cv-trigger"
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-gray-400 text-li-text-secondary text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors"
      >
        Download CV
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
          <path d="M5 7L0.5 2.5h9L5 7z"/>
        </svg>
      </button>

      {open && (
        <div
          data-testid="download-cv-menu"
          className="absolute left-0 top-10 w-44 bg-white rounded-lg shadow-lg border border-li-border z-20 py-1"
        >
          <PDFDownloadLink
            document={<ResumePDF profile={profile} />}
            fileName={pdfFileName}
            onClick={() => setOpen(false)}
          >
            {({ loading }) => (
              <span className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full cursor-pointer">
                {loading ? 'Building…' : 'PDF'}
              </span>
            )}
          </PDFDownloadLink>
          <button
            data-testid="download-word-desktop"
            onClick={() => { triggerDocxDownload(profile, 'resume'); setOpen(false) }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full text-left"
          >
            Word (.docx)
          </button>
          <button
            data-testid="download-google-doc-desktop"
            disabled={googleDocStatus !== 'idle'}
            onClick={() => handleGoogleDoc(() => setOpen(false))}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full text-left disabled:opacity-60"
          >
            {googleDocLabel(googleDocStatus)}
          </button>
        </div>
      )}
    </div>
  )
}
```

**Step 2: Run all tests**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run
```
Expected: all 65+ passing

**Step 3: Build check**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm run build
```
Expected: no errors

**Step 4: Commit**

```bash
git add src/components/resume/ResumeDownloadButton.tsx
git commit -m "feat: wire Google Doc button to GIS auth + Drive upload"
```

---

### Task 5: Add env var to Vercel + push

**Step 1: Add `VITE_GOOGLE_CLIENT_ID` to Vercel**

1. Go to https://vercel.com → feras-profile project → Settings → Environment Variables
2. Add:
   - Key: `VITE_GOOGLE_CLIENT_ID`
   - Value: `965948064160-n5j9ol4se2j199toq3lbl90tn2spkfil.apps.googleusercontent.com`
   - Environment: Production + Preview + Development
3. Click Save

**Step 2: Push to trigger deploy**

```bash
git push origin main
```

**Step 3: Verify on live site**

1. Go to https://feras-profile.vercel.app
2. Click Download CV → Google Doc
3. Google sign-in popup appears
4. After approval, button shows "Uploading…"
5. New tab opens with the Google Doc in the viewer's Drive
