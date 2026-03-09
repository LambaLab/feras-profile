// src/components/shared/SectionWrapper.tsx
import type { ReactNode } from 'react'

interface SectionWrapperProps {
  children: ReactNode
  title?: string
  id?: string
  className?: string
}

export function SectionWrapper({ children, title, id, className = '' }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`bg-white rounded-lg shadow-li-card overflow-hidden ${className}`}
    >
      {title && (
        <div className="px-4 pt-4 pb-0">
          <h2 className="text-xl font-semibold text-li-text">{title}</h2>
        </div>
      )}
      {children}
    </section>
  )
}
