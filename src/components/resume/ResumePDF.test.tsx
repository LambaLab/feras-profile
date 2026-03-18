// src/components/resume/ResumePDF.test.tsx
import { vi } from 'vitest'
vi.mock('@react-pdf/renderer')

import { render, screen } from '@testing-library/react'
import { ResumePDF } from './ResumePDF'
import { profile } from '../../data/profileData'

describe('ResumePDF', () => {
  it('renders without crashing', () => {
    render(<ResumePDF profile={profile} />)
    expect(screen.getByTestId('pdf-page')).toBeInTheDocument()
  })

  it('includes the profile name', () => {
    render(<ResumePDF profile={profile} />)
    expect(screen.getByText(profile.name)).toBeInTheDocument()
  })

  it('renders all experience company names', () => {
    render(<ResumePDF profile={profile} />)
    for (const exp of profile.experience) {
      expect(screen.getAllByText(exp.company).length).toBeGreaterThan(0)
    }
  })
})
