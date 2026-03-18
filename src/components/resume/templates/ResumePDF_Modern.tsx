// src/components/resume/templates/ResumePDF_Modern.tsx
import { Document, Page, View, Text, Link, StyleSheet } from '@react-pdf/renderer'
import type { Profile } from '../../../data/profileData'
import { parseDescription } from './resumeUtils'

const TEAL = '#0D7377'
const TEAL_BG = '#E8F4F4'
const BLACK = '#111111'
const GRAY = '#4B5563'
const LIGHT = '#9CA3AF'

interface ResumePDF_ModernProps { profile: Profile }

const styles = StyleSheet.create({
  page: { flexDirection: 'row', fontFamily: 'Helvetica', fontSize: 10, color: BLACK, lineHeight: 1.4 },
  sidebar: { width: '30%', backgroundColor: TEAL_BG, padding: 24, minHeight: '100%' },
  main: { width: '70%', paddingTop: 32, paddingBottom: 48, paddingHorizontal: 28 },
  sidebarName: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: TEAL, marginBottom: 4, lineHeight: 1.3 },
  sidebarHeadline: { fontSize: 8.5, color: GRAY, marginBottom: 14, lineHeight: 1.4 },
  sidebarSection: { marginTop: 12 },
  sidebarLabel: { fontSize: 7.5, color: TEAL, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 },
  sidebarRule: { borderBottomWidth: 1, borderBottomColor: TEAL, marginBottom: 5 },
  sidebarText: { fontSize: 8, color: GRAY, lineHeight: 1.5 },
  sidebarLink: { fontSize: 8, color: TEAL, textDecoration: 'none' },
  sidebarSkill: { fontSize: 8, color: GRAY, marginBottom: 2 },
  section: { marginTop: 12 },
  sectionRule: { borderBottomWidth: 1, borderBottomColor: TEAL, marginBottom: 4 },
  sectionLabel: { fontSize: 8, color: TEAL, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  aboutText: { fontSize: 9, color: BLACK, lineHeight: 1.5 },
  expEntry: { marginBottom: 9 },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  expCompany: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: BLACK },
  expDates: { fontSize: 8.5, color: LIGHT },
  expTitle: { fontSize: 9, fontFamily: 'Helvetica-Oblique', color: GRAY, marginBottom: 2 },
  expLocation: { fontSize: 8, color: LIGHT, marginBottom: 3 },
  expIntro: { fontSize: 8.5, color: BLACK, marginBottom: 2, lineHeight: 1.4 },
  expBulletRow: { flexDirection: 'row', marginBottom: 1.5 },
  expBulletDot: { fontSize: 8.5, color: TEAL, width: 10 },
  expBulletText: { fontSize: 8.5, color: BLACK, flex: 1, lineHeight: 1.35 },
  eduEntry: { marginBottom: 5 },
  eduSchool: { fontSize: 9.5, fontFamily: 'Helvetica-Bold' },
  eduDegree: { fontSize: 9, color: GRAY },
  eduYears: { fontSize: 8.5, color: LIGHT },
  certEntry: { marginBottom: 3 },
  certName: { fontSize: 8.5, color: BLACK },
  certIssuer: { fontSize: 8, color: LIGHT },
})

export function ResumePDF_Modern({ profile }: ResumePDF_ModernProps) {
  const allSkills = [
    ...profile.skills.pinned, ...profile.skills.hard,
    ...profile.skills.industry, ...profile.skills.soft, ...profile.skills.emerging,
  ]
  return (
    <Document title={`${profile.name} — Resume`} author={profile.name} subject="Professional Resume" creator={profile.name}>
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarName}>{profile.name}</Text>
          <Text style={styles.sidebarHeadline}>{profile.headline}</Text>
          <View style={styles.sidebarSection}>
            <View style={styles.sidebarRule} />
            <Text style={styles.sidebarLabel}>Contact</Text>
            <Text style={styles.sidebarText}>{profile.location}</Text>
            <Link src={`mailto:${profile.email}`} style={styles.sidebarLink}>{profile.email}</Link>
            <Link src={profile.linkedinUrl} style={styles.sidebarLink}>{profile.linkedinUrl.replace('https://', '')}</Link>
          </View>
          <View style={styles.sidebarSection}>
            <View style={styles.sidebarRule} />
            <Text style={styles.sidebarLabel}>Skills</Text>
            {allSkills.map((skill, i) => (
              <Text key={i} style={styles.sidebarSkill}>• {skill}</Text>
            ))}
          </View>
        </View>

        {/* Main */}
        <View style={styles.main}>
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
        </View>
      </Page>
    </Document>
  )
}
