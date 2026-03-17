// src/components/experience/ExperienceSection.test.tsx
import { render, screen } from '@testing-library/react'
import { ExperienceSection } from './ExperienceSection'
import { profile } from '../../data/profileData'

describe('ExperienceSection', () => {
  it('renders "Experience" heading', () => {
    render(<ExperienceSection experience={profile.experience} />)
    expect(screen.getByText('Experience')).toBeInTheDocument()
  })

  it('renders the most recent role', () => {
    render(<ExperienceSection experience={profile.experience} />)
    expect(screen.getByText('Chief Commercial & Revenue Officer')).toBeInTheDocument()
  })

  it('renders the oldest role (EY)', () => {
    render(<ExperienceSection experience={profile.experience} />)
    expect(screen.getByText(/Consultant, Business Management Advisory Services/)).toBeInTheDocument()
  })

  it('has section id="experience"', () => {
    const { container } = render(<ExperienceSection experience={profile.experience} />)
    expect(container.querySelector('#experience')).toBeInTheDocument()
  })
})
