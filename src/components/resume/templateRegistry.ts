// src/components/resume/templateRegistry.ts
import { ResumePDF_Classic } from './templates/ResumePDF_Classic'
import { ResumePDF_Executive } from './templates/ResumePDF_Executive'
import { ResumePDF_Modern } from './templates/ResumePDF_Modern'
import { generateDocxBlob } from './generateDocx'
import { generateDocxBlob_Executive } from './generateDocx_Executive'
import { generateDocxBlob_Modern } from './generateDocx_Modern'
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
  { id: 'executive', name: 'Executive', component: ResumePDF_Executive, generateDocx: generateDocxBlob_Executive },
  { id: 'modern', name: 'Modern', component: ResumePDF_Modern, generateDocx: generateDocxBlob_Modern },
  { id: 'compact', name: 'Compact', component: ResumePDF_Classic, generateDocx: generateDocxBlob },
  { id: 'minimal', name: 'Minimal', component: ResumePDF_Classic, generateDocx: generateDocxBlob },
]

export type TemplateId = 'classic' | 'executive' | 'modern' | 'compact' | 'minimal'
