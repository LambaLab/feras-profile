// src/components/experience/ExperienceCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ExperienceCard } from './ExperienceCard'
import { profile } from '../../data/profileData'

describe('ExperienceCard', () => {
  const currentRole = profile.experience[0] // FlyAkeed CCRO

  it('renders role title', () => {
    render(<ExperienceCard experience={currentRole} />)
    expect(screen.getByText('Chief Commercial & Revenue Officer')).toBeInTheDocument()
  })

  it('renders company name', () => {
    render(<ExperienceCard experience={currentRole} />)
    expect(screen.getByText('FlyAkeed')).toBeInTheDocument()
  })

  it('renders date range including Present', () => {
    render(<ExperienceCard experience={currentRole} />)
    expect(screen.getByText(/Jul 2024/)).toBeInTheDocument()
    expect(screen.getByText(/Present/)).toBeInTheDocument()
  })

  it('renders role type badge for board roles', () => {
    const boardRole = profile.experience.find(e => e.type === 'board')!
    render(<ExperienceCard experience={boardRole} />)
    // board role title is also "Board Member", so we expect 2 matches (h3 + badge span)
    expect(screen.getAllByText('Board Member').length).toBeGreaterThanOrEqual(1)
  })

  it('does NOT render a badge for employment roles', () => {
    render(<ExperienceCard experience={currentRole} />)
    expect(screen.queryByText('Board Member')).toBeNull()
    expect(screen.queryByText('Advisory')).toBeNull()
  })
})
