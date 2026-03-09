interface SectionNavProps {
  sections: string[]
  activeSection: string
}

export function SectionNav({ sections, activeSection }: SectionNavProps) {
  return (
    <nav className="bg-white shadow-li-card sticky top-0 z-10" aria-label="Profile sections">
      <div className="max-w-3xl mx-auto">
        <div className="flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {sections.map(section => {
            const isActive = activeSection === section
            return (
              <a
                key={section}
                href={`#${section.toLowerCase()}`}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'flex-shrink-0 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-li-blue text-li-text'
                    : 'border-transparent text-li-text-secondary hover:text-li-text hover:border-li-border',
                ].join(' ')}
              >
                {section}
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
