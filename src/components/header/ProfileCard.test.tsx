import { render, screen } from '@testing-library/react'
import { ProfileCard } from './ProfileCard'
import { profile } from '../../data/profileData'

describe('ProfileCard', () => {
  it('renders the profile name', () => {
    render(<ProfileCard profile={profile} />)
    expect(screen.getByText('Feras H. Al-Bader')).toBeInTheDocument()
  })

  it('renders the headline', () => {
    render(<ProfileCard profile={profile} />)
    expect(screen.getByText(/Chief Commercial Officer/)).toBeInTheDocument()
  })

  it('renders the location', () => {
    render(<ProfileCard profile={profile} />)
    expect(screen.getByText(/Riyadh, Saudi Arabia/i)).toBeInTheDocument()
  })

  it('renders connections count with LinkedIn link', () => {
    render(<ProfileCard profile={profile} />)
    const link = screen.getByRole('link', { name: /500\+/i })
    expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/nasserff/')
  })

  it('renders profile photo with correct alt text', () => {
    render(<ProfileCard profile={profile} />)
    expect(screen.getByAltText('Feras H. Al-Bader')).toBeInTheDocument()
  })
})
