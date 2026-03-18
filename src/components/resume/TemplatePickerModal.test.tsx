import { describe, it, expect, vi } from 'vitest'
vi.mock('@react-pdf/renderer')
import { render, screen, fireEvent } from '@testing-library/react'
import { TemplatePickerModal } from './TemplatePickerModal'
import { profile } from '../../data/profileData'

describe('TemplatePickerModal', () => {
  const defaultProps = {
    profile,
    selectedId: 'classic' as const,
    onSelect: vi.fn(),
    onDownloadPdf: vi.fn(),
    onDownloadWord: vi.fn(),
    onGoogleDoc: vi.fn(),
    onClose: vi.fn(),
    googleDocStatus: 'idle' as const,
    errorMsg: '',
  }

  it('renders all 5 template names', () => {
    render(<TemplatePickerModal {...defaultProps} />)
    expect(screen.getByText('Classic')).toBeInTheDocument()
    expect(screen.getByText('Executive')).toBeInTheDocument()
    expect(screen.getByText('Modern')).toBeInTheDocument()
    expect(screen.getByText('Compact')).toBeInTheDocument()
    expect(screen.getByText('Minimal')).toBeInTheDocument()
  })

  it('calls onSelect when a template card is clicked', () => {
    const onSelect = vi.fn()
    render(<TemplatePickerModal {...defaultProps} onSelect={onSelect} />)
    fireEvent.click(screen.getByTestId('template-card-executive'))
    expect(onSelect).toHaveBeenCalledWith('executive')
  })

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn()
    render(<TemplatePickerModal {...defaultProps} onClose={onClose} />)
    fireEvent.click(screen.getByTestId('modal-overlay'))
    expect(onClose).toHaveBeenCalled()
  })

  it('shows Download PDF button', () => {
    render(<TemplatePickerModal {...defaultProps} />)
    expect(screen.getByText('Download PDF')).toBeInTheDocument()
  })

  it('shows Download Word button', () => {
    render(<TemplatePickerModal {...defaultProps} />)
    expect(screen.getByText('Download Word')).toBeInTheDocument()
  })

  it('shows Google Doc button label based on status', () => {
    render(<TemplatePickerModal {...defaultProps} googleDocStatus="uploading" />)
    expect(screen.getByText('Uploading…')).toBeInTheDocument()
  })

  it('disables Google Doc button when not idle', () => {
    render(<TemplatePickerModal {...defaultProps} googleDocStatus="signing-in" />)
    const btn = screen.getByRole('button', { name: 'Signing in…' })
    expect(btn).toBeDisabled()
  })
})
