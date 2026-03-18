# Google Auth + Drive Upload Design

## Goal
When a viewer clicks "Google Doc", authenticate them with Google (GIS implicit flow), generate a .docx blob, upload it to their Google Drive as a native Google Doc, then open it in a new tab.

## Architecture
Pure client-side — no backend. Uses Google Identity Services (GIS) `gsi/client` script via CDN loaded in `index.html`. Access token cached in memory, re-requested on expiry. Drive upload uses multipart REST API with `mimeType=application/vnd.google-apps.document` to auto-convert .docx → Google Doc.

## Tech
- `google.accounts.oauth2.initTokenClient()` — GIS implicit token flow
- Google Drive REST API v3 — multipart upload
- `VITE_GOOGLE_CLIENT_ID` env var — client ID in `.env.local` + Vercel

## Files
- `index.html` — add GIS script tag
- `src/lib/googleAuth.ts` — `getGoogleAccessToken(): Promise<string>` (token client, memory cache)
- `src/lib/uploadToDrive.ts` — `uploadDocxToDrive(blob, name, token): Promise<string>` (returns doc URL)
- `src/components/resume/ResumeDownloadButton.tsx` — replace Google Doc `triggerDocxDownload` call with `handleGoogleDoc()` async fn, add loading/error state
- `.env.local` — `VITE_GOOGLE_CLIENT_ID=965948064160-n5j9ol4se2j199toq3lbl90tn2spkfil.apps.googleusercontent.com`
- Vercel dashboard — add same env var

## Flow
1. Click "Google Doc"
2. Button shows "Signing in…"
3. GIS popup → user approves drive.file scope
4. Token returned in memory
5. Button shows "Uploading…"
6. generateDocxBlob(profile) → Blob
7. POST to Drive API (multipart): metadata={name, mimeType:google-apps.document} + .docx body
8. Response → fileId → open `https://docs.google.com/document/d/{fileId}/edit`
9. Button resets

## Error handling
- Popup blocked / user cancelled → show "Sign-in cancelled" for 3s then reset
- Upload failed → show "Upload failed, try again" for 3s then reset
- Token expired (1hr) → re-request silently on next click
