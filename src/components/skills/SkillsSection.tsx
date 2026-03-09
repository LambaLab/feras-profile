// src/components/skills/SkillsSection.tsx
import { useState } from 'react'
import type { Skill } from '../../data/profileData'
import { SectionWrapper } from '../shared/SectionWrapper'
import { PinnedSkills } from './PinnedSkills'
import { SkillPill } from './SkillPill'

interface SkillsSectionProps {
  skills: Skill
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const allSkillCount =
    skills.pinned.length +
    skills.hard.length +
    skills.industry.length +
    skills.soft.length +
    skills.emerging.length

  const categories = [
    { label: 'Hard Skills', items: skills.hard },
    { label: 'Industry', items: skills.industry },
    { label: 'Soft Skills', items: skills.soft },
    { label: 'Emerging', items: skills.emerging },
  ]

  return (
    <SectionWrapper title="Skills" id="skills">
      <PinnedSkills skills={skills.pinned} />

      {expanded && (
        <div className="px-4 pb-2">
          {categories.map(({ label, items }) => (
            <div key={label} className="mt-4">
              <p className="text-xs font-semibold text-li-text-tertiary uppercase tracking-wide mb-2">
                {label}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map(skill => (
                  <SkillPill key={skill} name={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="px-4 pb-3 mt-1">
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-sm font-semibold text-li-text-secondary hover:text-li-text flex items-center gap-1"
        >
          {expanded ? 'Show less' : `Show all ${allSkillCount} skills`}
        </button>
      </div>
    </SectionWrapper>
  )
}
