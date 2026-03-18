// src/components/header/ActionButtons.test.tsx
import { vi } from 'vitest'
vi.mock('@react-pdf/renderer')

import { render, screen } from '@testing-library/react'
import { ActionButtons } from './ActionButtons'
import { profile } from '../../data/profileData'

describe('ActionButtons', () => {
  const defaultProps = {
    linkedinUrl: profile.linkedinUrl,
    email: profile.email,
    profile,
  }

  it('renders Connect link pointing to LinkedIn URL', () => {
    render(<ActionButtons linkedinUrl="https://www.linkedin.com/in/nasserff/" email="test@example.com" profile={profile} />)
    const link = screen.getByRole('link', { name: /connect/i })
    expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/nasserff/')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders Message link as mailto', () => {
    render(<ActionButtons linkedinUrl="https://www.linkedin.com/in/nasserff/" email="feras@example.com" profile={profile} />)
    const link = screen.getByRole('link', { name: /message/i })
    expect(link).toHaveAttribute('href', 'mailto:feras@example.com')
  })

  it('renders More button', () => {
    render(<ActionButtons linkedinUrl="https://www.linkedin.com/in/nasserff/" email="test@example.com" profile={profile} />)
    expect(screen.getByRole('button', { name: /more/i })).toBeInTheDocument()
  })

  it('renders Connect button', () => {
    render(<ActionButtons {...defaultProps} />)
    expect(screen.getByText('Connect')).toBeInTheDocument()
  })

  it('renders Download CV link', () => {
    render(<ActionButtons {...defaultProps} />)
    expect(screen.getByTestId('pdf-download-link')).toBeInTheDocument()
  })

  it('download link has correct filename', () => {
    render(<ActionButtons {...defaultProps} />)
    const link = screen.getByTestId('pdf-download-link')
    expect(link).toHaveAttribute('download', 'feras-h-al-bader-resume.pdf')
  })
})
