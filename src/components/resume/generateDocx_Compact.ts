// src/components/resume/generateDocx_Compact.ts
import { Document, Paragraph, TextRun, Packer, BorderStyle } from 'docx'
import type { Profile } from '../../data/profileData'
import { parseDescription } from './templates/resumeUtils'

function sectionHeading(label: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: label, bold: true, size: 16, color: '374151', allCaps: true })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '9CA3AF', space: 3 } },
    spacing: { before: 200, after: 80 },
  })
}

export async function generateDocxBlob_Compact(profile: Profile): Promise<Blob> {
  const children: Paragraph[] = []

  children.push(new Paragraph({ children: [new TextRun({ text: profile.name, bold: true, size: 42, color: '111111' })], spacing: { after: 60 } }))
  children.push(new Paragraph({ children: [new TextRun({ text: profile.headline, size: 20, color: '555555' })], spacing: { after: 40 } }))
  children.push(new Paragraph({
    children: [
      new TextRun({ text: profile.location, size: 16, color: '888888' }),
      new TextRun({ text: '  ·  ', size: 16, color: '888888' }),
      new TextRun({ text: profile.linkedinUrl.replace('https://', ''), size: 16, color: '374151' }),
      new TextRun({ text: '  ·  ', size: 16, color: '888888' }),
      new TextRun({ text: profile.email, size: 16, color: '374151' }),
    ],
    spacing: { after: 140 },
  }))

  children.push(sectionHeading('About'))
  children.push(new Paragraph({ children: [new TextRun({ text: profile.about, size: 17 })], spacing: { after: 80 } }))

  children.push(sectionHeading('Experience'))
  for (const exp of profile.experience) {
    children.push(new Paragraph({ children: [new TextRun({ text: exp.company, bold: true, size: 18 }), new TextRun({ text: `   ${exp.startDate} – ${exp.endDate}`, size: 16, color: '888888' })], spacing: { before: 110, after: 28 } }))
    children.push(new Paragraph({ children: [new TextRun({ text: exp.title, italics: true, size: 17, color: '555555' })], spacing: { after: 28 } }))
    children.push(new Paragraph({ children: [new TextRun({ text: exp.location, size: 15, color: '888888' })], spacing: { after: 56 } }))
    const { intro, bullets } = parseDescription(exp.description)
    if (intro) children.push(new Paragraph({ children: [new TextRun({ text: intro, size: 16 })], spacing: { after: 42 } }))
    for (const bullet of bullets) children.push(new Paragraph({ children: [new TextRun({ text: bullet, size: 16 })], bullet: { level: 0 }, spacing: { after: 28 } }))
  }

  children.push(sectionHeading('Education'))
  for (const edu of profile.education) {
    children.push(new Paragraph({ children: [new TextRun({ text: edu.school, bold: true, size: 18 })], spacing: { before: 84, after: 28 } }))
    children.push(new Paragraph({ children: [new TextRun({ text: `${edu.degree}, ${edu.field}`, size: 17, color: '555555' })], spacing: { after: 28 } }))
    children.push(new Paragraph({ children: [new TextRun({ text: `${edu.startYear} – ${edu.endYear}`, size: 15, color: '888888' })], spacing: { after: 56 } }))
  }

  if (profile.certifications.length > 0) {
    children.push(sectionHeading('Certifications'))
    for (const cert of profile.certifications) {
      children.push(new Paragraph({ children: [new TextRun({ text: cert.name, bold: true, size: 16 })], spacing: { before: 56, after: 14 } }))
      children.push(new Paragraph({ children: [new TextRun({ text: cert.issuer, size: 15, color: '888888' })], spacing: { after: 42 } }))
    }
  }

  const allSkills = [...profile.skills.pinned, ...profile.skills.hard, ...profile.skills.industry, ...profile.skills.soft, ...profile.skills.emerging]
  children.push(sectionHeading('Skills'))
  children.push(new Paragraph({ children: [new TextRun({ text: allSkills.join(' · '), size: 16 })], spacing: { after: 56 } }))

  const doc = new Document({
    creator: profile.name, title: `${profile.name} — Resume`, description: 'Professional Resume',
    sections: [{ properties: { page: { margin: { top: 560, bottom: 560, left: 720, right: 720 } } }, children }],
  })
  return Packer.toBlob(doc)
}
