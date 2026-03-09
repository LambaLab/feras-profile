// src/components/experience/ExperienceCard.tsx
import type { Experience } from '../../data/profileData'
import { CompanyLogo } from '../shared/CompanyLogo'
import { ShowMoreText } from '../shared/ShowMoreText'
import { RoleBadge } from './RoleBadge'

interface ExperienceCardProps {
  experience: Experience
}

export function ExperienceCard({ experience: exp }: ExperienceCardProps) {
  const dateRange = exp.location
    ? `${exp.startDate} – ${exp.endDate} · ${exp.location}`
    : `${exp.startDate} – ${exp.endDate}`

  return (
    <div className="flex gap-3 px-4 py-4 border-b border-li-border last:border-0">
      <CompanyLogo domain={exp.domain} name={exp.company} size={40} className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2">
          <h3 className="text-sm font-semibold text-li-text leading-tight flex-1 min-w-0">
            {exp.title}
          </h3>
          <RoleBadge type={exp.type} />
        </div>
        <p className="text-sm text-li-text-secondary mt-0.5">{exp.company}</p>
        <p className="text-xs text-li-text-tertiary mt-0.5">{dateRange}</p>
        {exp.description && (
          <div className="mt-2">
            <ShowMoreText text={exp.description} threshold={250} />
          </div>
        )}
      </div>
    </div>
  )
}
