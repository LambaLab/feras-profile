# Multi-Format Resume Download + PDF Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the single "Download CV" PDF button with a "Download CV ▾" dropdown offering three format options (PDF, Word .docx, Google Doc), and fix the name/headline overlap in the existing PDF layout.

**Architecture:** Install the `docx` npm package; create `generateDocx.ts` (pure async function that builds a `.docx` Blob from a `Profile`); rewrite `ResumeDownloadButton.tsx` to manage its own dropdown state with three download actions; update `ActionButtons.tsx` prop rename (`onClick` → `onClose`); fix one margin value in `ResumePDF.tsx`. Word and Google Doc produce identical `.docx` files — they differ only in filename.

**Tech Stack:** `docx` v9, `@react-pdf/renderer` v4 (existing), React 19, TypeScript 5, Vitest + RTL, Node via `~/.nvm/versions/node/v25.7.0/bin/`

---

## Important Context

- **Node/npm prefix:** `~/.nvm/versions/node/v25.7.0/bin/node` and `~/.nvm/versions/node/v25.7.0/bin/npm`
- **All 68 tests must pass before every commit**
- **Do NOT upgrade Tailwind to v4**
- **`vite.config.ts` imports `defineConfig` from `vitest/config`** — do not change
- The `__mocks__/@react-pdf/renderer.tsx` mock lives at the **project root** (next to `node_modules/`), not inside `src/`
- Description parsing: `description.split('\n\n')` → `[0]` = intro, rest split by `\n` = bullets

---

### Task 1: Fix PDF name/headline overlap

**Files:**
- Modify: `src/components/resume/ResumePDF.tsx` (line 23 — `name.marginBottom`)

The `name` style has `marginBottom: 3` which causes the 22pt name to visually merge into the headline below it.

**Step 1: Apply the fix**

In `src/components/resume/ResumePDF.tsx`, find:
```ts
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
```

Replace with:
```ts
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
```

**Step 2: Run tests to confirm no regression**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run 2>&1 | tail -6
```

Expected: 68 passed.

**Step 3: Commit**

```bash
git add src/components/resume/ResumePDF.tsx
git commit -m "fix: increase PDF name/headline spacing to prevent overlap"
```

---

### Task 2: Install `docx` package

**Files:**
- Modify: `package.json` (via npm install)

**Step 1: Install**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm install docx
```

Expected: `added N packages` with no errors.

**Step 2: Verify import**

```bash
~/.nvm/versions/node/v25.7.0/bin/node -e "require('./node_modules/docx')" && echo "OK"
```

Expected: `OK`

**Step 3: Run tests**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run 2>&1 | tail -6
```

Expected: 68 passed.

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install docx package for Word/Google Doc resume export"
```

---

### Task 3: Create `generateDocx.ts`

**Files:**
- Create: `src/components/resume/generateDocx.ts`

**Step 1: Create the file**

```ts
// src/components/resume/generateDocx.ts
import {
  Document,
  Paragraph,
  TextRun,
  Packer,
  BorderStyle,
} from 'docx'
import type { Profile } from '../../data/profileData'

function parseDescription(description: string): { intro: string; bullets: string[] } {
  const blocks = description.split('\n\n')
  const intro = blocks[0] ?? ''
  const bullets = blocks
    .slice(1)
    .flatMap(b => b.split('\n'))
    .filter(l => l.trim().length > 0)
  return { intro, bullets }
}

function sectionHeading(label: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: label, bold: true, size: 18, color: '0A66C2', allCaps: true }),
    ],
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: '0A66C2', space: 4 },
    },
    spacing: { before: 280, after: 100 },
  })
}

export async function generateDocxBlob(profile: Profile): Promise<Blob> {
  const children: Paragraph[] = []

  // ── Header ───────────────────────────────────────────
  children.push(
    new Paragraph({
      children: [new TextRun({ text: profile.name, bold: true, size: 44, color: '111111' })],
      spacing: { after: 80 },
    })
  )
  children.push(
    new Paragraph({
      children: [new TextRun({ text: profile.headline, size: 22, color: '555555' })],
      spacing: { after: 60 },
    })
  )
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: profile.location, size: 18, color: '888888' }),
        new TextRun({ text: '  ·  ', size: 18, color: '888888' }),
        new TextRun({ text: profile.linkedinUrl.replace('https://', ''), size: 18, color: '0A66C2' }),
        new TextRun({ text: '  ·  ', size: 18, color: '888888' }),
        new TextRun({ text: profile.email, size: 18, color: '0A66C2' }),
      ],
      spacing: { after: 200 },
    })
  )

  // ── About ────────────────────────────────────────────
  children.push(sectionHeading('About'))
  children.push(
    new Paragraph({
      children: [new TextRun({ text: profile.about, size: 19 })],
      spacing: { after: 120 },
    })
  )

  // ── Experience ───────────────────────────────────────
  children.push(sectionHeading('Experience'))
  for (const exp of profile.experience) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: exp.company, bold: true, size: 20 }),
          new TextRun({ text: `   ${exp.startDate} – ${exp.endDate}`, size: 18, color: '888888' }),
        ],
        spacing: { before: 160, after: 40 },
      })
    )
    children.push(
      new Paragraph({
        children: [new TextRun({ text: exp.title, italics: true, size: 19, color: '555555' })],
        spacing: { after: 40 },
      })
    )
    children.push(
      new Paragraph({
        children: [new TextRun({ text: exp.location, size: 17, color: '888888' })],
        spacing: { after: 80 },
      })
    )
    const { intro, bullets } = parseDescription(exp.description)
    if (intro) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: intro, size: 18 })],
          spacing: { after: 60 },
        })
      )
    }
    for (const bullet of bullets) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: bullet, size: 18 })],
          bullet: { level: 0 },
          spacing: { after: 40 },
        })
      )
    }
  }

  // ── Education ────────────────────────────────────────
  children.push(sectionHeading('Education'))
  for (const edu of profile.education) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: edu.school, bold: true, size: 20 })],
        spacing: { before: 120, after: 40 },
      })
    )
    children.push(
      new Paragraph({
        children: [new TextRun({ text: `${edu.degree}, ${edu.field}`, size: 19, color: '555555' })],
        spacing: { after: 40 },
      })
    )
    children.push(
      new Paragraph({
        children: [new TextRun({ text: `${edu.startYear} – ${edu.endYear}`, size: 17, color: '888888' })],
        spacing: { after: 80 },
      })
    )
  }

  // ── Certifications ───────────────────────────────────
  if (profile.certifications.length > 0) {
    children.push(sectionHeading('Certifications'))
    for (const cert of profile.certifications) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: cert.name, bold: true, size: 18 })],
          spacing: { before: 80, after: 20 },
        })
      )
      children.push(
        new Paragraph({
          children: [new TextRun({ text: cert.issuer, size: 17, color: '888888' })],
          spacing: { after: 60 },
        })
      )
    }
  }

  // ── Skills ───────────────────────────────────────────
  const allSkills = [
    ...profile.skills.pinned,
    ...profile.skills.hard,
    ...profile.skills.industry,
    ...profile.skills.soft,
    ...profile.skills.emerging,
  ]
  children.push(sectionHeading('Skills'))
  children.push(
    new Paragraph({
      children: [new TextRun({ text: allSkills.join(' · '), size: 18 })],
      spacing: { after: 80 },
    })
  )

  const doc = new Document({
    creator: profile.name,
    title: `${profile.name} — Resume`,
    description: 'Professional Resume',
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 900, right: 900 },
          },
        },
        children,
      },
    ],
  })

  return Packer.toBlob(doc)
}
```

**Step 2: Build check (TypeScript only)**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm run build 2>&1 | grep -E "error|Error|✓" | head -10
```

Expected: No error lines. If TypeScript errors appear about `docx` types, add `docx` to `tsconfig.app.json` includes if needed (usually not required).

**Step 3: Commit**

```bash
git add src/components/resume/generateDocx.ts
git commit -m "feat: add generateDocx utility - builds .docx blob from Profile"
```

---

### Task 4: Rewrite `ResumeDownloadButton.tsx` + update `ActionButtons.tsx`

**Files:**
- Modify: `src/components/resume/ResumeDownloadButton.tsx` (full rewrite)
- Modify: `src/components/header/ActionButtons.tsx` (rename `onClick` → `onClose` prop)

**Step 1: Replace `ResumeDownloadButton.tsx` entirely**

```tsx
// src/components/resume/ResumeDownloadButton.tsx
import { useState, useRef, useEffect } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { ResumePDF } from './ResumePDF'
import { generateDocxBlob } from './generateDocx'
import type { Profile } from '../../data/profileData'

interface ResumeDownloadButtonProps {
  profile: Profile
  /** 'pill' = desktop dropdown pill; 'menu-item' = flat items for parent dropdown */
  variant: 'pill' | 'menu-item'
  /** Called after any download action (to close a parent dropdown if needed) */
  onClose?: () => void
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function triggerDocxDownload(profile: Profile, suffix: string) {
  const blob = await generateDocxBlob(profile)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${slugify(profile.name)}-${suffix}.docx`
  a.click()
  URL.revokeObjectURL(url)
}

export function ResumeDownloadButton({ profile, variant, onClose }: ResumeDownloadButtonProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pdfFileName = `${slugify(profile.name)}-resume.pdf`

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  if (variant === 'menu-item') {
    // Mobile: render three flat items directly into the parent ··· dropdown
    return (
      <>
        <PDFDownloadLink
          document={<ResumePDF profile={profile} />}
          fileName={pdfFileName}
          onClick={onClose}
        >
          {({ loading }) => (
            <span className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full cursor-pointer">
              {loading ? 'Building PDF…' : 'Download PDF'}
            </span>
          )}
        </PDFDownloadLink>
        <button
          data-testid="download-word"
          onClick={() => { triggerDocxDownload(profile, 'resume'); onClose?.() }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full text-left"
        >
          Download Word
        </button>
        <button
          data-testid="download-google-doc"
          onClick={() => { triggerDocxDownload(profile, 'google-doc'); onClose?.() }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full text-left"
        >
          Google Doc
        </button>
      </>
    )
  }

  // Desktop: "Download CV ▾" pill that opens its own dropdown
  return (
    <div className="hidden sm:block relative" ref={ref} data-testid="download-cv-wrapper">
      <button
        data-testid="download-cv-trigger"
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-gray-400 text-li-text-secondary text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors"
      >
        Download CV
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
          <path d="M5 7L0.5 2.5h9L5 7z"/>
        </svg>
      </button>

      {open && (
        <div
          data-testid="download-cv-menu"
          className="absolute left-0 top-10 w-44 bg-white rounded-lg shadow-lg border border-li-border z-20 py-1"
        >
          <PDFDownloadLink
            document={<ResumePDF profile={profile} />}
            fileName={pdfFileName}
            onClick={() => setOpen(false)}
          >
            {({ loading }) => (
              <span className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full cursor-pointer">
                {loading ? 'Building…' : 'PDF'}
              </span>
            )}
          </PDFDownloadLink>
          <button
            data-testid="download-word-desktop"
            onClick={() => { triggerDocxDownload(profile, 'resume'); setOpen(false) }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full text-left"
          >
            Word (.docx)
          </button>
          <button
            data-testid="download-google-doc-desktop"
            onClick={() => { triggerDocxDownload(profile, 'google-doc'); setOpen(false) }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-li-text hover:bg-gray-50 w-full text-left"
          >
            Google Doc
          </button>
        </div>
      )}
    </div>
  )
}
```

**Step 2: Update `ActionButtons.tsx` — rename `onClick` → `onClose`**

In `src/components/header/ActionButtons.tsx`, find the `menu-item` usage:

```tsx
              <ResumeDownloadButton
                profile={profile}
                variant="menu-item"
                onClick={() => setMenuOpen(false)}
              />
```

Replace with:

```tsx
              <ResumeDownloadButton
                profile={profile}
                variant="menu-item"
                onClose={() => setMenuOpen(false)}
              />
```

**Step 3: Build check**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm run build 2>&1 | tail -10
```

Expected: clean build. Fix any TypeScript errors before continuing.

**Step 4: Commit**

```bash
git add src/components/resume/ResumeDownloadButton.tsx src/components/header/ActionButtons.tsx
git commit -m "feat: multi-format Download CV dropdown - PDF, Word, Google Doc"
```

---

### Task 5: Update tests + add mock for `docx`

**Files:**
- Create: `__mocks__/docx.ts` (project root, next to `node_modules/`)
- Modify: `src/components/header/ActionButtons.test.tsx`
- Modify: `src/components/resume/ResumePDF.test.tsx` (no change needed if it already works)

**Step 1: Create `__mocks__/docx.ts`**

The `docx` package uses class-based APIs. Mock it to be test-safe:

```ts
// __mocks__/docx.ts
export class Document {
  constructor(_opts: unknown) {}
}
export class Paragraph {
  constructor(_opts: unknown) {}
}
export class TextRun {
  constructor(_opts: unknown) {}
}
export class Packer {
  static toBlob(_doc: unknown): Promise<Blob> {
    return Promise.resolve(new Blob(['mock-docx'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }))
  }
}
export const BorderStyle = { SINGLE: 'single' }
```

**Step 2: Update `src/components/header/ActionButtons.test.tsx`**

Add `vi.mock('docx')` at the top (after the existing `vi.mock('@react-pdf/renderer')`), and add tests for the new format options.

Read the file first, then update it so it looks like this:

```tsx
// src/components/header/ActionButtons.test.tsx
import { vi } from 'vitest'
vi.mock('@react-pdf/renderer')
vi.mock('docx')

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('renders Download CV trigger button', () => {
    render(<ActionButtons {...defaultProps} />)
    expect(screen.getByTestId('download-cv-trigger')).toBeInTheDocument()
    expect(screen.getByTestId('download-cv-trigger')).toHaveTextContent('Download CV')
  })

  it('opens download format menu on click', async () => {
    render(<ActionButtons {...defaultProps} />)
    const trigger = screen.getByTestId('download-cv-trigger')
    await userEvent.click(trigger)
    expect(screen.getByTestId('download-cv-menu')).toBeInTheDocument()
    expect(screen.getByTestId('download-word-desktop')).toBeInTheDocument()
    expect(screen.getByTestId('download-google-doc-desktop')).toBeInTheDocument()
  })
})
```

**Note:** `@testing-library/user-event` is already installed (check `package.json` — if not present, run `npm install --save-dev @testing-library/user-event`).

**Step 3: Run all tests**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run 2>&1
```

If tests fail:
- "Cannot find module 'docx'" → the mock isn't being picked up; double-check `__mocks__/docx.ts` is at project root (same level as `node_modules/`)
- "Cannot find module '@testing-library/user-event'" → install it: `~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm install --save-dev @testing-library/user-event`
- TypeScript errors in mocks → adjust the mock signatures to match what the real package exports

Fix all failures before committing.

**Step 4: Commit**

```bash
git add __mocks__/docx.ts src/components/header/ActionButtons.test.tsx
git commit -m "test: add docx mock and update ActionButtons tests for multi-format download"
```

---

### Task 6: Final build + push

**Step 1: Run all tests**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run 2>&1 | tail -6
```

Expected: all tests pass (68+ — exact count depends on how many tests were added/modified).

**Step 2: Production build**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm run build 2>&1 | tail -10
```

Expected: exits 0. Large chunk-size warnings for react-pdf and docx are normal — ignore them. Any `error` lines mean stop and fix.

**Step 3: Push**

```bash
git push origin main
```

**Step 4: Verify live**

Visit https://feras-profile.vercel.app/ after ~30s. Click "Download CV ▾" and confirm the dropdown shows PDF, Word (.docx), and Google Doc options.
