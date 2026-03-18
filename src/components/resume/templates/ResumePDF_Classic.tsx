// src/components/resume/templates/ResumePDF_Classic.tsx
import { Document, Page, View, Text, Link, StyleSheet } from '@react-pdf/renderer'
import type { Profile } from '../../../data/profileData'

const BLUE = '#0A66C2'
const BLACK = '#111111'
const GRAY = '#555555'
const LIGHT = '#888888'

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 52,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: BLACK,
    lineHeight: 1.4,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  headline: {
    fontSize: 10.5,
    color: GRAY,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    fontSize: 9,
    color: LIGHT,
    marginBottom: 2,
  },
  metaLink: {
    color: BLUE,
    fontSize: 9,
    textDecoration: 'none',
  },
  metaDot: {
    color: LIGHT,
    fontSize: 9,
  },
  section: {
    marginTop: 14,
  },
  sectionRule: {
    borderBottomWidth: 1,
    borderBottomColor: BLUE,
    marginBottom: 5,
  },
  sectionLabel: {
    fontSize: 8,
    color: BLUE,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  aboutText: {
    fontSize: 9.5,
    color: BLACK,
    lineHeight: 1.5,
  },
  expEntry: {
    marginBottom: 10,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  expCompany: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: BLACK,
  },
  expDates: {
    fontSize: 9,
    color: LIGHT,
  },
  expTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Oblique',
    color: GRAY,
    marginBottom: 2,
  },
  expLocation: {
    fontSize: 8.5,
    color: LIGHT,
    marginBottom: 4,
  },
  expIntro: {
    fontSize: 9,
    color: BLACK,
    marginBottom: 3,
    lineHeight: 1.45,
  },
  expBulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  expBulletDot: {
    fontSize: 9,
    color: BLUE,
    width: 12,
  },
  expBulletText: {
    fontSize: 9,
    color: BLACK,
    flex: 1,
    lineHeight: 1.4,
  },
  eduEntry: {
    marginBottom: 6,
  },
  eduSchool: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  eduDegree: {
    fontSize: 9.5,
    color: GRAY,
  },
  eduYears: {
    fontSize: 9,
    color: LIGHT,
  },
  skillsText: {
    fontSize: 9,
    color: BLACK,
    lineHeight: 1.5,
  },
  certEntry: {
    marginBottom: 3,
  },
  certName: {
    fontSize: 9,
    color: BLACK,
  },
  certIssuer: {
    fontSize: 8.5,
    color: LIGHT,
  },
})

function parseDescription(description: string): { intro: string; bullets: string[] } {
  const blocks = description.split('\n\n')
  const intro = blocks[0] ?? ''
  const bullets = blocks
    .slice(1)
    .flatMap(b => b.split('\n'))
    .filter(line => line.trim().length > 0)
  return { intro, bullets }
}

interface ResumePDF_ClassicProps {
  profile: Profile
}

export function ResumePDF_Classic({ profile }: ResumePDF_ClassicProps) {
  const allSkills = [
    ...profile.skills.pinned,
    ...profile.skills.hard,
    ...profile.skills.industry,
    ...profile.skills.soft,
    ...profile.skills.emerging,
  ]

  return (
    <Document
      title={`${profile.name} — Resume`}
      author={profile.name}
      subject="Professional Resume"
    >
      <Page size="A4" style={styles.page}>

        {/* ── Header ─────────────────────────────────── */}
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.headline}>{profile.headline}</Text>
        <View style={styles.metaRow}>
          <Text>{profile.location}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Link src={profile.linkedinUrl} style={styles.metaLink}>
            {profile.linkedinUrl.replace('https://', '')}
          </Link>
          <Text style={styles.metaDot}>·</Text>
          <Link src={`mailto:${profile.email}`} style={styles.metaLink}>
            {profile.email}
          </Link>
        </View>

        {/* ── About ──────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionRule} />
          <Text style={styles.sectionLabel}>About</Text>
          <Text style={styles.aboutText}>{profile.about}</Text>
        </View>

        {/* ── Experience ─────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionRule} />
          <Text style={styles.sectionLabel}>Experience</Text>
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
                {intro.length > 0 && (
                  <Text style={styles.expIntro}>{intro}</Text>
                )}
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

        {/* ── Education ──────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionRule} />
          <Text style={styles.sectionLabel}>Education</Text>
          {profile.education.map(edu => (
            <View key={edu.id} style={styles.eduEntry}>
              <Text style={styles.eduSchool}>{edu.school}</Text>
              <Text style={styles.eduDegree}>{edu.degree}, {edu.field}</Text>
              <Text style={styles.eduYears}>{edu.startYear} – {edu.endYear}</Text>
            </View>
          ))}
        </View>

        {/* ── Certifications ─────────────────────────── */}
        {profile.certifications.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionRule} />
            <Text style={styles.sectionLabel}>Certifications</Text>
            {profile.certifications.map((cert, i) => (
              <View key={i} style={styles.certEntry}>
                <Text style={styles.certName}>{cert.name}</Text>
                <Text style={styles.certIssuer}>{cert.issuer}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Skills ─────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionRule} />
          <Text style={styles.sectionLabel}>Skills</Text>
          <Text style={styles.skillsText}>{allSkills.join(' · ')}</Text>
        </View>

      </Page>
    </Document>
  )
}
