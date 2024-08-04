import { clsx, type ClassValue } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  return url
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7,
) // 7-character random string

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function truncateLongFileName(fileName: string, maxLength: number = 15): string {
  const fileBaseName = fileName.replace(/\.[^/.]+$/, '') // Remove file extension
  const hyphenatedName = fileBaseName.replace(/\W+/g, '-') // Replace non-word characters with hyphens
  const truncatedName = hyphenatedName.slice(0, maxLength) // Truncate to the specified maxLength
  const cleanTruncatedName = truncatedName.replace(/-$/, '') // Remove trailing hyphen if present

  // Add back the file extension
  const fileExtension = fileName.match(/\.[^/.]+$/) || ['']
  const truncatedFileName = `${cleanTruncatedName}${fileExtension[0]}`

  return truncatedFileName
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function pluralize(word: string, count: number, pluralForm?: string): string {
  if (count === 1) {
    return word
  }

  if (pluralForm) {
    return pluralForm
  }

  return `${word}s`
}

export function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString)
    return true
  } catch {
    return false
  }
}

function removeLeadingDash(pathPart: string): string {
  return pathPart.startsWith(` - `) ? pathPart.substring(1) : pathPart
}

function getSecondLevelDomain(hostname: string): string {
  return hostname.split('.').slice(-2, -1).join('.')
}

function removeFileExtension(pathPart: string | undefined): string {
  if (!pathPart) return ''
  return pathPart.replace(/\.[^/.]+$/, '')
}

function shortenLastPathPart(pathPart: string, maxLength: number): string {
  if (!pathPart) return ''
  return pathPart.length > maxLength ? pathPart.substring(0, maxLength) : pathPart
}

export function truncateLongUrl(longUrl: string, maxLength: number = 15): string {
  if (!isValidUrl(longUrl)) return 'Invalid URL'

  const cleanUrl = removeLeadingDash(longUrl)
  const url = new URL(cleanUrl)
  const hostname = getSecondLevelDomain(url.hostname)
  const pathParts = url.pathname.split('/').filter((part) => part !== '')
  let lastPathPart = pathParts[pathParts.length - 1]

  lastPathPart = removeFileExtension(lastPathPart)
  lastPathPart = shortenLastPathPart(lastPathPart, maxLength)

  const shortUrl = `${hostname}${lastPathPart ? '/' : ''}${lastPathPart}`
  //   return shortUrl
  return shortUrl.replace(/-/g, '')
}
