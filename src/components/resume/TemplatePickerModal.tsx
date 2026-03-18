// src/components/resume/TemplatePickerModal.tsx
import { useEffect, useRef } from 'react'
import { BlobProvider } from '@react-pdf/renderer'
import { TEMPLATES } from './templateRegistry'
import type { TemplateId } from './templateRegistry'
import type { Profile } from '../../data/profileData'
import type { GoogleDocStatus } from './ResumeDownloadButton'

interface TemplatePickerModalProps {
  profile: Profile
  selectedId: TemplateId
  onSelect: (id: TemplateId) => void
  onDownloadPdf: () => void
  onDownloadWord: () => void
  onGoogleDoc: () => void
  onClose: () => void
  googleDocStatus: GoogleDocStatus
  errorMsg: string
}

function googleDocLabel(status: GoogleDocStatus, errorMsg: string): string {
  if (status === 'signing-in') return 'Signing in…'
  if (status === 'uploading') return 'Uploading…'
  if (status === 'error') return errorMsg || 'Upload failed — try again'
  return 'Open as Google Doc'
}

export function TemplatePickerModal({
  profile,
  selectedId,
  onSelect,
  onDownloadPdf,
  onDownloadWord,
  onGoogleDoc,
  onClose,
  googleDocStatus,
  errorMsg,
}: TemplatePickerModalProps) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Track blob URLs to revoke on unmount
  const blobUrls = useRef<string[]>([])
  useEffect(() => {
    const urls = blobUrls.current
    return () => { urls.forEach(url => URL.revokeObjectURL(url)) }
  }, [])

  return (
    <div
      data-testid="modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Choose a template</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {TEMPLATES.map(template => (
            <button
              key={template.id}
              data-testid={`template-card-${template.id}`}
              onClick={() => onSelect(template.id as TemplateId)}
              className={`rounded-lg border-2 overflow-hidden text-left transition-all ${
                selectedId === template.id
                  ? 'border-li-blue shadow-md'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              {/* PDF Thumbnail */}
              <div className="relative w-full bg-gray-50 overflow-hidden" style={{ height: 200 }}>
                <BlobProvider document={<template.component profile={profile} />}>
                  {({ blob, loading }) => {
                    if (loading || !blob) {
                      return (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-gray-300 border-t-li-blue rounded-full animate-spin" />
                        </div>
                      )
                    }
                    const url = URL.createObjectURL(blob)
                    if (!blobUrls.current.includes(url)) blobUrls.current.push(url)
                    return (
                      <iframe
                        src={url}
                        title={template.name}
                        className="absolute border-0 pointer-events-none"
                        style={{
                          width: '793px',
                          height: '1122px',
                          transformOrigin: 'top left',
                          transform: `scale(${200 / 1122})`,
                        }}
                      />
                    )
                  }}
                </BlobProvider>
              </div>
              {/* Template name */}
              <div className={`px-3 py-2 text-sm font-medium ${
                selectedId === template.id
                  ? 'text-li-blue bg-li-blue-light'
                  : 'text-gray-700'
              }`}>
                {template.name}
              </div>
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={onDownloadPdf}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-li-blue text-white text-sm font-semibold rounded-full hover:bg-li-blue-dark transition-colors"
          >
            Download PDF
          </button>
          <button
            onClick={onDownloadWord}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors"
          >
            Download Word
          </button>
          <button
            onClick={onGoogleDoc}
            disabled={googleDocStatus !== 'idle'}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            {googleDocLabel(googleDocStatus, errorMsg)}
          </button>
        </div>
      </div>
    </div>
  )
}
