// src/components/education/CertificationList.tsx
import type { Certification } from '../../data/profileData'
import { CompanyLogo } from '../shared/CompanyLogo'

interface CertificationListProps {
  certifications: Certification[]
}

export function CertificationList({ certifications }: CertificationListProps) {
  return (
    <div>
      <div className="px-4 pt-4 pb-0">
        <h2 className="text-xl font-semibold text-li-text">Licenses &amp; Certifications</h2>
      </div>
      {certifications.map(cert => (
        <div key={cert.name} className="flex gap-3 px-4 py-4 border-b border-li-border last:border-0">
          <CompanyLogo domain={cert.domain} name={cert.issuer} size={40} className="mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-li-text">{cert.name}</p>
            <p className="text-sm text-li-text-secondary">{cert.issuer}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
