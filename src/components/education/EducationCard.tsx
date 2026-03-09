// src/components/education/EducationCard.tsx
import type { Education } from '../../data/profileData'
import { CompanyLogo } from '../shared/CompanyLogo'
import { ShowMoreText } from '../shared/ShowMoreText'

interface EducationCardProps {
  education: Education
}

export function EducationCard({ education: edu }: EducationCardProps) {
  return (
    <div className="flex gap-3 px-4 py-4 border-b border-li-border last:border-0">
      <CompanyLogo domain={edu.domain} name={edu.school} size={40} className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-li-text">{edu.school}</h3>
        <p className="text-sm text-li-text-secondary">
          {edu.degree} · {edu.field}
        </p>
        <p className="text-xs text-li-text-tertiary mt-0.5">
          {edu.startYear} – {edu.endYear}
        </p>
        {edu.description && (
          <div className="mt-2">
            <ShowMoreText text={edu.description} threshold={200} />
          </div>
        )}
      </div>
    </div>
  )
}
