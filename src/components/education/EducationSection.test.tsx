// src/components/education/EducationSection.test.tsx
import { render, screen } from '@testing-library/react'
import { EducationSection } from './EducationSection'
import { profile } from '../../data/profileData'

describe('EducationSection', () => {
  it('renders "Education" heading', () => {
    render(<EducationSection education={profile.education} certifications={profile.certifications} languages={profile.languages} />)
    expect(screen.getByText('Education')).toBeInTheDocument()
  })

  it('renders MSc in Artificial Intelligence', () => {
    render(<EducationSection education={profile.education} certifications={profile.certifications} languages={profile.languages} />)
    expect(screen.getAllByText(/Artificial Intelligence/)[0]).toBeInTheDocument()
  })

  it('renders BSc in Management Information Systems', () => {
    render(<EducationSection education={profile.education} certifications={profile.certifications} languages={profile.languages} />)
    expect(screen.getAllByText(/Management Information Systems/)[0]).toBeInTheDocument()
  })

  it('renders 3 certifications', () => {
    render(<EducationSection education={profile.education} certifications={profile.certifications} languages={profile.languages} />)
    expect(screen.getByText(/Strategic Selling/)).toBeInTheDocument()
    expect(screen.getByText(/Conceptual Selling/)).toBeInTheDocument()
    expect(screen.getByText(/LAMP/)).toBeInTheDocument()
  })

  it('renders both languages', () => {
    render(<EducationSection education={profile.education} certifications={profile.certifications} languages={profile.languages} />)
    expect(screen.getByText('Arabic')).toBeInTheDocument()
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('has section id="education"', () => {
    const { container } = render(<EducationSection education={profile.education} certifications={profile.certifications} languages={profile.languages} />)
    expect(container.querySelector('#education')).toBeInTheDocument()
  })
})
