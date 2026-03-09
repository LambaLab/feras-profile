import type { Profile } from '../../data/profileData'

interface ProfileCardProps {
  profile: Profile
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-li-card overflow-hidden">
      {/* Banner */}
      <div
        className="relative h-40 sm:h-28 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A66C2 0%, #004182 100%)' }}
      >
        {profile.banner && (
          <img
            src={profile.banner}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Photo + Info */}
      <div className="px-4 pb-4">
        {/* Profile photo — overlaps banner */}
        <div className="-mt-16 mb-2 sm:-mt-12">
          <img
            src={profile.photo}
            alt={profile.name}
            width={128}
            height={128}
            className="w-32 h-32 sm:w-24 sm:h-24 rounded-full border-4 border-white object-cover bg-gray-200"
          />
        </div>

        <h1 className="text-2xl sm:text-xl font-bold text-li-text leading-tight">
          {profile.name}
        </h1>

        <p className="text-base text-li-text mt-1 leading-snug">
          {profile.headline}
        </p>

        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-2">
          <span className="text-sm text-li-text-secondary">{profile.location}</span>
          <span className="text-sm text-li-text-tertiary" aria-hidden="true">·</span>
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-li-blue font-semibold hover:underline"
          >
            {profile.connections} connections
          </a>
        </div>
      </div>
    </div>
  )
}
