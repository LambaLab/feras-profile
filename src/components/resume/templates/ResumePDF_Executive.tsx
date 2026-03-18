// src/components/resume/templates/ResumePDF_Executive.tsx
import { Document, Page, View, Text, Link, StyleSheet } from '@react-pdf/renderer'
import type { Profile } from '../../../data/profileData'

const NAVY = '#1B2A4A'
const NAVY_LIGHT = '#9FB3D1'
const NAVY_MID = '#6B85A8'
const BLACK = '#111111'
const GRAY = '#4B5563'
const LIGHT = '#9CA3AF'
const RULE = '#CBD5E1'

const styles = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingBottom: 48,
    paddingHorizontal: 0,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: BLACK,
    lineHeight: 1.4,
  },
  header: {
    backgroundColor: NAVY,
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 52,
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  headline: {
    fontSize: 11,
    color: NAVY_LIGHT,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    fontSize: 9,
    color: NAVY_MID,
  },
  metaLink: {
    color: NAVY_LIGHT,
    fontSize: 9,
    textDecoration: 'none',
  },
  metaDot: { color: NAVY_MID, fontSize: 9 },
  body: { paddingHorizontal: 52 },
  section: { marginTop: 14 },
  sectionRule: { borderBottomWidth: 1, borderBottomColor: RULE, marginBottom: 5 },
  sectionLabel: {
    fontSize: 8,
    color: NAVY,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  aboutText: { fontSize: 9.5, color: BLACK, lineHeight: 1.5 },
  expEntry: { marginBottom: 10 },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  expCompany: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: BLACK },
  expDates: { fontSize: 9, color: LIGHT },
  expTitle: { fontSize: 9.5, fontFamily: 'Helvetica-Oblique', color: GRAY, marginBottom: 2 },
  expLocation: { fontSize: 8.5, color: LIGHT, marginBottom: 4 },
  expIntro: { fontSize: 9, color: BLACK, marginBottom: 3, lineHeight: 1.45 },
  expBulletRow: { flexDirection: 'row', marginBottom: 2 },
  expBulletDot: { fontSize: 9, color: NAVY, width: 12 },
  expBulletText: { fontSize: 9, color: BLACK, flex: 1, lineHeight: 1.4 },
  eduEntry: { marginBottom: 6 },
  eduSchool: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
  eduDegree: { fontSize: 9.5, color: GRAY },
  eduYears: { fontSize: 9, color: LIGHT },
  certEntry: { marginBottom: 3 },
  certName: { fontSize: 9, color: BLACK },
  certIssuer: { fontSize: 8.5, color: LIGHT },
  skillsText: { fontSize: 9, color: BLACK, lineHeight: 1.5 },
})

function parseDescription(description: string) {
  const blocks = description.split('\n\n')
  const intro = blocks[0] ?? ''
  const bullets = blocks.slice(1).flatMap(b => b.split('\n')).filter(l => l.trim().length > 0)
  return { intro, bullets }
}

export function ResumePDF_Executive({ profile }: { profile: Profile }) {
  const allSkills = [
    ...profile.skills.pinned, ...profile.skills.hard,
    ...profile.skills.industry, ...profile.skills.soft, ...profile.skills.emerging,
  ]
  return (
    <Document title={`${profile.name} — Resume`} author={profile.name} subject="Professional Resume">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.headline}>{profile.headline}</Text>
          <View style={styles.metaRow}>
            <Text>{profile.location}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Link src={profile.linkedinUrl} style={styles.metaLink}>{profile.linkedinUrl.replace('https://', '')}</Link>
            <Text style={styles.metaDot}>·</Text>
            <Link src={`mailto:${profile.email}`} style={styles.metaLink}>{profile.email}</Link>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.section}>
            <View style={styles.sectionRule} /><Text style={styles.sectionLabel}>About</Text>
            <Text style={styles.aboutText}>{profile.about}</Text>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionRule} /><Text style={styles.sectionLabel}>Experience</Text>
            {profile.experience.map(exp => {
              const { intro, bullets } = parseDescription(exp.description)
              return (
                <View key={exp.id} style={styles.expEntry}>
                  <View style={styles.expHeader}>
                    <Text style={styles.expCompany}>{exp.company}</Text>
                    <Text style={styles.expDates}>{exp.startDate} – {exp.endDate}</Text>
                  </View>
                  <Text style={styles.expTitle}>{exp.title}</Text>
                  <Text style={styles.expLocation}>{exp.location}</Text>
                  {intro.length > 0 && <Text style={styles.expIntro}>{intro}</Text>}
                  {bullets.map((bullet, i) => (
                    <View key={i} style={styles.expBulletRow}>
                      <Text style={styles.expBulletDot}>·</Text>
                      <Text style={styles.expBulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              )
            })}
          </View>
          <View style={styles.section}>
            <View style={styles.sectionRule} /><Text style={styles.sectionLabel}>Education</Text>
            {profile.education.map(edu => (
              <View key={edu.id} style={styles.eduEntry}>
                <Text style={styles.eduSchool}>{edu.school}</Text>
                <Text style={styles.eduDegree}>{edu.degree}, {edu.field}</Text>
                <Text style={styles.eduYears}>{edu.startYear} – {edu.endYear}</Text>
              </View>
            ))}
          </View>
          {profile.certifications.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionRule} /><Text style={styles.sectionLabel}>Certifications</Text>
              {profile.certifications.map((cert, i) => (
                <View key={i} style={styles.certEntry}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.certIssuer}>{cert.issuer}</Text>
                </View>
              ))}
            </View>
          )}
          <View style={styles.section}>
            <View style={styles.sectionRule} /><Text style={styles.sectionLabel}>Skills</Text>
            <Text style={styles.skillsText}>{allSkills.join(' · ')}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
