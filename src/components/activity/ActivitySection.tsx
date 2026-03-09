// src/components/activity/ActivitySection.tsx
import type { Post, FeaturedArticle, Profile } from '../../data/profileData'
import { SectionWrapper } from '../shared/SectionWrapper'
import { PostCard } from './PostCard'

interface ActivitySectionProps {
  posts: Post[]
  featuredArticle: FeaturedArticle
  profile: Profile
}

export function ActivitySection({ posts, featuredArticle, profile }: ActivitySectionProps) {
  return (
    <SectionWrapper title="Activity" id="activity">
      {/* Featured Article Card */}
      <div className="mx-4 mt-4 mb-2 p-4 border border-li-border rounded-lg bg-li-bg">
        <p className="text-xs font-semibold text-li-text-tertiary uppercase tracking-wide mb-1">
          Featured Article
        </p>
        <h3 className="text-sm font-semibold text-li-text leading-snug">
          {featuredArticle.title}
        </h3>
        <p className="text-sm text-li-text-secondary mt-1">
          {featuredArticle.description}
        </p>
      </div>

      {/* Posts */}
      <div className="mt-2">
        {posts.map(post => (
          <PostCard key={post.id} post={post} profile={profile} />
        ))}
      </div>
    </SectionWrapper>
  )
}
