// src/components/skills/PinnedSkills.tsx
import { SkillPill } from './SkillPill'

interface PinnedSkillsProps {
  skills: string[]
}

export function PinnedSkills({ skills }: PinnedSkillsProps) {
  return (
    <div className="px-4 pt-3 pb-2">
      <div className="flex flex-col gap-3">
        {skills.map((skill, idx) => (
          <div key={skill} className="flex items-center gap-3">
            <span className="text-li-text-tertiary text-sm w-4 flex-shrink-0">{idx + 1}</span>
            <SkillPill name={skill} pinned />
          </div>
        ))}
      </div>
    </div>
  )
}
