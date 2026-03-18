// src/components/resume/ResumeDownloadButton.tsx
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ResumePDF } from './ResumePDF'
import type { Profile } from '../../data/profileData'

interface ResumeDownloadButtonProps {
  profile: Profile
  /** 'pill' = LinkedIn-style pill button (desktop), 'menu-item' = plain text link (dropdown) */
  variant: 'pill' | 'menu-item'
  onClick?: () => void
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function ResumeDownloadButton({ profile, variant, onClick }: ResumeDownloadButtonProps) {
  const fileName = `${slugify(profile.name)}-resume.pdf`

  return (
    <PDFDownloadLink
      document={<ResumePDF profile={profile} />}
      fileName={fileName}
      onClick={onClick}
    >
      {({ loading }) =>
        variant === 'pill' ? (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 border border-gray-400 text-li-text-secondary text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors cursor-pointer">
            {loading ? 'Building…' : 'Download CV'}
          </span>
        ) : (
          <span className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full cursor-pointer">
            {loading ? 'Building…' : 'Download CV'}
          </span>
        )
      }
    </PDFDownloadLink>
  )
}
