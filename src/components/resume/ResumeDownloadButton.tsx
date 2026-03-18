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
      setTimeout(() => {
        setGoogleDocStatus('idle')
        setErrorMsg('')
      }, 3000)
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
          onClick={() => { void triggerDocxDownload(profile, 'resume'); onClose?.() }}
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
            onClick={() => { void triggerDocxDownload(profile, 'resume'); setOpen(false) }}
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
