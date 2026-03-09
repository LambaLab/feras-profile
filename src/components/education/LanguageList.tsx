// src/components/education/LanguageList.tsx
import type { Language } from '../../data/profileData'

interface LanguageListProps {
  languages: Language[]
}

export function LanguageList({ languages }: LanguageListProps) {
  return (
    <div>
      <div className="px-4 pt-4 pb-0">
        <h2 className="text-xl font-semibold text-li-text">Languages</h2>
      </div>
      {languages.map(lang => (
        <div key={lang.name} className="px-4 py-4 border-b border-li-border last:border-0">
          <p className="text-sm font-semibold text-li-text">{lang.name}</p>
          <p className="text-sm text-li-text-secondary">{lang.proficiency}</p>
        </div>
      ))}
    </div>
  )
}
