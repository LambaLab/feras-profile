// src/data/profileData.test.ts
import { profile } from './profileData'

describe('profileData', () => {
  it('has required top-level fields', () => {
    expect(profile.name).toBe('Feras H. Al-Bader')
    expect(profile.linkedinUrl).toBe('https://www.linkedin.com/in/nasserff/')
    expect(profile.location).toBe('Riyadh, Saudi Arabia')
  })

  it('has 12 experience entries', () => {
    expect(profile.experience).toHaveLength(12)
  })

  it('has current role at FlyAkeed', () => {
    expect(profile.experience[0].endDate).toBe('Present')
    expect(profile.experience[0].company).toBe('FlyAkeed')
  })

  it('has 2 education entries', () => {
    expect(profile.education).toHaveLength(2)
  })

  it('has 3 certifications', () => {
    expect(profile.certifications).toHaveLength(3)
  })

  it('has 3 pinned skills', () => {
    expect(profile.skills.pinned).toHaveLength(3)
    expect(profile.skills.pinned[0]).toBe('Revenue Architecture')
  })

  it('has 3 posts', () => {
    expect(profile.posts).toHaveLength(3)
  })

  it('each experience has a domain for logo lookup', () => {
    profile.experience.forEach(exp => {
      expect(exp.domain).toBeTruthy()
    })
  })
})
