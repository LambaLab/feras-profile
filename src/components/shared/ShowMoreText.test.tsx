// src/components/shared/ShowMoreText.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ShowMoreText } from './ShowMoreText'

describe('ShowMoreText', () => {
  const longText = 'a'.repeat(300)

  it('renders the text', () => {
    render(<ShowMoreText text="Short text" />)
    expect(screen.getByText('Short text')).toBeInTheDocument()
  })

  it('shows "…see more" button for long text', () => {
    render(<ShowMoreText text={longText} />)
    expect(screen.getByText('…see more')).toBeInTheDocument()
  })

  it('toggles to "see less" when expanded', () => {
    render(<ShowMoreText text={longText} />)
    fireEvent.click(screen.getByText('…see more'))
    expect(screen.getByText('see less')).toBeInTheDocument()
  })

  it('does not show "…see more" for short text', () => {
    render(<ShowMoreText text="Short" />)
    expect(screen.queryByText('…see more')).toBeNull()
  })

  it('collapses back when clicking "see less"', () => {
    render(<ShowMoreText text={longText} />)
    fireEvent.click(screen.getByText('…see more'))
    fireEvent.click(screen.getByText('see less'))
    expect(screen.getByText('…see more')).toBeInTheDocument()
  })
})
