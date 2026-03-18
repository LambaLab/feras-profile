# Resume Template Picker Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a template picker modal so viewers choose from 5 CV styles before downloading as PDF, Word, or Google Doc.

**Architecture:** Template registry pattern — each template is a self-contained PDF component + DOCX generator registered in `templateRegistry.ts`. Clicking "Download CV" opens `TemplatePickerModal` which shows live PDF thumbnails via `BlobProvider` + scaled `<iframe>`. Selected template state lives in `ResumeDownloadButton`, persists for the session.

**Tech Stack:** React 19, TypeScript, `@react-pdf/renderer` (BlobProvider, Document/Page/View/Text), `docx` npm package, Tailwind CSS 3, Vitest + React Testing Library.

---

## Context: How the codebase works

- Node: `~/.nvm/versions/node/v25.7.0/bin/node`
- Run tests: `~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run`
- Build: `~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm run build`
- Current PDF template: `src/components/resume/ResumePDF.tsx` — single column, blue (#0A66C2) accents, Helvetica
- Current DOCX generator: `src/components/resume/generateDocx.ts`
- Download button: `src/components/resume/ResumeDownloadButton.tsx` — currently a dropdown (pill + menu-item variants)
- Profile type: `import type { Profile } from '../../data/profileData'`
- All 69 tests must pass before committing

---

### Task 1: Template Registry

**Files:**
- Create: `src/components/resume/templates/ResumePDF_Classic.tsx`
- Create: `src/components/resume/templateRegistry.ts`
- Modify: `src/components/resume/ResumePDF.tsx`

**Step 1: Create `ResumePDF_Classic.tsx`** — copy the entire contents of `src/components/resume/ResumePDF.tsx` verbatim, change only the export name from `ResumePDF` to `ResumePDF_Classic`.

```tsx
// src/components/resume/templates/ResumePDF_Classic.tsx
// Full copy of ResumePDF.tsx with export renamed to ResumePDF_Classic
import { Document, Page, View, Text, Link, StyleSheet } from '@react-pdf/renderer'
import type { Profile } from '../../../data/profileData'
// ... (all existing styles and parseDescription function unchanged)
export function ResumePDF_Classic({ profile }: { profile: Profile }) {
  // ... exact same JSX as ResumePDF
}
```

**Step 2: Update `ResumePDF.tsx`** to re-export from Classic (preserves all existing tests):

```tsx
// src/components/resume/ResumePDF.tsx
export { ResumePDF_Classic as ResumePDF } from './templates/ResumePDF_Classic'
```

**Step 3: Write the failing test** in a new file `src/components/resume/templateRegistry.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { TEMPLATES } from './templateRegistry'

describe('templateRegistry', () => {
  it('has 5 templates', () => {
    expect(TEMPLATES).toHaveLength(5)
  })

  it('each template has required fields', () => {
    for (const t of TEMPLATES) {
      expect(t.id).toBeTruthy()
      expect(t.name).toBeTruthy()
      expect(t.component).toBeTruthy()
      expect(t.generateDocx).toBeTruthy()
    }
  })

  it('first template is classic', () => {
    expect(TEMPLATES[0].id).toBe('classic')
  })
})
```

**Step 4: Run test to verify it fails**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run src/components/resume/templateRegistry.test.ts
```
Expected: FAIL — `templateRegistry` not found.

**Step 5: Create `templateRegistry.ts`** (stub with Classic only — other templates added in later tasks):

```ts
// src/components/resume/templateRegistry.ts
import { ResumePDF_Classic } from './templates/ResumePDF_Classic'
import { generateDocxBlob } from './generateDocx'
import type { Profile } from '../../data/profileData'
import type { ComponentType } from 'react'

export interface Template {
  id: string
  name: string
  component: ComponentType<{ profile: Profile }>
  generateDocx: (profile: Profile) => Promise<Blob>
}

export const TEMPLATES: Template[] = [
  { id: 'classic', name: 'Classic', component: ResumePDF_Classic, generateDocx: generateDocxBlob },
  // placeholders — filled in Tasks 2-5:
  { id: 'executive', name: 'Executive', component: ResumePDF_Classic, generateDocx: generateDocxBlob },
  { id: 'modern', name: 'Modern', component: ResumePDF_Classic, generateDocx: generateDocxBlob },
  { id: 'compact', name: 'Compact', component: ResumePDF_Classic, generateDocx: generateDocxBlob },
  { id: 'minimal', name: 'Minimal', component: ResumePDF_Classic, generateDocx: generateDocxBlob },
]

export type TemplateId = 'classic' | 'executive' | 'modern' | 'compact' | 'minimal'
```

**Step 6: Run tests**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run
```
Expected: all 69 tests pass (ResumePDF re-export keeps existing tests green).

**Step 7: Commit**

```bash
git add src/components/resume/templates/ResumePDF_Classic.tsx src/components/resume/ResumePDF.tsx src/components/resume/templateRegistry.ts src/components/resume/templateRegistry.test.ts
git commit -m "feat: add template registry with Classic template"
```

---

### Task 2: Executive Template

**Files:**
- Create: `src/components/resume/templates/ResumePDF_Executive.tsx`
- Create: `src/components/resume/generateDocx_Executive.ts`
- Modify: `src/components/resume/templateRegistry.ts`

**Design:** Full-width dark navy (`#1B2A4A`) header block (name in white 24pt, headline in `#9FB3D1` 11pt, meta row in `#6B85A8` 9pt). Section labels in navy, thin `#CBD5E1` rule. Otherwise same single-column structure.

**Step 1: Write failing smoke test** in `src/components/resume/templates/ResumePDF_Executive.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'

// @react-pdf/renderer is auto-mocked in vitest (see existing ResumePDF.test.tsx for pattern)
import { ResumePDF_Executive } from './ResumePDF_Executive'
import { profile } from '../../../data/profileData'

describe('ResumePDF_Executive', () => {
  it('renders without throwing', () => {
    expect(() => render(React.createElement(ResumePDF_Executive, { profile }))).not.toThrow()
  })
})
```

**Step 2: Run to verify fail**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run src/components/resume/templates/ResumePDF_Executive.test.tsx
```

**Step 3: Create `ResumePDF_Executive.tsx`**

```tsx
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
```

**Step 4: Create `generateDocx_Executive.ts`** — same structure as `generateDocx.ts` but header background shading navy, section labels navy color:

```ts
// src/components/resume/generateDocx_Executive.ts
import { Document, Paragraph, TextRun, Packer, BorderStyle, ShadingType } from 'docx'
import type { Profile } from '../../data/profileData'

function parseDescription(description: string) {
  const blocks = description.split('\n\n')
  const intro = blocks[0] ?? ''
  const bullets = blocks.slice(1).flatMap(b => b.split('\n')).filter(l => l.trim().length > 0)
  return { intro, bullets }
}

function sectionHeading(label: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: label, bold: true, size: 18, color: '1B2A4A', allCaps: true })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1', space: 4 } },
    spacing: { before: 280, after: 100 },
  })
}

export async function generateDocxBlob_Executive(profile: Profile): Promise<Blob> {
  const children: Paragraph[] = []

  // Navy header block (simulated with shading)
  children.push(new Paragraph({
    children: [new TextRun({ text: profile.name, bold: true, size: 48, color: 'FFFFFF' })],
    shading: { type: ShadingType.SOLID, color: '1B2A4A', fill: '1B2A4A' },
    spacing: { before: 0, after: 60 },
  }))
  children.push(new Paragraph({
    children: [new TextRun({ text: profile.headline, size: 22, color: '9FB3D1' })],
    shading: { type: ShadingType.SOLID, color: '1B2A4A', fill: '1B2A4A' },
    spacing: { after: 60 },
  }))
  children.push(new Paragraph({
    children: [
      new TextRun({ text: profile.location, size: 18, color: '6B85A8' }),
      new TextRun({ text: '  ·  ', size: 18, color: '6B85A8' }),
      new TextRun({ text: profile.linkedinUrl.replace('https://', ''), size: 18, color: '9FB3D1' }),
      new TextRun({ text: '  ·  ', size: 18, color: '6B85A8' }),
      new TextRun({ text: profile.email, size: 18, color: '9FB3D1' }),
    ],
    shading: { type: ShadingType.SOLID, color: '1B2A4A', fill: '1B2A4A' },
    spacing: { after: 240 },
  }))

  children.push(sectionHeading('About'))
  children.push(new Paragraph({ children: [new TextRun({ text: profile.about, size: 19 })], spacing: { after: 120 } }))

  children.push(sectionHeading('Experience'))
  for (const exp of profile.experience) {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: exp.company, bold: true, size: 20 }),
        new TextRun({ text: `   ${exp.startDate} – ${exp.endDate}`, size: 18, color: '9CA3AF' }),
      ],
      spacing: { before: 160, after: 40 },
    }))
    children.push(new Paragraph({ children: [new TextRun({ text: exp.title, italics: true, size: 19, color: '555555' })], spacing: { after: 40 } }))
    children.push(new Paragraph({ children: [new TextRun({ text: exp.location, size: 17, color: '9CA3AF' })], spacing: { after: 80 } }))
    const { intro, bullets } = parseDescription(exp.description)
    if (intro) children.push(new Paragraph({ children: [new TextRun({ text: intro, size: 18 })], spacing: { after: 60 } }))
    for (const bullet of bullets) {
      children.push(new Paragraph({ children: [new TextRun({ text: bullet, size: 18 })], bullet: { level: 0 }, spacing: { after: 40 } }))
    }
  }

  children.push(sectionHeading('Education'))
  for (const edu of profile.education) {
    children.push(new Paragraph({ children: [new TextRun({ text: edu.school, bold: true, size: 20 })], spacing: { before: 120, after: 40 } }))
    children.push(new Paragraph({ children: [new TextRun({ text: `${edu.degree}, ${edu.field}`, size: 19, color: '555555' })], spacing: { after: 40 } }))
    children.push(new Paragraph({ children: [new TextRun({ text: `${edu.startYear} – ${edu.endYear}`, size: 17, color: '9CA3AF' })], spacing: { after: 80 } }))
  }

  if (profile.certifications.length > 0) {
    children.push(sectionHeading('Certifications'))
    for (const cert of profile.certifications) {
      children.push(new Paragraph({ children: [new TextRun({ text: cert.name, bold: true, size: 18 })], spacing: { before: 80, after: 20 } }))
      children.push(new Paragraph({ children: [new TextRun({ text: cert.issuer, size: 17, color: '9CA3AF' })], spacing: { after: 60 } }))
    }
  }

  const allSkills = [...profile.skills.pinned, ...profile.skills.hard, ...profile.skills.industry, ...profile.skills.soft, ...profile.skills.emerging]
  children.push(sectionHeading('Skills'))
  children.push(new Paragraph({ children: [new TextRun({ text: allSkills.join(' · '), size: 18 })], spacing: { after: 80 } }))

  const doc = new Document({
    creator: profile.name,
    title: `${profile.name} — Resume`,
    sections: [{ properties: { page: { margin: { top: 0, bottom: 720, left: 900, right: 900 } } }, children }],
  })
  return Packer.toBlob(doc)
}
```

**Step 5: Update registry** — replace Executive placeholder in `TEMPLATES`:

```ts
import { ResumePDF_Executive } from './templates/ResumePDF_Executive'
import { generateDocxBlob_Executive } from './generateDocx_Executive'
// ... in TEMPLATES array:
{ id: 'executive', name: 'Executive', component: ResumePDF_Executive, generateDocx: generateDocxBlob_Executive },
```

**Step 6: Run all tests**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run
```
Expected: all pass.

**Step 7: Commit**

```bash
git add src/components/resume/templates/ResumePDF_Executive.tsx src/components/resume/generateDocx_Executive.ts src/components/resume/templateRegistry.ts src/components/resume/templates/ResumePDF_Executive.test.tsx
git commit -m "feat: add Executive resume template"
```

---

### Task 3: Modern Template (Two-Column)

**Files:**
- Create: `src/components/resume/templates/ResumePDF_Modern.tsx`
- Create: `src/components/resume/generateDocx_Modern.ts`
- Modify: `src/components/resume/templateRegistry.ts`

**Design:** Left sidebar (~30% width, teal bg `#E8F4F4`) contains name + contact + skills. Right main (~70%) contains About, Experience, Education, Certs. Teal `#0D7377` section labels everywhere.

**Step 1: Write failing smoke test** in `src/components/resume/templates/ResumePDF_Modern.test.tsx` (same pattern as Executive test — import, render, expect no throw).

**Step 2: Run to verify fail.**

**Step 3: Create `ResumePDF_Modern.tsx`:**

```tsx
// src/components/resume/templates/ResumePDF_Modern.tsx
import { Document, Page, View, Text, Link, StyleSheet } from '@react-pdf/renderer'
import type { Profile } from '../../../data/profileData'

const TEAL = '#0D7377'
const TEAL_BG = '#E8F4F4'
const BLACK = '#111111'
const GRAY = '#4B5563'
const LIGHT = '#9CA3AF'

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

function parseDescription(description: string) {
  const blocks = description.split('\n\n')
  const intro = blocks[0] ?? ''
  const bullets = blocks.slice(1).flatMap(b => b.split('\n')).filter(l => l.trim().length > 0)
  return { intro, bullets }
}

export function ResumePDF_Modern({ profile }: { profile: Profile }) {
  const allSkills = [
    ...profile.skills.pinned, ...profile.skills.hard,
    ...profile.skills.industry, ...profile.skills.soft, ...profile.skills.emerging,
  ]
  return (
    <Document title={`${profile.name} — Resume`} author={profile.name} subject="Professional Resume">
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
```

**Step 4: Create `generateDocx_Modern.ts`** — same structure as `generateDocx.ts` but section labels use teal `0D7377`, rule color `0D7377`. Skills moved to top after header.

```ts
// src/components/resume/generateDocx_Modern.ts
// Same as generateDocx.ts but:
// - sectionHeading color: '0D7377', rule color: '0D7377'
// - Skills section moved immediately after header (before About)
// Copy generateDocx.ts, rename export to generateDocxBlob_Modern,
// change BLUE='0A66C2' references to '0D7377' throughout,
// and reorder sections: header → skills → about → experience → education → certs
import { Document, Paragraph, TextRun, Packer, BorderStyle } from 'docx'
import type { Profile } from '../../data/profileData'

function parseDescription(description: string) {
  const blocks = description.split('\n\n')
  const intro = blocks[0] ?? ''
  const bullets = blocks.slice(1).flatMap(b => b.split('\n')).filter(l => l.trim().length > 0)
  return { intro, bullets }
}

function sectionHeading(label: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: label, bold: true, size: 18, color: '0D7377', allCaps: true })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '0D7377', space: 4 } },
    spacing: { before: 280, after: 100 },
  })
}

export async function generateDocxBlob_Modern(profile: Profile): Promise<Blob> {
  const children: Paragraph[] = []

  children.push(new Paragraph({ children: [new TextRun({ text: profile.name, bold: true, size: 44, color: '111111' })], spacing: { after: 80 } }))
  children.push(new Paragraph({ children: [new TextRun({ text: profile.headline, size: 22, color: '555555' })], spacing: { after: 60 } }))
  children.push(new Paragraph({
    children: [
      new TextRun({ text: profile.location, size: 18, color: '888888' }),
      new TextRun({ text: '  ·  ', size: 18, color: '888888' }),
      new TextRun({ text: profile.linkedinUrl.replace('https://', ''), size: 18, color: '0D7377' }),
      new TextRun({ text: '  ·  ', size: 18, color: '888888' }),
      new TextRun({ text: profile.email, size: 18, color: '0D7377' }),
    ],
    spacing: { after: 200 },
  }))

  const allSkills = [...profile.skills.pinned, ...profile.skills.hard, ...profile.skills.industry, ...profile.skills.soft, ...profile.skills.emerging]
  children.push(sectionHeading('Skills'))
  children.push(new Paragraph({ children: [new TextRun({ text: allSkills.join(' · '), size: 18 })], spacing: { after: 120 } }))

  children.push(sectionHeading('About'))
  children.push(new Paragraph({ children: [new TextRun({ text: profile.about, size: 19 })], spacing: { after: 120 } }))

  children.push(sectionHeading('Experience'))
  for (const exp of profile.experience) {
    children.push(new Paragraph({ children: [new TextRun({ text: exp.company, bold: true, size: 20 }), new TextRun({ text: `   ${exp.startDate} – ${exp.endDate}`, size: 18, color: '888888' })], spacing: { before: 160, after: 40 } }))
    children.push(new Paragraph({ children: [new TextRun({ text: exp.title, italics: true, size: 19, color: '555555' })], spacing: { after: 40 } }))
    children.push(new Paragraph({ children: [new TextRun({ text: exp.location, size: 17, color: '888888' })], spacing: { after: 80 } }))
    const { intro, bullets } = parseDescription(exp.description)
    if (intro) children.push(new Paragraph({ children: [new TextRun({ text: intro, size: 18 })], spacing: { after: 60 } }))
    for (const bullet of bullets) children.push(new Paragraph({ children: [new TextRun({ text: bullet, size: 18 })], bullet: { level: 0 }, spacing: { after: 40 } }))
  }

  children.push(sectionHeading('Education'))
  for (const edu of profile.education) {
    children.push(new Paragraph({ children: [new TextRun({ text: edu.school, bold: true, size: 20 })], spacing: { before: 120, after: 40 } }))
    children.push(new Paragraph({ children: [new TextRun({ text: `${edu.degree}, ${edu.field}`, size: 19, color: '555555' })], spacing: { after: 40 } }))
    children.push(new Paragraph({ children: [new TextRun({ text: `${edu.startYear} – ${edu.endYear}`, size: 17, color: '888888' })], spacing: { after: 80 } }))
  }

  if (profile.certifications.length > 0) {
    children.push(sectionHeading('Certifications'))
    for (const cert of profile.certifications) {
      children.push(new Paragraph({ children: [new TextRun({ text: cert.name, bold: true, size: 18 })], spacing: { before: 80, after: 20 } }))
      children.push(new Paragraph({ children: [new TextRun({ text: cert.issuer, size: 17, color: '888888' })], spacing: { after: 60 } }))
    }
  }

  const doc = new Document({
    creator: profile.name, title: `${profile.name} — Resume`,
    sections: [{ properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } }, children }],
  })
  return Packer.toBlob(doc)
}
```

**Step 5: Update registry** — replace Modern placeholder with real imports.

**Step 6: Run all tests** — expect all pass.

**Step 7: Commit**

```bash
git add src/components/resume/templates/ResumePDF_Modern.tsx src/components/resume/templates/ResumePDF_Modern.test.tsx src/components/resume/generateDocx_Modern.ts src/components/resume/templateRegistry.ts
git commit -m "feat: add Modern two-column resume template"
```

---

### Task 4: Compact + Minimal Templates

**Files:**
- Create: `src/components/resume/templates/ResumePDF_Compact.tsx`
- Create: `src/components/resume/templates/ResumePDF_Minimal.tsx`
- Create: `src/components/resume/generateDocx_Compact.ts`
- Create: `src/components/resume/generateDocx_Minimal.ts`
- Modify: `src/components/resume/templateRegistry.ts`

**Compact design:** Copy Classic styles, reduce all font sizes by 1pt, reduce all `marginBottom`/`spacing` by 30%, section labels in slate `#374151`.

**Minimal design:** Copy Classic styles, remove all color (black `#111111` everywhere), replace blue bullet dot `·` with em dash `—`, section rule color `#CCCCCC`, section labels black small-caps.

**Step 1: Write failing smoke tests** for both in separate test files (same render-without-throw pattern).

**Step 2: Run to verify both fail.**

**Step 3: Create `ResumePDF_Compact.tsx`** — copy Classic, apply these style changes:

```tsx
// Key style differences from Classic:
const SLATE = '#374151'
// page: paddingTop:36, paddingBottom:36, paddingHorizontal:44, fontSize:9
// name: fontSize:19
// headline: fontSize:9.5
// section: marginTop:10
// sectionLabel: fontSize:7, color:SLATE
// sectionRule: borderBottomColor:SLATE (or '#9CA3AF')
// expEntry: marginBottom:7
// expCompany: fontSize:9.5
// expTitle: fontSize:9
// expBulletDot: color:SLATE
// expBulletText: fontSize:8.5
// eduSchool: fontSize:9.5
// All spacing values multiplied by 0.7
```

**Step 4: Create `ResumePDF_Minimal.tsx`** — copy Classic, apply:

```tsx
// Key style differences:
// Remove BLUE entirely — all text BLACK or GRAY or LIGHT (#AAAAAA)
// sectionLabel: color:BLACK, fontSize:8
// sectionRule: borderBottomColor:'#CCCCCC'
// expBulletDot: color:BLACK, text content '—' instead of '·'
// metaLink: color:BLACK (no blue links)
// No color anywhere
```

**Step 5: Create `generateDocx_Compact.ts`** — copy `generateDocx.ts`, scale all `size` values down by 2 (e.g. 44→40, 22→20, 20→18, 19→17, 18→16, 17→15), reduce all `spacing.before`/`spacing.after` by 30%, section label color `374151`.

**Step 6: Create `generateDocx_Minimal.ts`** — copy `generateDocx.ts`, replace `'0A66C2'` with `'111111'` everywhere, rule color `'CCCCCC'`.

**Step 7: Update registry** — replace Compact and Minimal placeholders with real imports.

**Step 8: Run all tests** — expect all pass.

**Step 9: Commit**

```bash
git add src/components/resume/templates/ResumePDF_Compact.tsx src/components/resume/templates/ResumePDF_Minimal.tsx src/components/resume/templates/ResumePDF_Compact.test.tsx src/components/resume/templates/ResumePDF_Minimal.test.tsx src/components/resume/generateDocx_Compact.ts src/components/resume/generateDocx_Minimal.ts src/components/resume/templateRegistry.ts
git commit -m "feat: add Compact and Minimal resume templates"
```

---

### Task 5: Template Picker Modal

**Files:**
- Create: `src/components/resume/TemplatePickerModal.tsx`
- Create: `src/components/resume/TemplatePickerModal.test.tsx`

**Step 1: Write failing tests:**

```tsx
// src/components/resume/TemplatePickerModal.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TemplatePickerModal } from './TemplatePickerModal'
import { profile } from '../../data/profileData'

describe('TemplatePickerModal', () => {
  it('renders all 5 template names', () => {
    render(
      <TemplatePickerModal
        profile={profile}
        selectedId="classic"
        onSelect={vi.fn()}
        onDownloadPdf={vi.fn()}
        onDownloadWord={vi.fn()}
        onGoogleDoc={vi.fn()}
        onClose={vi.fn()}
        googleDocStatus="idle"
      />
    )
    expect(screen.getByText('Classic')).toBeInTheDocument()
    expect(screen.getByText('Executive')).toBeInTheDocument()
    expect(screen.getByText('Modern')).toBeInTheDocument()
    expect(screen.getByText('Compact')).toBeInTheDocument()
    expect(screen.getByText('Minimal')).toBeInTheDocument()
  })

  it('calls onSelect when a template card is clicked', () => {
    const onSelect = vi.fn()
    render(
      <TemplatePickerModal
        profile={profile}
        selectedId="classic"
        onSelect={onSelect}
        onDownloadPdf={vi.fn()}
        onDownloadWord={vi.fn()}
        onGoogleDoc={vi.fn()}
        onClose={vi.fn()}
        googleDocStatus="idle"
      />
    )
    fireEvent.click(screen.getByText('Executive'))
    expect(onSelect).toHaveBeenCalledWith('executive')
  })

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn()
    render(
      <TemplatePickerModal
        profile={profile}
        selectedId="classic"
        onSelect={vi.fn()}
        onDownloadPdf={vi.fn()}
        onDownloadWord={vi.fn()}
        onGoogleDoc={vi.fn()}
        onClose={onClose}
        googleDocStatus="idle"
      />
    )
    fireEvent.click(screen.getByTestId('modal-overlay'))
    expect(onClose).toHaveBeenCalled()
  })

  it('shows Download PDF button', () => {
    render(
      <TemplatePickerModal
        profile={profile}
        selectedId="classic"
        onSelect={vi.fn()}
        onDownloadPdf={vi.fn()}
        onDownloadWord={vi.fn()}
        onGoogleDoc={vi.fn()}
        onClose={vi.fn()}
        googleDocStatus="idle"
      />
    )
    expect(screen.getByText('Download PDF')).toBeInTheDocument()
  })
})
```

**Step 2: Run to verify fail.**

**Step 3: Create `TemplatePickerModal.tsx`:**

```tsx
// src/components/resume/TemplatePickerModal.tsx
import { useEffect, useRef, useState } from 'react'
import { BlobProvider } from '@react-pdf/renderer'
import { TEMPLATES } from './templateRegistry'
import type { TemplateId } from './templateRegistry'
import type { Profile } from '../../data/profileData'
import type { GoogleDocStatus } from './ResumeDownloadButton'

interface Props {
  profile: Profile
  selectedId: TemplateId
  onSelect: (id: TemplateId) => void
  onDownloadPdf: () => void
  onDownloadWord: () => void
  onGoogleDoc: () => void
  onClose: () => void
  googleDocStatus: GoogleDocStatus
}

function googleDocLabel(status: GoogleDocStatus, errorMsg: string) {
  if (status === 'signing-in') return 'Signing in…'
  if (status === 'uploading') return 'Uploading…'
  if (status === 'error') return errorMsg
  return 'Open as Google Doc'
}

export function TemplatePickerModal({
  profile, selectedId, onSelect, onDownloadPdf, onDownloadWord, onGoogleDoc, onClose, googleDocStatus,
}: Props) {
  const [errorMsg] = useState('Upload failed — try again')

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Track generated blob URLs to revoke on unmount
  const blobUrls = useRef<string[]>([])
  useEffect(() => {
    return () => { blobUrls.current.forEach(URL.revokeObjectURL) }
  }, [])

  const selectedTemplate = TEMPLATES.find(t => t.id === selectedId)!

  return (
    <div
      data-testid="modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Choose a template</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => onSelect(template.id as TemplateId)}
              className={`rounded-lg border-2 overflow-hidden text-left transition-all ${
                selectedId === template.id
                  ? 'border-li-blue shadow-md'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              {/* PDF Thumbnail */}
              <div className="relative w-full bg-gray-50 overflow-hidden" style={{ height: 200 }}>
                <BlobProvider document={<template.component profile={profile} />}>
                  {({ blob, loading }) => {
                    if (loading || !blob) {
                      return (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-gray-300 border-t-li-blue rounded-full animate-spin" />
                        </div>
                      )
                    }
                    const url = URL.createObjectURL(blob)
                    if (!blobUrls.current.includes(url)) blobUrls.current.push(url)
                    return (
                      <iframe
                        src={url}
                        title={template.name}
                        className="absolute pointer-events-none border-0"
                        style={{
                          width: '793px', // A4 at 96dpi
                          height: '1122px',
                          transformOrigin: 'top left',
                          transform: `scale(${200 / 1122})`,
                        }}
                      />
                    )
                  }}
                </BlobProvider>
              </div>
              {/* Template name */}
              <div className={`px-3 py-2 text-sm font-medium ${selectedId === template.id ? 'text-li-blue bg-li-blue-light' : 'text-gray-700'}`}>
                {template.name}
              </div>
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={onDownloadPdf}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-li-blue text-white text-sm font-semibold rounded-full hover:bg-li-blue-dark transition-colors"
          >
            Download PDF
          </button>
          <button
            onClick={onDownloadWord}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors"
          >
            Download Word
          </button>
          <button
            onClick={onGoogleDoc}
            disabled={googleDocStatus !== 'idle'}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            {googleDocLabel(googleDocStatus, errorMsg)}
          </button>
        </div>
      </div>
    </div>
  )
}
```

**Step 4: Export `GoogleDocStatus` from `ResumeDownloadButton.tsx`** — add `export` keyword to the type declaration so `TemplatePickerModal` can import it:

```ts
// In ResumeDownloadButton.tsx, change:
type GoogleDocStatus = 'idle' | 'signing-in' | 'uploading' | 'error'
// to:
export type GoogleDocStatus = 'idle' | 'signing-in' | 'uploading' | 'error'
```

**Step 5: Run tests**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run
```
Expected: all pass.

**Step 6: Commit**

```bash
git add src/components/resume/TemplatePickerModal.tsx src/components/resume/TemplatePickerModal.test.tsx src/components/resume/ResumeDownloadButton.tsx
git commit -m "feat: add TemplatePickerModal component"
```

---

### Task 6: Wire Up ResumeDownloadButton

**Files:**
- Modify: `src/components/resume/ResumeDownloadButton.tsx`

**Step 1: Write failing test** — update existing `ResumeDownloadButton` tests or add new ones verifying modal opens on click:

Check existing test file first: `src/components/resume/ResumePDF.test.tsx` — the button tests may be in `ActionButtons.test.tsx` or similar. Add to whichever test file covers the button:

```tsx
// Add to relevant test file:
it('opens template picker modal when Download CV is clicked', () => {
  render(<ResumeDownloadButton profile={profile} variant="pill" />)
  fireEvent.click(screen.getByTestId('download-cv-trigger'))
  expect(screen.getByText('Choose a template')).toBeInTheDocument()
})
```

**Step 2: Run to verify fail.**

**Step 3: Rewrite `ResumeDownloadButton.tsx`** — replace the dropdown with modal-based flow:

```tsx
// src/components/resume/ResumeDownloadButton.tsx
import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { TemplatePickerModal } from './TemplatePickerModal'
import { TEMPLATES } from './templateRegistry'
import { getGoogleAccessToken } from '../../lib/googleAuth'
import { uploadDocxToDrive } from '../../lib/uploadToDrive'
import type { Profile } from '../../data/profileData'
import type { TemplateId } from './templateRegistry'

export type GoogleDocStatus = 'idle' | 'signing-in' | 'uploading' | 'error'

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

interface Props {
  profile: Profile
  variant: 'pill' | 'menu-item'
  onClose?: () => void
}

export function ResumeDownloadButton({ profile, variant, onClose }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<TemplateId>('classic')
  const [googleDocStatus, setGoogleDocStatus] = useState<GoogleDocStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function openModal() { setModalOpen(true) }
  function closeModal() { setModalOpen(false); onClose?.() }

  async function handleDownloadPdf() {
    const template = TEMPLATES.find(t => t.id === selectedId)!
    const blob = await pdf(<template.component profile={profile} />).toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slugify(profile.name)}-resume.pdf`
    a.click()
    URL.revokeObjectURL(url)
    closeModal()
  }

  async function handleDownloadWord() {
    const template = TEMPLATES.find(t => t.id === selectedId)!
    const blob = await template.generateDocx(profile)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slugify(profile.name)}-resume.docx`
    a.click()
    URL.revokeObjectURL(url)
    closeModal()
  }

  async function handleGoogleDoc() {
    try {
      setGoogleDocStatus('signing-in')
      const token = await getGoogleAccessToken()
      setGoogleDocStatus('uploading')
      const template = TEMPLATES.find(t => t.id === selectedId)!
      const blob = await template.generateDocx(profile)
      const docUrl = await uploadDocxToDrive(blob, `${profile.name} — Resume`, token)
      setGoogleDocStatus('idle')
      closeModal()
      window.open(docUrl, '_blank', 'noopener')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      if (msg === 'access_denied' || msg === 'popup_closed_by_user') {
        setGoogleDocStatus('idle')
        return
      }
      setErrorMsg('Upload failed — try again')
      setGoogleDocStatus('error')
      setTimeout(() => { setGoogleDocStatus('idle'); setErrorMsg('') }, 3000)
    }
  }

  const triggerClass = variant === 'pill'
    ? 'hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 border border-gray-400 text-li-text-secondary text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors'
    : 'flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full text-left'

  return (
    <>
      <button
        data-testid={variant === 'pill' ? 'download-cv-trigger' : 'download-cv-menu-item'}
        onClick={openModal}
        className={triggerClass}
      >
        {variant === 'pill' ? (
          <>
            Download CV
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
              <path d="M5 7L0.5 2.5h9L5 7z"/>
            </svg>
          </>
        ) : 'Download CV'}
      </button>

      {modalOpen && (
        <TemplatePickerModal
          profile={profile}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDownloadPdf={() => { void handleDownloadPdf() }}
          onDownloadWord={() => { void handleDownloadWord() }}
          onGoogleDoc={() => { void handleGoogleDoc() }}
          onClose={closeModal}
          googleDocStatus={googleDocStatus}
          errorMsg={errorMsg}
        />
      )}
    </>
  )
}
```

**Note:** `TemplatePickerModal` needs an `errorMsg` prop — add it to its Props interface and pass it through to `googleDocLabel`.

**Step 4: Update `TemplatePickerModal` Props** — add `errorMsg: string` to the Props interface and update the `googleDocLabel` call to use `props.errorMsg` instead of internal state. Remove internal `useState('')` for errorMsg.

**Step 5: Run all tests**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run
```
Expected: all pass. Fix any test failures from changed `data-testid` values in old tests (e.g. `download-word`, `download-google-doc` testids no longer exist — remove or update those tests).

**Step 6: Build to check for TypeScript errors**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm run build
```
Expected: no errors.

**Step 7: Commit**

```bash
git add src/components/resume/ResumeDownloadButton.tsx src/components/resume/TemplatePickerModal.tsx
git commit -m "feat: wire up template picker modal to Download CV button"
```

---

### Task 7: Final verification

**Step 1: Run full test suite**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run
```
Expected: all tests pass.

**Step 2: Run build**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm run build
```
Expected: no errors.

**Step 3: Push to deploy**

```bash
git push
```
Vercel auto-deploys in ~30s.
