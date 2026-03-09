// src/components/about/AboutSection.tsx
import { SectionWrapper } from '../shared/SectionWrapper'
import { ShowMoreText } from '../shared/ShowMoreText'

interface AboutSectionProps {
  text: string
}

export function AboutSection({ text }: AboutSectionProps) {
  return (
    <SectionWrapper title="About" id="about">
      <div className="px-4 py-3">
        <ShowMoreText text={text} threshold={300} />
      </div>
    </SectionWrapper>
  )
}
