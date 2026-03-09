import { render, screen } from '@testing-library/react'
import { ActionButtons } from './ActionButtons'

describe('ActionButtons', () => {
  it('renders Connect link pointing to LinkedIn URL', () => {
    render(<ActionButtons linkedinUrl="https://www.linkedin.com/in/nasserff/" email="test@example.com" />)
    const link = screen.getByRole('link', { name: /connect/i })
    expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/nasserff/')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders Message link as mailto', () => {
    render(<ActionButtons linkedinUrl="https://www.linkedin.com/in/nasserff/" email="feras@example.com" />)
    const link = screen.getByRole('link', { name: /message/i })
    expect(link).toHaveAttribute('href', 'mailto:feras@example.com')
  })

  it('renders More button', () => {
    render(<ActionButtons linkedinUrl="https://www.linkedin.com/in/nasserff/" email="test@example.com" />)
    expect(screen.getByRole('button', { name: /more/i })).toBeInTheDocument()
  })
})
