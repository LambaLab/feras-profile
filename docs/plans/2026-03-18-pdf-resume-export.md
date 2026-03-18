# PDF Resume Export Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Download CV" button to the profile action bar that generates and downloads an elegant, ATS-friendly single-column PDF resume from the currently active profile (general or Humain variant).

**Architecture:** Install `@react-pdf/renderer` and create a `ResumePDF` component (PDF layout using `Document`/`Page`/`View`/`Text` primitives) plus a `ResumeDownloadButton` wrapper around `PDFDownloadLink`. Update `ActionButtons` to accept and thread the full `profile` prop, rendering the download button inline on desktop and inside the `···` dropdown on mobile. `App.tsx` passes `profile` to `ActionButtons` — one-line change.

**Tech Stack:** `@react-pdf/renderer` v4, React 19, TypeScript 5, Vitest + React Testing Library, Node via `~/.nvm/versions/node/v25.7.0/bin/node`

---

## Important Context

- **Node path:** always prefix `node`/`npm` with `~/.nvm/versions/node/v25.7.0/bin/`
- **All 62 tests must pass** before every commit — run `~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run`
- **Do NOT upgrade Tailwind to v4**
- **`vite.config.ts` imports `defineConfig` from `vitest/config`** (not `vite`) — do not change this
- Description parsing pattern: `description.split('\n\n')` → index 0 = intro paragraph, remaining items split by `\n` = bullet lines
- `ProfileCard.tsx` already renders above `ActionButtons` in `App.tsx` — no changes to `ProfileCard`

---

### Task 1: Install `@react-pdf/renderer`

**Files:**
- Modify: `package.json` (via npm install)

**Step 1: Install the package**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm install @react-pdf/renderer
```

Expected: `added N packages` with no errors.

**Step 2: Verify the import works**

```bash
~/.nvm/versions/node/v25.7.0/bin/node -e "require('./node_modules/@react-pdf/renderer')" && echo "OK"
```

Expected: `OK`

**Step 3: Run existing tests to confirm nothing broke**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run
```

Expected: `62 passed`

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @react-pdf/renderer for PDF resume export"
```

---

### Task 2: Create `ResumePDF` component

**Files:**
- Create: `src/components/resume/ResumePDF.tsx`

This component takes a `Profile` and returns a `@react-pdf/renderer` `Document`. It does NOT render to the DOM — it's consumed by `PDFDownloadLink`.

**Step 1: Create the file**

```tsx
// src/components/resume/ResumePDF.tsx
import { Document, Page, View, Text, Link, StyleSheet } from '@react-pdf/renderer'
import type { Profile } from '../../data/profileData'

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
  // ── Header ──────────────────────────────────────────────
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
  },
  headline: {
    fontSize: 11,
    color: GRAY,
    marginBottom: 4,
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
  // ── Section ─────────────────────────────────────────────
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
  // ── About ───────────────────────────────────────────────
  aboutText: {
    fontSize: 9.5,
    color: BLACK,
    lineHeight: 1.5,
  },
  // ── Experience ──────────────────────────────────────────
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
  // ── Education ───────────────────────────────────────────
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
  // ── Skills ──────────────────────────────────────────────
  skillsText: {
    fontSize: 9,
    color: BLACK,
    lineHeight: 1.5,
  },
  // ── Certs ───────────────────────────────────────────────
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

interface ResumePDFProps {
  profile: Profile
}

export function ResumePDF({ profile }: ResumePDFProps) {
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
```

**Step 2: No test yet — move on to Task 3 (button), then test both together in Task 4**

---

### Task 3: Create `ResumeDownloadButton` component

**Files:**
- Create: `src/components/resume/ResumeDownloadButton.tsx`

This wraps `PDFDownloadLink` from `@react-pdf/renderer` and renders a styled button/link.

**Step 1: Create the file**

```tsx
// src/components/resume/ResumeDownloadButton.tsx
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ResumePDF } from './ResumePDF'
import type { Profile } from '../../data/profileData'

interface ResumeDownloadButtonProps {
  profile: Profile
  /** 'pill' = full LinkedIn-style pill button (desktop), 'menu-item' = plain text link (dropdown) */
  variant: 'pill' | 'menu-item'
  onClick?: () => void
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function ResumeDownloadButton({ profile, variant, onClick }: ResumeDownloadButtonProps) {
  const fileName = `${slugify(profile.name)}-resume.pdf`

  return (
    <PDFDownloadLink
      document={<ResumePDF profile={profile} />}
      fileName={fileName}
      onClick={onClick}
    >
      {({ loading }) =>
        variant === 'pill' ? (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 border border-gray-400 text-li-text-secondary text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors cursor-pointer">
            {loading ? 'Building…' : 'Download CV'}
          </span>
        ) : (
          <span className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full cursor-pointer">
            {loading ? 'Building…' : 'Download CV'}
          </span>
        )
      }
    </PDFDownloadLink>
  )
}
```

---

### Task 4: Update `ActionButtons` to accept `profile` and render the button

**Files:**
- Modify: `src/components/header/ActionButtons.tsx`

**Step 1: Update props interface and add `ResumeDownloadButton`**

Replace the entire file content:

```tsx
// src/components/header/ActionButtons.tsx
import { useState, useRef, useEffect } from 'react'
import type { Profile } from '../../data/profileData'
import { ResumeDownloadButton } from '../resume/ResumeDownloadButton'

interface ActionButtonsProps {
  linkedinUrl: string
  email: string
  profile: Profile
}

export function ActionButtons({ linkedinUrl, email, profile }: ActionButtonsProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center gap-2">
        {/* Primary — Connect */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-4 py-1.5 bg-li-blue text-white text-sm font-semibold rounded-full hover:bg-li-blue-dark transition-colors"
        >
          Connect
        </a>

        {/* Secondary — Message (desktop only) */}
        {email && (
          <a
            href={`mailto:${email}`}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 border border-li-blue text-li-blue text-sm font-semibold rounded-full hover:bg-li-blue-light transition-colors"
          >
            Message
          </a>
        )}

        {/* Download CV pill — desktop only */}
        <ResumeDownloadButton profile={profile} variant="pill" />

        {/* More ··· — pill on desktop, circle on mobile */}
        <div className="relative" ref={menuRef}>
          <button
            aria-label="More options"
            onClick={() => setMenuOpen(o => !o)}
            className="inline-flex items-center justify-center gap-1 sm:px-4 sm:py-1.5 w-9 h-9 sm:w-auto sm:h-auto border border-gray-400 text-li-text-secondary text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors"
          >
            <span className="hidden sm:inline">More</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 8a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm4.5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm4.5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"/>
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute left-0 sm:left-auto sm:right-0 top-11 w-52 bg-white rounded-lg shadow-lg border border-li-border z-20 py-1">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  Message
                </a>
              )}
              {/* Download CV — mobile (inside dropdown) */}
              <ResumeDownloadButton
                profile={profile}
                variant="menu-item"
                onClick={() => setMenuOpen(false)}
              />
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                View on LinkedIn
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

### Task 5: Thread `profile` prop through `App.tsx`

**Files:**
- Modify: `src/App.tsx` (line 46)

**Step 1: Add `profile` prop to `ActionButtons` call**

Find this line in `App.tsx`:
```tsx
<ActionButtons linkedinUrl={profile.linkedinUrl} email={profile.email} />
```

Replace with:
```tsx
<ActionButtons linkedinUrl={profile.linkedinUrl} email={profile.email} profile={profile} />
```

That's the only change needed in `App.tsx`.

---

### Task 6: Write tests and verify all pass

**Files:**
- Create: `src/components/resume/ResumePDF.test.tsx`
- Modify: `src/components/header/ActionButtons.test.tsx`

**Step 1: Mock `@react-pdf/renderer` in the test environment**

`@react-pdf/renderer` uses browser/canvas APIs not available in jsdom. Create a manual mock:

Create file `src/__mocks__/@react-pdf/renderer.tsx`:

```tsx
// src/__mocks__/@react-pdf/renderer.tsx
import React from 'react'

export const Document = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const Page = ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-page">{children}</div>
export const View = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const Text = ({ children }: { children: React.ReactNode }) => <span>{children}</span>
export const Link = ({ children }: { children: React.ReactNode }) => <a>{children}</a>
export const StyleSheet = { create: (s: object) => s }
export const PDFDownloadLink = ({
  children,
  fileName,
}: {
  document: React.ReactNode
  fileName: string
  children: (opts: { loading: boolean }) => React.ReactNode
  onClick?: () => void
}) => (
  <a href="#" download={fileName} data-testid="pdf-download-link">
    {children({ loading: false })}
  </a>
)
```

**Step 2: Configure Vitest to use the mock**

Open `vite.config.ts` and add `__mocks__` directory resolution. Actually, Vitest auto-resolves `src/__mocks__` when you call `vi.mock('@react-pdf/renderer')` in a test. No config change needed.

**Step 3: Create `ResumePDF.test.tsx`**

```tsx
// src/components/resume/ResumePDF.test.tsx
import { vi } from 'vitest'
vi.mock('@react-pdf/renderer')

import { render, screen } from '@testing-library/react'
import { ResumePDF } from './ResumePDF'
import { profile } from '../../data/profileData'

describe('ResumePDF', () => {
  it('renders without crashing', () => {
    render(<ResumePDF profile={profile} />)
    expect(screen.getByTestId('pdf-page')).toBeInTheDocument()
  })

  it('includes the profile name', () => {
    render(<ResumePDF profile={profile} />)
    expect(screen.getByText(profile.name)).toBeInTheDocument()
  })

  it('includes the about text', () => {
    render(<ResumePDF profile={profile} />)
    // about is long — just check it's present by first 30 chars
    expect(screen.getByText(profile.about)).toBeInTheDocument()
  })

  it('renders all experience company names', () => {
    render(<ResumePDF profile={profile} />)
    for (const exp of profile.experience) {
      expect(screen.getByText(exp.company)).toBeInTheDocument()
    }
  })
})
```

**Step 4: Create/update `ActionButtons.test.tsx` to check the Download CV button exists**

Open `src/components/header/ActionButtons.test.tsx`. If a test file already exists, add the following test. If not, create it:

```tsx
// src/components/header/ActionButtons.test.tsx
import { vi } from 'vitest'
vi.mock('@react-pdf/renderer')

import { render, screen } from '@testing-library/react'
import { ActionButtons } from './ActionButtons'
import { profile } from '../../data/profileData'

describe('ActionButtons', () => {
  const defaultProps = {
    linkedinUrl: profile.linkedinUrl,
    email: profile.email,
    profile,
  }

  it('renders Connect button', () => {
    render(<ActionButtons {...defaultProps} />)
    expect(screen.getByText('Connect')).toBeInTheDocument()
  })

  it('renders Download CV link', () => {
    render(<ActionButtons {...defaultProps} />)
    expect(screen.getByTestId('pdf-download-link')).toBeInTheDocument()
  })

  it('download link has correct filename', () => {
    render(<ActionButtons {...defaultProps} />)
    const link = screen.getByTestId('pdf-download-link')
    expect(link).toHaveAttribute('download', 'feras-h-al-bader-resume.pdf')
  })
})
```

**Step 5: Run all tests**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run
```

Expected: all tests pass (was 62, now ~68 or more with new tests).

**Step 6: If any test fails, fix it before proceeding.**

---

### Task 7: Build check + commit + push

**Step 1: Run a production build to catch TypeScript errors**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm run build
```

Expected: `dist/` created with no errors.

**Step 2: Run tests one final time**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run
```

Expected: all tests pass.

**Step 3: Commit everything**

```bash
git add \
  src/components/resume/ResumePDF.tsx \
  src/components/resume/ResumeDownloadButton.tsx \
  src/components/resume/ResumePDF.test.tsx \
  src/__mocks__/@react-pdf/renderer.tsx \
  src/components/header/ActionButtons.tsx \
  src/components/header/ActionButtons.test.tsx \
  src/App.tsx \
  package.json package-lock.json

git commit -m "feat: add Download CV button with elegant PDF resume export

- Install @react-pdf/renderer
- ResumePDF: modern minimal A4 layout (name, about, experience, education, certifications, skills)
- ResumeDownloadButton: pill variant (desktop) + menu-item variant (mobile dropdown)
- ActionButtons: threads full profile prop, shows Download CV button
- App.tsx: passes profile to ActionButtons
- Tests: mock @react-pdf/renderer, verify render + filename"
```

**Step 4: Push to trigger Vercel deploy**

```bash
git push origin main
```

Expected: Vercel deploys in ~30s. Visit https://feras-profile.vercel.app/ and confirm "Download CV" appears in the action bar.
