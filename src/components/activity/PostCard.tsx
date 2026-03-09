// src/components/activity/PostCard.tsx
import type { Post, Profile } from '../../data/profileData'
import { ShowMoreText } from '../shared/ShowMoreText'

interface PostCardProps {
  post: Post
  profile: Profile
}

export function PostCard({ post, profile }: PostCardProps) {
  return (
    <div className="px-4 py-4 border-b border-li-border last:border-0">
      {/* Author row */}
      <div className="flex items-center gap-2 mb-3">
        <img
          src={profile.photo}
          alt={profile.name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover bg-gray-200 flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-li-text leading-tight">{profile.name}</p>
          <p className="text-xs text-li-text-secondary leading-tight truncate">
            {profile.headline.slice(0, 70)}
          </p>
        </div>
      </div>

      {/* Post body */}
      <ShowMoreText text={post.body} threshold={280} />

      {/* Engagement */}
      <div className="flex items-center gap-3 mt-3 text-xs text-li-text-tertiary">
        <span>👍 {post.reactions.toLocaleString()}</span>
        <span aria-hidden="true">·</span>
        <span>{post.comments} comments</span>
      </div>
    </div>
  )
}
