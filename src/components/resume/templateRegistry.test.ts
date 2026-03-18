import { describe, it, expect } from 'vitest'
import { TEMPLATES } from './templateRegistry'

describe('templateRegistry', () => {
  it('has 5 templates', () => {
    expect(TEMPLATES).toHaveLength(5)
  })

  it('each template has required fields', () => {
    for (const t of TEMPLATES) {
      expect(t.id).toBeTruthy()
      expect(t.name).toBeTruthy()
      expect(t.component).toBeTruthy()
      expect(t.generateDocx).toBeTruthy()
    }
  })

  it('first template is classic', () => {
    expect(TEMPLATES[0].id).toBe('classic')
  })
})
