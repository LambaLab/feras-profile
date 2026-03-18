// src/components/resume/TemplatePickerModal.tsx
import { useEffect, useMemo, useRef, useState } from 'react'
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

const A4_W = 793
const A4_H = 1122
const THUMB_H = 200
const THUMB_SCALE = THUMB_H / A4_H

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
  const [previewId, setPreviewId] = useState<TemplateId | null>(null)
  const [mobileStep, setMobileStep] = useState<1 | 2>(1)

  // ── FIX: memoize document instances so BlobProvider never sees a changed
  // `document` prop (which would reset it to loading=true → black thumbnail)
  const docElements = useMemo(
    () =>
      Object.fromEntries(
        TEMPLATES.map(t => [t.id, <t.component profile={profile} />])
      ) as Record<string, React.ReactElement>,
    [profile]
  )

  // Blob URL cache — keyed by template id, revoked on modal unmount
  const blobUrlMap = useRef<Record<string, string>>({})
  useEffect(() => {
    const map = blobUrlMap.current
    return () => { Object.values(map).forEach(url => URL.revokeObjectURL(url)) }
  }, [])

  function getBlobUrl(id: string, blob: Blob): string {
    if (!blobUrlMap.current[id]) {
      blobUrlMap.current[id] = URL.createObjectURL(blob)
    }
    return blobUrlMap.current[id]
  }

  // Escape: close preview first, then modal
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (previewId) { setPreviewId(null); return }
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose, previewId])

  // Responsive preview dimensions — recalculated each time preview opens
  const previewDims = useMemo(() => {
    if (typeof window === 'undefined') return { w: 540, scale: 0.681, h: 764 }
    const vw = window.innerWidth
    const isMobile = vw < 640
    // Modal: min(95vw, 880px); body padding p-3 mobile / p-4 desktop
    const modalW = Math.min(vw * 0.95, 880)
    const bodyPad = isMobile ? 24 : 32
    const w = Math.floor(modalW - bodyPad)
    const scale = w / A4_W
    return { w, scale, h: Math.round(A4_H * scale) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewId])

  const selectedName = TEMPLATES.find(t => t.id === selectedId)?.name ?? ''
  const previewTemplate = previewId ? TEMPLATES.find(t => t.id === previewId) : null

  const downloadButtons = (
    <>
      <button
        onClick={onDownloadPdf}
        className="flex-1 inline-flex justify-center items-center px-4 py-2.5 bg-li-blue text-white text-sm font-semibold rounded-full hover:bg-li-blue-dark transition-colors"
      >
        Download PDF
      </button>
      <button
        onClick={onDownloadWord}
        className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors"
      >
        Download Word
      </button>
      <button
        onClick={onGoogleDoc}
        disabled={googleDocStatus !== 'idle'}
        className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        {googleDocLabel(googleDocStatus, errorMsg)}
      </button>
    </>
  )

  return (
    <>
      {/* ── Main picker modal ── */}
      <div
        data-testid="modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            {mobileStep === 2 && (
              <button
                onClick={() => setMobileStep(1)}
                className="sm:hidden text-gray-500 hover:text-gray-800 text-sm font-medium flex items-center gap-1 shrink-0"
                aria-label="Back to templates"
              >
                ← Back
              </button>
            )}
            <h2 className="flex-1 text-lg font-semibold text-gray-900">
              {mobileStep === 2
                ? <><span className="sm:hidden">Download — {selectedName}</span><span className="hidden sm:inline">Choose a template</span></>
                : 'Choose a template'
              }
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none shrink-0"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          {/* Template grid — hidden on mobile step 2 */}
          <div className={`grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4 ${mobileStep === 2 ? 'hidden sm:grid' : ''}`}>
            {TEMPLATES.map(template => (
              <div key={template.id} className="flex flex-col gap-1">
                {/* Card button — clicking selects this template */}
                <button
                  data-testid={`template-card-${template.id}`}
                  onClick={() => onSelect(template.id as TemplateId)}
                  className={`rounded-lg border-2 overflow-hidden text-left transition-all ${
                    selectedId === template.id
                      ? 'border-li-blue shadow-md'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {/* PDF thumbnail — centered in card */}
                  <div className="relative w-full bg-gray-50 overflow-hidden" style={{ height: THUMB_H }}>
                    <BlobProvider document={docElements[template.id]}>
                      {({ blob, loading }) => {
                        if (loading || !blob) {
                          return (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-6 border-2 border-gray-300 border-t-li-blue rounded-full animate-spin" />
                            </div>
                          )
                        }
                        const url = getBlobUrl(template.id, blob)
                        return (
                          <iframe
                            src={url}
                            title={template.name}
                            className="absolute border-0 pointer-events-none"
                            style={{
                              width: `${A4_W}px`,
                              height: `${A4_H}px`,
                              transformOrigin: 'top center',
                              transform: `scale(${THUMB_SCALE})`,
                              left: `calc(50% - ${A4_W / 2}px)`,
                              top: 0,
                            }}
                          />
                        )
                      }}
                    </BlobProvider>
                  </div>

                  {/* Template name bar */}
                  <div className={`px-3 py-2 text-sm font-medium ${
                    selectedId === template.id
                      ? 'text-li-blue bg-li-blue-light'
                      : 'text-gray-700'
                  }`}>
                    {template.name}
                  </div>
                </button>

                {/* Preview button — explicit, below card, not hover-triggered */}
                <button
                  data-testid={`preview-btn-${template.id}`}
                  onClick={() => setPreviewId(template.id as TemplateId)}
                  className="text-xs text-gray-400 hover:text-li-blue transition-colors text-center py-0.5 leading-none"
                >
                  Preview ↗
                </button>
              </div>
            ))}
          </div>

          {/* Mobile step 1 — Continue button */}
          <div className={`sm:hidden ${mobileStep === 2 ? 'hidden' : ''}`}>
            <button
              onClick={() => setMobileStep(2)}
              className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-li-blue text-white text-sm font-semibold rounded-full hover:bg-li-blue-dark transition-colors"
            >
              Continue with {selectedName} →
            </button>
          </div>

          {/* Download buttons — hidden on mobile step 1, always visible on desktop */}
          <div className={`flex flex-col sm:flex-row gap-2 sm:pt-4 sm:border-t sm:border-gray-100 ${
            mobileStep === 1 ? 'hidden sm:flex' : ''
          }`}>
            {downloadButtons}
          </div>
        </div>
      </div>

      {/* ── Preview lightbox — stacked above the picker ── */}
      {previewTemplate && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/80 p-2 sm:p-4"
          style={{ zIndex: 60 }}
          onClick={() => setPreviewId(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden w-full"
            style={{ maxWidth: 880, maxHeight: '92vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Preview header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <span className="font-semibold text-gray-900">{previewTemplate.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelect(previewTemplate.id as TemplateId)
                    setPreviewId(null)
                  }}
                  className="inline-flex items-center px-3 py-1.5 bg-li-blue text-white text-xs font-semibold rounded-full hover:bg-li-blue-dark transition-colors"
                >
                  Use this template
                </button>
                <button
                  onClick={() => setPreviewId(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                  aria-label="Close preview"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Preview body — scrollable, Google-Doc-style gray background */}
            <div className="overflow-y-auto bg-gray-200 p-3 sm:p-4">
              {(() => {
                // Use the already-cached blob URL if available (avoids second BlobProvider
                // and prevents the "black after close" race condition)
                const cachedUrl = blobUrlMap.current[previewTemplate.id]

                const frame = (url: string) => (
                  <div
                    className="relative mx-auto bg-white shadow-md"
                    style={{ width: previewDims.w, height: previewDims.h }}
                  >
                    <iframe
                      src={url}
                      title={`Preview ${previewTemplate.name}`}
                      className="absolute border-0 pointer-events-none"
                      style={{
                        width: `${A4_W}px`,
                        height: `${A4_H}px`,
                        transformOrigin: 'top left',
                        transform: `scale(${previewDims.scale})`,
                        top: 0,
                        left: 0,
                      }}
                    />
                  </div>
                )

                if (cachedUrl) return frame(cachedUrl)

                // Fallback: blob not yet ready (user opened preview very quickly)
                return (
                  <BlobProvider document={docElements[previewTemplate.id]}>
                    {({ blob, loading }) => {
                      if (loading || !blob) {
                        return (
                          <div
                            className="flex items-center justify-center"
                            style={{ width: previewDims.w, height: Math.min(previewDims.h, 400) }}
                          >
                            <div className="w-8 h-8 border-2 border-gray-300 border-t-li-blue rounded-full animate-spin" />
                          </div>
                        )
                      }
                      return frame(getBlobUrl(previewTemplate.id, blob))
                    }}
                  </BlobProvider>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
