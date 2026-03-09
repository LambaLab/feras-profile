// src/components/shared/CompanyLogo.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { CompanyLogo } from './CompanyLogo'

describe('CompanyLogo', () => {
  it('renders an img with Clearbit URL', () => {
    render(<CompanyLogo domain="flyakeed.com" name="FlyAkeed" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://logo.clearbit.com/flyakeed.com')
    expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('shows initials fallback on image error', () => {
    render(<CompanyLogo domain="flyakeed.com" name="FlyAkeed" />)
    const img = screen.getByRole('img')
    fireEvent.error(img)
    expect(screen.getByText('FL')).toBeInTheDocument()
  })

  it('computes correct initials for single-word name', () => {
    render(<CompanyLogo domain="zid.sa" name="Zid" />)
    const img = screen.getByRole('img')
    fireEvent.error(img)
    expect(screen.getByText('ZI')).toBeInTheDocument()
  })

  it('has correct alt text', () => {
    render(<CompanyLogo domain="ey.com" name="Ernst & Young (EY)" />)
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Ernst & Young (EY)')
  })
})
