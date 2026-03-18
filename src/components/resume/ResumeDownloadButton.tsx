// src/components/resume/ResumeDownloadButton.tsx
import { useState, useRef, useEffect } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ResumePDF } from './ResumePDF'
import { generateDocxBlob } from './generateDocx'
import type { Profile } from '../../data/profileData'

interface ResumeDownloadButtonProps {
  profile: Profile
  /** 'pill' = desktop dropdown pill; 'menu-item' = flat items for parent dropdown */
  variant: 'pill' | 'menu-item'
  /** Called after any download action (to close a parent dropdown if needed) */
  onClose?: () => void
}

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

  if (variant === 'menu-item') {
    // Mobile: render three flat items directly into the parent ··· dropdown
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
          onClick={() => { triggerDocxDownload(profile, 'google-doc'); onClose?.() }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full text-left"
        >
          Google Doc
        </button>
      </>
    )
  }

  // Desktop: "Download CV ▾" pill that opens its own dropdown
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
            onClick={() => { triggerDocxDownload(profile, 'google-doc'); setOpen(false) }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full text-left"
          >
            Google Doc
          </button>
        </div>
      )}
    </div>
  )
}
