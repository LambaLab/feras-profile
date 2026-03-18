// src/__mocks__/@react-pdf/renderer.tsx
import React from 'react'

export const Document = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const Page = ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-page">{children}</div>
export const View = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const Text = ({ children }: { children: React.ReactNode }) => <span>{children}</span>
export const Link = ({ children }: { children: React.ReactNode }) => <a>{children}</a>
export const StyleSheet = { create: (s: object) => s }
export const PDFDownloadLink = ({
  children,
  fileName,
}: {
  document: React.ReactNode
  fileName: string
  children: (opts: { loading: boolean }) => React.ReactNode
  onClick?: () => void
}) => (
  <a href="#" download={fileName} data-testid="pdf-download-link">
    {children({ loading: false })}
  </a>
)

export const BlobProvider = ({
  children,
}: {
  document: React.ReactNode
  children: (opts: { blob: null; loading: boolean; url: null; error: null }) => React.ReactNode
}) => <>{children({ blob: null, loading: true, url: null, error: null })}</>

export const pdf = () => ({
  toBlob: () => Promise.resolve(new Blob()),
})
