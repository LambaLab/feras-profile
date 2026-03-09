// src/components/experience/ExperienceCard.tsx
import { useState } from 'react'
import type { Experience } from '../../data/profileData'
import { CompanyLogo } from '../shared/CompanyLogo'
import { RoleBadge } from './RoleBadge'

interface ExperienceCardProps {
  experience: Experience
}

function ExperienceDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)

  // Split into intro paragraph and individual bullet lines
  const [introPart, ...rest] = text.split('\n\n')
  const intro = introPart?.trim() ?? ''
  const bullets = rest.join('\n').split('\n').map(l => l.trim()).filter(Boolean)
  const hasBullets = bullets.length > 0
  const isLongIntro = !hasBullets && intro.length > 250

  return (
    <div className="text-sm text-li-text leading-relaxed">
      {/* Intro / context paragraph */}
      <p
        style={isLongIntro && !expanded ? {
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        } : undefined}
      >
        {intro}
      </p>

      {/* Bullet achievements — shown when expanded */}
      {hasBullets && expanded && (
        <ul className="mt-2 space-y-1.5 list-disc list-outside ml-4">
          {bullets.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      )}

      {/* Toggle button */}
      {(hasBullets || isLongIntro) && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-li-blue font-semibold hover:underline mt-1 block"
        >
          {expanded ? 'see less' : '…see more'}
        </button>
      )}
    </div>
  )
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
            <ExperienceDescription text={exp.description} />
          </div>
        )}
      </div>
    </div>
  )
}
