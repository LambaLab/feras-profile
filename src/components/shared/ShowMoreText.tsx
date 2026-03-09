// src/components/shared/ShowMoreText.tsx
import { useState } from 'react'

interface ShowMoreTextProps {
  text: string
  threshold?: number
  className?: string
}

export function ShowMoreText({ text, threshold = 200, className = '' }: ShowMoreTextProps) {
  const [expanded, setExpanded] = useState(false)
  const isLong = text.length > threshold

  return (
    <div className={`text-sm text-li-text leading-relaxed whitespace-pre-line ${className}`}>
      <span
        style={!expanded && isLong ? {
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
          whiteSpace: 'pre-line',
        } : undefined}
      >
        {text}
      </span>
      {isLong && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-li-blue font-semibold hover:underline mt-0.5 block"
        >
          {expanded ? 'see less' : '…see more'}
        </button>
      )}
    </div>
  )
}
