// src/components/resume/templates/ResumePDF_Modern.test.tsx
import { vi } from 'vitest'
vi.mock('@react-pdf/renderer')

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { ResumePDF_Modern } from './ResumePDF_Modern'
import { profile } from '../../../data/profileData'

describe('ResumePDF_Modern', () => {
  it('renders without throwing', () => {
    expect(() => render(React.createElement(ResumePDF_Modern, { profile }))).not.toThrow()
  })
})
