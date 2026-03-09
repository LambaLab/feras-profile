// src/components/skills/SkillPill.tsx
interface SkillPillProps {
  name: string
  pinned?: boolean
}

export function SkillPill({ name, pinned = false }: SkillPillProps) {
  return (
    <span
      className={[
        'inline-block px-3 py-1 rounded-full text-sm border transition-colors',
        pinned
          ? 'border-li-blue text-li-blue bg-li-blue-light font-semibold'
          : 'border-li-border text-li-text-secondary bg-white hover:bg-gray-50',
      ].join(' ')}
    >
      {name}
    </span>
  )
}
