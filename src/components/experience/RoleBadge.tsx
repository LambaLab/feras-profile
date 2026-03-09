// src/components/experience/RoleBadge.tsx
import type { RoleType } from '../../data/profileData'

interface RoleBadgeProps {
  type: RoleType
}

const BADGE_LABELS: Record<RoleType, string | null> = {
  employment: null,
  board: 'Board Member',
  advisory: 'Advisory',
  committee: 'Committee',
}

export function RoleBadge({ type }: RoleBadgeProps) {
  const label = BADGE_LABELS[type]
  if (!label) return null
  return (
    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0">
      {label}
    </span>
  )
}
