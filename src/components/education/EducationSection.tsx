// src/components/education/EducationSection.tsx
import type { Education, Certification, Language } from '../../data/profileData'
import { SectionWrapper } from '../shared/SectionWrapper'
import { EducationCard } from './EducationCard'
import { CertificationList } from './CertificationList'
import { LanguageList } from './LanguageList'

interface EducationSectionProps {
  education: Education[]
  certifications: Certification[]
  languages: Language[]
}

export function EducationSection({ education, certifications, languages }: EducationSectionProps) {
  return (
    <div id="education" className="flex flex-col gap-2">
      <SectionWrapper title="Education">
        <div className="mt-2">
          {education.map(edu => (
            <EducationCard key={edu.id} education={edu} />
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper title="Licenses &amp; Certifications">
        <CertificationList certifications={certifications} />
      </SectionWrapper>

      <SectionWrapper title="Languages">
        <LanguageList languages={languages} />
      </SectionWrapper>
    </div>
  )
}
