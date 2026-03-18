// src/components/resume/templates/ResumePDF_Executive.test.tsx
import { vi } from 'vitest'
vi.mock('@react-pdf/renderer')

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { ResumePDF_Executive } from './ResumePDF_Executive'
import { profile } from '../../../data/profileData'

describe('ResumePDF_Executive', () => {
  it('renders without throwing', () => {
    expect(() => render(React.createElement(ResumePDF_Executive, { profile }))).not.toThrow()
  })
})
