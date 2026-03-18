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
