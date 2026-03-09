// src/components/about/AboutSection.test.tsx
import { render, screen } from '@testing-library/react'
import { AboutSection } from './AboutSection'

describe('AboutSection', () => {
  it('renders "About" heading', () => {
    render(<AboutSection text="I build revenue engines. This is more than two hundred characters long to trigger the show more button because we need it to be quite long indeed and we keep going here to reach threshold." />)
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('renders the about text', () => {
    render(<AboutSection text="I build revenue engines." />)
    expect(screen.getByText(/I build revenue engines/)).toBeInTheDocument()
  })

  it('has section id="about"', () => {
    const { container } = render(<AboutSection text="text" />)
    expect(container.querySelector('#about')).toBeInTheDocument()
  })
})
