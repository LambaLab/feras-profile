// src/components/resume/templates/resumeUtils.ts
export function parseDescription(description: string): { intro: string; bullets: string[] } {
  const blocks = description.split('\n\n')
  const intro = blocks[0] ?? ''
  const bullets = blocks
    .slice(1)
    .flatMap(b => b.split('\n'))
    .filter(line => line.trim().length > 0)
  return { intro, bullets }
}
