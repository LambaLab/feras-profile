// src/components/shared/SectionWrapper.test.tsx
import { render, screen } from '@testing-library/react'
import { SectionWrapper } from './SectionWrapper'

describe('SectionWrapper', () => {
  it('renders children', () => {
    render(<SectionWrapper><p>Hello</p></SectionWrapper>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders a section title when provided', () => {
    render(<SectionWrapper title="Experience"><p>content</p></SectionWrapper>)
    expect(screen.getByText('Experience')).toBeInTheDocument()
  })

  it('renders without title when not provided', () => {
    const { container } = render(<SectionWrapper><p>content</p></SectionWrapper>)
    expect(container.querySelector('h2')).toBeNull()
  })

  it('applies the id prop', () => {
    const { container } = render(<SectionWrapper id="about"><p>content</p></SectionWrapper>)
    expect(container.querySelector('#about')).toBeInTheDocument()
  })
})
