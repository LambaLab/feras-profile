// src/components/resume/ResumeDownloadButton.tsx
import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { TemplatePickerModal } from './TemplatePickerModal'
import { TEMPLATES } from './templateRegistry'
import { getGoogleAccessToken } from '../../lib/googleAuth'
import { uploadDocxToDrive } from '../../lib/uploadToDrive'
import type { Profile } from '../../data/profileData'
import type { TemplateId } from './templateRegistry'

export type GoogleDocStatus = 'idle' | 'signing-in' | 'uploading' | 'error'

interface ResumeDownloadButtonProps {
  profile: Profile
  variant: 'pill' | 'menu-item'
  onClose?: () => void
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function ResumeDownloadButton({ profile, variant, onClose }: ResumeDownloadButtonProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<TemplateId>('classic')
  const [googleDocStatus, setGoogleDocStatus] = useState<GoogleDocStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const pdfFileName = `${slugify(profile.name)}-resume.pdf`

  function openModal() {
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    onClose?.()
  }

  async function handleDownloadPdf() {
    const template = TEMPLATES.find(t => t.id === selectedId)!
    const blob = await pdf(<template.component profile={profile} />).toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = pdfFileName
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    closeModal()
  }

  async function handleDownloadWord() {
    const template = TEMPLATES.find(t => t.id === selectedId)!
    const blob = await template.generateDocx(profile)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slugify(profile.name)}-resume.docx`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    closeModal()
  }

  async function handleGoogleDoc() {
    try {
      setGoogleDocStatus('signing-in')
      const token = await getGoogleAccessToken()
      setGoogleDocStatus('uploading')
      const template = TEMPLATES.find(t => t.id === selectedId)!
      const blob = await template.generateDocx(profile)
      const docUrl = await uploadDocxToDrive(blob, `${profile.name} — Resume`, token)
      setGoogleDocStatus('idle')
      closeModal()
      window.open(docUrl, '_blank', 'noopener')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
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

  const triggerClass = variant === 'pill'
    ? 'hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 border border-gray-400 text-li-text-secondary text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors'
    : 'flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full text-left'

  return (
    <>
      <button
        data-testid={variant === 'pill' ? 'download-cv-trigger' : 'download-cv-menu-item'}
        onClick={openModal}
        className={triggerClass}
      >
        {variant === 'pill' ? (
          <>
            Download CV
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
              <path d="M5 7L0.5 2.5h9L5 7z"/>
            </svg>
          </>
        ) : 'Download CV'}
      </button>

      {modalOpen && (
        <TemplatePickerModal
          profile={profile}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDownloadPdf={() => { void handleDownloadPdf() }}
          onDownloadWord={() => { void handleDownloadWord() }}
          onGoogleDoc={() => { void handleGoogleDoc() }}
          onClose={closeModal}
          googleDocStatus={googleDocStatus}
          errorMsg={errorMsg}
        />
      )}
    </>
  )
}
