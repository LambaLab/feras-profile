// src/components/resume/templates/ResumePDF_Compact.tsx
import { Document, Page, View, Text, Link, StyleSheet } from '@react-pdf/renderer'
import type { Profile } from '../../../data/profileData'
import { parseDescription } from './resumeUtils'

const SLATE = '#374151'
const BLACK = '#111111'
const GRAY = '#4B5563'
const LIGHT = '#9CA3AF'

interface ResumePDF_CompactProps { profile: Profile }

const styles = StyleSheet.create({
  page: { paddingTop: 36, paddingBottom: 36, paddingHorizontal: 44, fontFamily: 'Helvetica', fontSize: 9, color: BLACK, lineHeight: 1.4 },
  name: { fontSize: 19, fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  headline: { fontSize: 9.5, color: GRAY, marginBottom: 4 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, fontSize: 8.5, color: LIGHT, marginBottom: 2 },
  metaLink: { color: SLATE, fontSize: 8.5, textDecoration: 'none' },
  metaDot: { color: LIGHT, fontSize: 8.5 },
  section: { marginTop: 10 },
  sectionRule: { borderBottomWidth: 1, borderBottomColor: LIGHT, marginBottom: 4 },
  sectionLabel: { fontSize: 7, color: SLATE, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  aboutText: { fontSize: 8.5, color: BLACK, lineHeight: 1.5 },
  expEntry: { marginBottom: 7 },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  expCompany: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: BLACK },
  expDates: { fontSize: 8.5, color: LIGHT },
  expTitle: { fontSize: 9, fontFamily: 'Helvetica-Oblique', color: GRAY, marginBottom: 1 },
  expLocation: { fontSize: 8, color: LIGHT, marginBottom: 3 },
  expIntro: { fontSize: 8.5, color: BLACK, marginBottom: 2, lineHeight: 1.4 },
  expBulletRow: { flexDirection: 'row', marginBottom: 1.5 },
  expBulletDot: { fontSize: 8.5, color: SLATE, width: 10 },
  expBulletText: { fontSize: 8.5, color: BLACK, flex: 1, lineHeight: 1.35 },
  eduEntry: { marginBottom: 4 },
  eduSchool: { fontSize: 9.5, fontFamily: 'Helvetica-Bold' },
  eduDegree: { fontSize: 9, color: GRAY },
  eduYears: { fontSize: 8.5, color: LIGHT },
  certEntry: { marginBottom: 2 },
  certName: { fontSize: 8.5, color: BLACK },
  certIssuer: { fontSize: 8, color: LIGHT },
  skillsText: { fontSize: 8.5, color: BLACK, lineHeight: 1.5 },
})

export function ResumePDF_Compact({ profile }: ResumePDF_CompactProps) {
  const allSkills = [
    ...profile.skills.pinned, ...profile.skills.hard,
    ...profile.skills.industry, ...profile.skills.soft, ...profile.skills.emerging,
  ]
  return (
    <Document title={`${profile.name} — Resume`} author={profile.name} subject="Professional Resume" creator={profile.name}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.headline}>{profile.headline}</Text>
        <View style={styles.metaRow}>
          <Text>{profile.location}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Link src={profile.linkedinUrl} style={styles.metaLink}>{profile.linkedinUrl.replace('https://', '')}</Link>
          <Text style={styles.metaDot}>·</Text>
          <Link src={`mailto:${profile.email}`} style={styles.metaLink}>{profile.email}</Link>
        </View>
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
      </Page>
    </Document>
  )
}
