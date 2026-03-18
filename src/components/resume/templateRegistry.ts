// src/components/resume/templateRegistry.ts
import { ResumePDF_Classic } from './templates/ResumePDF_Classic'
import { ResumePDF_Executive } from './templates/ResumePDF_Executive'
import { ResumePDF_Modern } from './templates/ResumePDF_Modern'
import { ResumePDF_Compact } from './templates/ResumePDF_Compact'
import { ResumePDF_Minimal } from './templates/ResumePDF_Minimal'
import { generateDocxBlob } from './generateDocx'
import { generateDocxBlob_Executive } from './generateDocx_Executive'
import { generateDocxBlob_Modern } from './generateDocx_Modern'
import { generateDocxBlob_Compact } from './generateDocx_Compact'
import { generateDocxBlob_Minimal } from './generateDocx_Minimal'
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
  { id: 'executive', name: 'Executive', component: ResumePDF_Executive, generateDocx: generateDocxBlob_Executive },
  { id: 'modern', name: 'Modern', component: ResumePDF_Modern, generateDocx: generateDocxBlob_Modern },
  { id: 'compact', name: 'Compact', component: ResumePDF_Compact, generateDocx: generateDocxBlob_Compact },
  { id: 'minimal', name: 'Minimal', component: ResumePDF_Minimal, generateDocx: generateDocxBlob_Minimal },
]

export type TemplateId = 'classic' | 'executive' | 'modern' | 'compact' | 'minimal'
