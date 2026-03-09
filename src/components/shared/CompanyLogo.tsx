// src/components/shared/CompanyLogo.tsx
import { useState } from 'react'

interface CompanyLogoProps {
  domain: string
  name: string
  size?: number
  className?: string
}

function getInitials(name: string): string {
  const words = name.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/)
  if (words.length === 0 || !words[0]) return '??'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

const BG_COLORS = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100', 'bg-pink-100']

function domainColor(domain: string): string {
  const idx = domain.charCodeAt(0) % BG_COLORS.length
  return BG_COLORS[idx]
}

export function CompanyLogo({ domain, name, size = 40, className = '' }: CompanyLogoProps) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <div
        className={`${domainColor(domain)} rounded flex items-center justify-center flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
        aria-label={name}
      >
        <span className="text-xs font-semibold text-gray-600">{getInitials(name)}</span>
      </div>
    )
  }

  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setErrored(true)}
      className={`rounded object-contain flex-shrink-0 bg-white ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
