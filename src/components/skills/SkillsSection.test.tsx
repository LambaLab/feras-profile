// src/components/skills/SkillsSection.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { SkillsSection } from './SkillsSection'
import { profile } from '../../data/profileData'

describe('SkillsSection', () => {
  it('renders "Skills" heading', () => {
    render(<SkillsSection skills={profile.skills} />)
    expect(screen.getByText('Skills')).toBeInTheDocument()
  })

  it('shows the 3 pinned skills by default', () => {
    render(<SkillsSection skills={profile.skills} />)
    expect(screen.getByText('Revenue Architecture')).toBeInTheDocument()
    expect(screen.getByText('Go-to-Market Strategy')).toBeInTheDocument()
    expect(screen.getByText('Artificial Intelligence')).toBeInTheDocument()
  })

  it('shows "Show all X skills" button when collapsed', () => {
    render(<SkillsSection skills={profile.skills} />)
    expect(screen.getByText(/Show all .* skills/)).toBeInTheDocument()
  })

  it('expands to show all skills on click', () => {
    render(<SkillsSection skills={profile.skills} />)
    fireEvent.click(screen.getByText(/Show all .* skills/))
    expect(screen.getByText('SaaS')).toBeInTheDocument()
    expect(screen.getByText('AI SDR')).toBeInTheDocument()
  })

  it('collapses back when clicking Show less', () => {
    render(<SkillsSection skills={profile.skills} />)
    fireEvent.click(screen.getByText(/Show all .* skills/))
    fireEvent.click(screen.getByText('Show less'))
    expect(screen.queryByText('SaaS')).toBeNull()
  })

  it('has section id="skills"', () => {
    const { container } = render(<SkillsSection skills={profile.skills} />)
    expect(container.querySelector('#skills')).toBeInTheDocument()
  })
})
