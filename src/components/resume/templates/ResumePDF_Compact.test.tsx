// src/components/resume/templates/ResumePDF_Compact.test.tsx
import { vi } from 'vitest'
vi.mock('@react-pdf/renderer')

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { ResumePDF_Compact } from './ResumePDF_Compact'
import { profile } from '../../../data/profileData'

describe('ResumePDF_Compact', () => {
  it('renders without throwing', () => {
    expect(() => render(React.createElement(ResumePDF_Compact, { profile }))).not.toThrow()
  })
})
