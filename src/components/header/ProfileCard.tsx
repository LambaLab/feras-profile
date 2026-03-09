import type { Profile } from '../../data/profileData'

interface ProfileCardProps {
  profile: Profile
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <>
      {/* Banner */}
      <div
        className="relative h-[100px] sm:h-40 overflow-hidden"
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
        <div className="relative -mt-12 mb-2 sm:-mt-16">
          <img
            src={profile.photo}
            alt={profile.name}
            width={128}
            height={128}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white object-cover bg-gray-200"
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
    </>
  )
}
