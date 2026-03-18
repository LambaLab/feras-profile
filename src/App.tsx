// src/App.tsx
import { useEffect, useState } from 'react'
import type { Profile } from './data/profileData'
import { ProfileCard } from './components/header/ProfileCard'
import { ActionButtons } from './components/header/ActionButtons'
import { SectionNav } from './components/header/SectionNav'
import { AboutSection } from './components/about/AboutSection'
import { ExperienceSection } from './components/experience/ExperienceSection'
import { SkillsSection } from './components/skills/SkillsSection'
import { EducationSection } from './components/education/EducationSection'
import { ActivitySection } from './components/activity/ActivitySection'

const NAV_SECTIONS = ['About', 'Experience', 'Skills', 'Education', 'Activity']

interface AppProps {
  profile: Profile
}

export default function App({ profile }: AppProps) {
  const [activeSection, setActiveSection] = useState('About')

  useEffect(() => {
    const handleScroll = () => {
      for (const section of [...NAV_SECTIONS].reverse()) {
        const el = document.getElementById(section.toLowerCase())
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 80) {
            setActiveSection(section)
            return
          }
        }
      }
      setActiveSection(NAV_SECTIONS[0])
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-li-bg">
      <main className="max-w-3xl mx-auto py-4 sm:py-0 flex flex-col sm:gap-2 gap-0">
        <div className="bg-white sm:rounded-lg shadow-li-card">
          <ProfileCard profile={profile} />
          <ActionButtons linkedinUrl={profile.linkedinUrl} email={profile.email} profile={profile} />
        </div>
        <SectionNav sections={NAV_SECTIONS} activeSection={activeSection} />
        <AboutSection text={profile.about} />
        <ExperienceSection experience={profile.experience} />
        <SkillsSection skills={profile.skills} />
        <EducationSection
          education={profile.education}
          certifications={profile.certifications}
          languages={profile.languages}
        />
        <ActivitySection
          posts={profile.posts}
          featuredArticle={profile.featuredArticle}
          profile={profile}
        />
        <div className="h-8" />
      </main>
    </div>
  )
}
