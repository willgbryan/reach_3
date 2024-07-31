import type { NextApiRequest, NextApiResponse } from 'next'

import { getFileText } from '@/lib/file'

type Doc = {
  pageContent: string
  metadata?: any
}

type ApiResponse = {
  message?: string | object
  chunks?: Doc[]
  fileText?: string
  error?: string
  fileName?: string
}

// Handler function with proper types
export async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const file = await getFileText(req)

    res.status(200).json({
      fileText: file.fileText,
      fileName: file.fileName,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    res.status(500).json({
      error: `Error creating guide for ${errorMessage}`,
    })
  }
}

// Disable bodyParser to handle file upload
export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
