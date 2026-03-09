interface ActionButtonsProps {
  linkedinUrl: string
  email: string
}

export function ActionButtons({ linkedinUrl, email }: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 px-4 pb-4">
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-li-blue text-white text-sm font-semibold rounded-full hover:bg-li-blue-dark transition-colors"
      >
        Connect
      </a>
      {email && (
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-li-blue text-li-blue text-sm font-semibold rounded-full hover:bg-li-blue-light transition-colors"
        >
          Message
        </a>
      )}
      <button
        aria-label="More options"
        className="inline-flex items-center gap-1 px-4 py-1.5 border border-gray-400 text-li-text-secondary text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors"
      >
        More
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M3 8a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm4.5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm4.5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"/>
        </svg>
      </button>
    </div>
  )
}
