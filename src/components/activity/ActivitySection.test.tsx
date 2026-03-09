// src/components/activity/ActivitySection.test.tsx
import { render, screen } from '@testing-library/react'
import { ActivitySection } from './ActivitySection'
import { profile } from '../../data/profileData'

describe('ActivitySection', () => {
  it('renders "Activity" heading', () => {
    render(<ActivitySection posts={profile.posts} featuredArticle={profile.featuredArticle} profile={profile} />)
    expect(screen.getByText('Activity')).toBeInTheDocument()
  })

  it('renders the featured article title', () => {
    render(<ActivitySection posts={profile.posts} featuredArticle={profile.featuredArticle} profile={profile} />)
    expect(screen.getByText(/Revenue Architecture: How I Built/)).toBeInTheDocument()
  })

  it('renders all 3 posts', () => {
    render(<ActivitySection posts={profile.posts} featuredArticle={profile.featuredArticle} profile={profile} />)
    // Each post's first line appears in the DOM
    expect(screen.getAllByText(/Most commercial problems are architecture problems/)[0]).toBeInTheDocument()
    expect(screen.getByText(/I deployed an AI SDR/)).toBeInTheDocument()
    expect(screen.getByText(/I once had to build a 100-person/)).toBeInTheDocument()
  })

  it('renders engagement counts for posts', () => {
    render(<ActivitySection posts={profile.posts} featuredArticle={profile.featuredArticle} profile={profile} />)
    expect(screen.getByText(/847/)).toBeInTheDocument()
  })

  it('has section id="activity"', () => {
    const { container } = render(<ActivitySection posts={profile.posts} featuredArticle={profile.featuredArticle} profile={profile} />)
    expect(container.querySelector('#activity')).toBeInTheDocument()
  })
})
