// src/components/resume/templates/ResumePDF_Minimal.test.tsx
import { vi } from 'vitest'
vi.mock('@react-pdf/renderer')

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { ResumePDF_Minimal } from './ResumePDF_Minimal'
import { profile } from '../../../data/profileData'

describe('ResumePDF_Minimal', () => {
  it('renders without throwing', () => {
    expect(() => render(React.createElement(ResumePDF_Minimal, { profile }))).not.toThrow()
  })
})
