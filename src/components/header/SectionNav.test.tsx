import { render, screen } from '@testing-library/react'
import { SectionNav } from './SectionNav'

const sections = ['About', 'Experience', 'Skills', 'Education', 'Activity']

describe('SectionNav', () => {
  it('renders all section links', () => {
    render(<SectionNav sections={sections} activeSection="About" />)
    sections.forEach(s => {
      expect(screen.getByText(s)).toBeInTheDocument()
    })
  })

  it('marks the active section', () => {
    render(<SectionNav sections={sections} activeSection="Experience" />)
    const active = screen.getByText('Experience').closest('a')
    expect(active).toHaveAttribute('aria-current', 'true')
  })

  it('non-active sections do not have aria-current', () => {
    render(<SectionNav sections={sections} activeSection="About" />)
    const inactive = screen.getByText('Experience').closest('a')
    expect(inactive).not.toHaveAttribute('aria-current')
  })

  it('links have correct href anchors', () => {
    render(<SectionNav sections={sections} activeSection="About" />)
    const aboutLink = screen.getByText('About').closest('a')
    expect(aboutLink).toHaveAttribute('href', '#about')
  })
})
