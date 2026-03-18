// src/components/header/ActionButtons.tsx
import { useState, useRef, useEffect } from 'react'
import type { Profile } from '../../data/profileData'
import { ResumeDownloadButton } from '../resume/ResumeDownloadButton'

interface ActionButtonsProps {
  linkedinUrl: string
  email: string
  profile: Profile
}

export function ActionButtons({ linkedinUrl, email, profile }: ActionButtonsProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center gap-2">
        {/* Primary — Connect */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-4 py-1.5 bg-li-blue text-white text-sm font-semibold rounded-full hover:bg-li-blue-dark transition-colors"
        >
          Connect
        </a>

        {/* Secondary — Message (desktop only) */}
        {email && (
          <a
            href={`mailto:${email}`}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 border border-li-blue text-li-blue text-sm font-semibold rounded-full hover:bg-li-blue-light transition-colors"
          >
            Message
          </a>
        )}

        {/* Download CV pill — desktop only */}
        <ResumeDownloadButton profile={profile} variant="pill" />

        {/* More ··· — pill on desktop, circle on mobile */}
        <div className="relative" ref={menuRef}>
          <button
            aria-label="More options"
            onClick={() => setMenuOpen(o => !o)}
            className="inline-flex items-center justify-center gap-1 sm:px-4 sm:py-1.5 w-9 h-9 sm:w-auto sm:h-auto border border-gray-400 text-li-text-secondary text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors"
          >
            <span className="hidden sm:inline">More</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 8a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm4.5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm4.5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"/>
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute left-0 sm:left-auto sm:right-0 top-11 w-52 bg-white rounded-lg shadow-lg border border-li-border z-20 py-1">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Message
                </a>
              )}
              {/* Download CV — mobile (inside dropdown) */}
              <ResumeDownloadButton
                profile={profile}
                variant="menu-item"
                onClick={() => setMenuOpen(false)}
              />
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                View on LinkedIn
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
