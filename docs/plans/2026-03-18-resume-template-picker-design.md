# Resume Template Picker — Design

## Goal

Add a template picker modal so viewers can choose from 5 professional CV styles before downloading as PDF, Word, or Google Doc.

## Architecture

Template registry pattern — each template is a self-contained PDF component + DOCX generator, registered in a shared `TEMPLATES` array. The "Download CV" button opens a modal gallery instead of a dropdown. The selected template is held in `useState` at the `ResumeDownloadButton` level and persists for the session.

## Templates

| ID | Name | Layout | Accent Color | Vibe |
|----|------|---------|-------------|------|
| `classic` | Classic | Single column (current style) | LinkedIn blue `#0A66C2` | Clean, familiar |
| `executive` | Executive | Single column, full-width navy header bar | Deep navy `#1B2A4A` | Senior, authoritative |
| `modern` | Modern | Two-column — narrow left sidebar (contact + skills), wide right main | Teal `#0D7377` | Contemporary, structured |
| `compact` | Compact | Single column, tighter spacing, smaller fonts | Slate grey `#374151` | Dense, information-rich |
| `minimal` | Minimal | Single column, black-only typography, thin rule dividers, no color | Pure black `#111111` | Elegant, timeless |

## Modal UX

- Clicking "Download CV" (desktop pill or mobile `···` menu) opens a full-screen modal with dark overlay
- Grid of 5 template cards (2–3 columns responsive)
- Each card: live PDF thumbnail (scaled `<iframe>` via `BlobProvider`) + template name + selected-ring highlight
- Thumbnails load progressively — spinner placeholder per card until blob resolves
- Below grid: three action buttons — **Download PDF**, **Download Word**, **Open as Google Doc**
- Selected template persists in session state; resets on page refresh

## File Structure

### New files
- `src/components/resume/templates/ResumePDF_Classic.tsx` — current `ResumePDF.tsx` moved + renamed
- `src/components/resume/templates/ResumePDF_Executive.tsx`
- `src/components/resume/templates/ResumePDF_Modern.tsx`
- `src/components/resume/templates/ResumePDF_Compact.tsx`
- `src/components/resume/templates/ResumePDF_Minimal.tsx`
- `src/components/resume/templateRegistry.ts` — `TEMPLATES` array + `TemplateId` type
- `src/components/resume/TemplatePickerModal.tsx` — modal component
- `src/components/resume/generateDocx_Executive.ts`
- `src/components/resume/generateDocx_Modern.ts`
- `src/components/resume/generateDocx_Compact.ts`
- `src/components/resume/generateDocx_Minimal.ts`

### Modified files
- `src/components/resume/ResumePDF.tsx` — re-exports from Classic template (preserves existing tests)
- `src/components/resume/ResumeDownloadButton.tsx` — opens modal on click, holds `selectedTemplate` state
- `src/components/header/ActionButtons.tsx` — no changes needed (ResumeDownloadButton is self-contained)

## Data Flow

```
Click "Download CV"
  → open TemplatePickerModal
    → BlobProvider renders PDF blob per template
    → iframe thumbnails display progressively
  → user selects template (ring highlight)
  → user clicks Download PDF / Word / Google Doc
    → templateRegistry[selectedId].component → PDFDownloadLink
    → templateRegistry[selectedId].generateDocx → triggerDocxDownload / uploadDocxToDrive
  → modal closes
```

## Template Design Details

### Executive
- Full-width dark navy (`#1B2A4A`) header block containing name (white, large) + headline (light blue) + meta row
- Section labels in navy with thin grey rule
- Otherwise same single-column structure as Classic

### Modern
- Left sidebar (~28% width): name, contact info, skills pills
- Right main area (~72%): About, Experience, Education, Certifications
- Teal accent on sidebar background (`#E8F4F4`) with teal section labels
- Uses `@react-pdf/renderer` `View` flex-row at page level

### Compact
- Same structure as Classic but: `fontSize` reduced by ~1pt everywhere, `marginBottom`/`spacing` reduced by 30%, fits more experience entries on page 1
- Slate grey section labels instead of blue

### Minimal
- No color — pure black/grey palette
- Section labels: small caps, black, with thin `#CCCCCC` rule
- No colored bullets — em-dash (`—`) instead of blue dot

## Testing

- Existing `ResumePDF.test.tsx` imports from `ResumePDF.tsx` (re-export) — no changes needed
- New: snapshot/smoke test per template component (renders without throwing)
- New: `templateRegistry.test.ts` — all 5 templates have required fields (id, name, component, generateDocx)
- DOCX generators: smoke test each produces a non-empty Blob

## Tech Notes

- `BlobProvider` from `@react-pdf/renderer` — already a dependency, no new packages
- Thumbnail iframe: `src={URL.createObjectURL(blob)}`, CSS `transform: scale(0.25)` with fixed container, `pointer-events: none`
- Revoke object URLs on modal close to avoid memory leaks
- `generateDocx.ts` (Classic) unchanged — registry points to it directly
