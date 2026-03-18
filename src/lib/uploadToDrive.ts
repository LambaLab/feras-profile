// src/lib/uploadToDrive.ts

export async function uploadDocxToDrive(
  blob: Blob,
  fileName: string,
  accessToken: string
): Promise<string> {
  const metadata = {
    name: fileName,
    mimeType: 'application/vnd.google-apps.document',
  }

  const form = new FormData()
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  )
  form.append('file', blob)

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    }
  )

  if (!response.ok) {
    throw new Error(`Drive upload failed: ${response.status}`)
  }

  const { id } = await response.json() as { id: string }
  return `https://docs.google.com/document/d/${id}/edit`
}
