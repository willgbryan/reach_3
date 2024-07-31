import { atom, useAtom } from 'jotai'
import { z } from 'zod'

type CollapsedState = boolean
type DocSetType = string | null // Replace 'YourDocSetType' with the actual type
type StageType = 'reset' | 'search' | 'upload' | 'reset-search' | 'reset-upload' // Add more stage types if needed
type SizeType = 'compact' | 'large' | 'default' // Adjust according to your size options
type FileType = Blob[] // Replace 'any' with a more specific type if possible
type FileDataType = any | null // Replace 'any' with a more specific type if possible

type FileStatus = {
  status: 'idle' | 'loading' | 'complete' | 'error'
  error?: string // Optional error message
}

type FileStatusesType = FileStatus[]

const collapsedAtom = atom<CollapsedState>(false)
const previousDocSetNameAtom = atom<DocSetType>(null)
const mobileNavAtom = atom<boolean>(false)
const docSetNameAtom = atom<DocSetType>(null)
const stageAtom = atom<StageType>('reset')
const sizeAtom = atom<SizeType>('default')
const filesAtom = atom<FileType>([])
const fileDataAtom = atom<FileDataType>(null)

const fileStatusesAtom = atom<FileStatusesType>([])

export function useCollapsedState() {
  const [isGlobalCollapsed, setIsGlobalCollapsed] = useAtom(collapsedAtom)
  return { isGlobalCollapsed, setIsGlobalCollapsed }
}

export function useToggleMobileNav() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useAtom(mobileNavAtom)
  return { isMobileNavOpen, setIsMobileNavOpen }
}

export function usePreviousDocSet() {
  const [previousDocSet, setPreviousDocSet] = useAtom(previousDocSetNameAtom)
  return { previousDocSet, setPreviousDocSet }
}

export function useStage() {
  const [stage, setStage] = useAtom(stageAtom)
  return { stage, setStage }
}

export function useFiles() {
  const [files, setFiles] = useAtom(filesAtom)
  return { files, setFiles }
}

export function useFileData() {
  const [fileData, setFileData] = useAtom(fileDataAtom)
  return { fileData, setFileData }
}

export function useFileStatuses() {
  const [fileStatuses, setFileStatuses] = useAtom(fileStatusesAtom)
  return { fileStatuses, setFileStatuses }
}

const docSetNameFormSchema = z.object({
  docSetName: z
    .string()
    .min(4, { message: 'Name must be at least 4 characters.' })
    .regex(/^[a-zA-Z]+$/, {
      message: 'Name must contain only letters from a-z.',
    }),
})

export const useDocSetName = () => {
  const [docSetName, setDocSetName] = useAtom(docSetNameAtom)

  const validateDocSetName = (name) => {
    const result = docSetNameFormSchema.safeParse({ docSetName: name })
    return result.success
      ? { isValid: true, errors: [] }
      : { isValid: false, errors: result.error.errors }
  }

  return { docSetName, setDocSetName, validateDocSetName }
}
