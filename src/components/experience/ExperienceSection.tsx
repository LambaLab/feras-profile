// src/components/experience/ExperienceSection.tsx
import type { Experience } from '../../data/profileData'
import { SectionWrapper } from '../shared/SectionWrapper'
import { ExperienceCard } from './ExperienceCard'

interface ExperienceSectionProps {
  experience: Experience[]
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <SectionWrapper title="Experience" id="experience">
      <div className="mt-2">
        {experience.map(exp => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </SectionWrapper>
  )
}
