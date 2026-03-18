// src/components/header/ActionButtons.test.tsx
import { vi } from 'vitest'
vi.mock('@react-pdf/renderer')
vi.mock('docx')

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ActionButtons } from './ActionButtons'
import { profile } from '../../data/profileData'

describe('ActionButtons', () => {
  const defaultProps = {
    linkedinUrl: profile.linkedinUrl,
    email: profile.email,
    profile,
  }

  it('renders Connect button', () => {
    render(<ActionButtons {...defaultProps} />)
    expect(screen.getByText('Connect')).toBeInTheDocument()
  })

  it('renders Download CV trigger button', () => {
    render(<ActionButtons {...defaultProps} />)
    expect(screen.getByTestId('download-cv-trigger')).toBeInTheDocument()
    expect(screen.getByTestId('download-cv-trigger')).toHaveTextContent('Download CV')
  })

  it('opens template picker modal on trigger click', async () => {
    const user = userEvent.setup()
    render(<ActionButtons {...defaultProps} />)
    const trigger = screen.getByTestId('download-cv-trigger')
    await user.click(trigger)
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument()
    expect(screen.getByText('Download PDF')).toBeInTheDocument()
    expect(screen.getByText('Download Word')).toBeInTheDocument()
  })
})
