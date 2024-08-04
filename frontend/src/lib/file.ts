import { Writable } from 'stream'
import type { NextApiRequest } from 'next'
import formidable from 'formidable'
import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import mammoth from 'mammoth'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import pdfParse from 'pdf-parse'

const formidableConfig = {
  keepExtensions: true,
  maxFileSize: 20_000_000,
  maxFieldsSize: 30_000_000,
  maxFields: 7,
  allowEmptyFiles: false,
  multiples: false,
}

export const getTextContentFromPDF = async (pdfBuffer) => {
  // TODO: pass metadata
  const { text, metadata } = await pdfParse(pdfBuffer)
  return text
}

export const formidablePromise = (
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0],
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((accept, reject) => {
    const form = formidable(opts)

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      return accept({ fields, files })
    })
  })
}

export const fileConsumer = <T = unknown>(acc: T[]) => {
  const writable = new Writable({
    write: (chunk, _enc, next) => {
      acc.push(chunk)
      next()
    },
  })

  return writable
}

const convertFileToString = async (file: formidable.File, chunks) => {
  const fileData = Buffer.concat(chunks)

  let fileText = ''
  let docs

  switch (file.mimetype) {
    case 'application/pdf':
      fileText = await getTextContentFromPDF(fileData)
      break
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': // i.e. docx file
      const docxResult = await mammoth.extractRawText({
        buffer: fileData,
      })
      fileText = docxResult.value
      break
    // case "application/vnd.openxmlformats-officedocument.presentationml.presentation": // i.e. pptx file
    //   const pptResult = await extractTextFromPPTX(file.filepath)
    //   console.log(pptResult)
    //   fileText = pptResult.toString()
    //   break
    case 'application/octet-stream':
      fileText = fileData.toString()
      break
    case 'application/json':
      fileText = await fileData.toString()
      break
    case 'text/markdown':
      fileText = await fileData.toString()
      break
    case 'text/csv':
      break
    case 'image/jpeg':
      // fileText = await extractTextFromImage(fileData);
      break
    case 'image/png':
      // fileText = await extractTextFromImage(fileData);
      break
    case 'text/html':
      const html = fileData.toString()
      const translatedHtml = NodeHtmlMarkdown.translate(html)
      fileText = translatedHtml
      break
    case 'text/plain':
      fileText = fileData.toString()
      break
    default:
      throw new Error('Unsupported file type')
  }

  return {
    fileText,
    docs,
    fileName: file.originalFilename ?? 'fallback-filename',
  }
}

export const getFileText = async (req: NextApiRequest) => {
  const chunks: never[] = []
  const { fields, files } = await formidablePromise(req, {
    ...formidableConfig,
    // consume this, otherwise formidable tries to save the file to disk
    fileWriteStreamHandler: () => fileConsumer(chunks),
  })

  const { file } = files

  return convertFileToString(file as formidable.File, chunks)
}

type FileInput = {
  fileText: string
  fileName: string
}

export const splitDocumentsFromFile = async (file: FileInput) => {
  const { fileText, fileName } = file

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  const rawOutput = await textSplitter.splitDocuments([
    new Document({
      pageContent: fileText,
      // @ts-ignore
      metadata: { source: fileName, type: MetadataType.FILE }, // Assuming you've imported MetadataType
    }),
  ])

  // Transform rawOutput to match the Docs type
  const docOutput = rawOutput.map((doc) => ({
    pageContent: doc.pageContent,
    metadata: {
      ...doc.metadata,
      reference: doc.metadata.reference || doc.pageContent,
      // Any other transformations needed to match the Docs metadata structure
    },
  }))

  return docOutput
}

export interface FileTextName {
  id: number
  name: string
  normalizedTextName?: string
}

function normalizeText(input: string): string {
  let normalized = input.replace(/_/g, ' ')
  normalized = normalized.replace(/-(\d+)/g, ' $1')
  normalized = normalized.replace(/-/g, ' ')
  normalized = normalized.replace(/([a-z])([A-Z])/g, '$1 $2')
  return normalized
}

export function addNormalizedTextName(data: FileTextName[] | null): FileTextName[] {
  if (data) {
    return data.map((item) => ({
      ...item,
      normalizedTextName: normalizeText(item.name),
    }))
  }
  return [{ id: 0, name: 'fallback' }]
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
