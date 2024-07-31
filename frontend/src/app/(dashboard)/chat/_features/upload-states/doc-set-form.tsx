import React, { useCallback, useEffect, useState } from 'react'
import { Edit2Icon } from 'lucide-react'
import { toast } from 'sonner'

import {
  DynamicContainer,
  DynamicDescription,
  DynamicDiv,
  DynamicTitle,
  SIZE_PRESETS,
  useDynamicBlobSize,
} from '@/components/cult/dynamic-blob'
import { Button } from '@/components/ui/button'
import { FolderIcon } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useDocSetName,
  useFileData,
  useFiles,
  useFileStatuses,
  usePreviousDocSet,
  useStage,
} from '@/hooks/use-vector-blob'
import { cn } from '@/lib/utils'

export function DocSetFormState() {
  // Blob State
  const { setStage } = useStage()
  const { setSize, scheduleAnimation } = useDynamicBlobSize()
  // File State
  const { files } = useFiles()
  const { fileStatuses, setFileStatuses } = useFileStatuses()
  // Document Set State
  const { previousDocSet } = usePreviousDocSet()
  const { docSetName, setDocSetName, validateDocSetName } = useDocSetName()
  const [isEditingDocSetName, setIsEditingDocSetName] = useState(() =>
    previousDocSet ? false : true,
  )
  const defaultValue = previousDocSet || '' // Fallback to empty string if no default value
  const handleDocSetNameChange = (e) => setDocSetName(e.target.value)

  const { setFileData } = useFileData()

  function handleReset() {
    setStage('reset-upload')
    setFileData(null)
    scheduleAnimation([
      { size: SIZE_PRESETS.EMPTY, delay: 100 },
      { size: SIZE_PRESETS.COMPACT, delay: 500 },
      { size: SIZE_PRESETS.LARGE, delay: 1000 },
    ])
  }

  const handleDocSetNameSubmit = async (event) => {
    event.preventDefault()
    const result = validateDocSetName(docSetName)
    if (result.isValid) {
      toast.success('DocSet name is valid.')
      setIsEditingDocSetName(false)
      // embed file and upload to a collection
      await embedFiles()
    } else {
      toast.error(result.errors.map((e) => e.message).join(', '))
    }
  }

  const embedFiles = useCallback(async () => {
    const filesArray = Array.from(files)

    setSize(SIZE_PRESETS.COMPACT_MEDIUM)
    setFileStatuses(files.map(() => ({ status: 'loading' })))

    for (const [index, file] of filesArray.entries()) {
      try {
        const { fileText, fileName } = await uploadFile(file)

        await embedFile(fileText, fileName, docSetName)
        updateFileStatus(index, 'complete')
        setStage('search')
      } catch (e) {
        updateFileStatus(index, 'error', e.message || 'Unknown error')
        toast.error(`Error While Processing File: ${e.message || e}`)
      }
    }

    if (fileStatuses.every((status) => status.status === 'complete')) {
      setSize(SIZE_PRESETS.LONG)
      setStage('search')

      toast.success(`embedFiles - Successfully processed files`)
    } else {
      toast.error('Some file processes failed. Check status.')
    }
  }, [files, docSetName, previousDocSet])

  const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const uploadResponse = await fetch('/api/upload-file-raw', {
      method: 'post',
      body: formData,
      headers: {
        collection_name: 'kewl' ? 'kewl' : 'default-namespace',
      },
    })

    const uploadResult = await uploadResponse.json()

    if (!uploadResponse.ok) {
      toast.error(`Error While Uploading File: ${uploadResult.error || 'Failed to upload file'}`)
      throw new Error(uploadResult.error || 'Failed to upload file')
    }

    return uploadResult
  }

  const embedFile = async (fileText, fileName, docSetName) => {
    const embedResponse = await fetch('/api/file-embed', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileData: fileText,
        fileName: fileName,
        docSetName: docSetName ?? previousDocSet,
      }),
    })

    const embedResult = await embedResponse.json()
    if (!embedResponse.ok) {
      toast.error(`Error While Embedding File`)
      throw new Error(embedResult.error || 'Failed to embed file')
    }
  }

  const updateFileStatus = (index, status, error = '') => {
    setFileStatuses((prev) => {
      const updated = [...prev]
      updated[index] = { status, error }
      return updated
    })
  }

  useEffect(() => {
    if (files) {
      setSize(SIZE_PRESETS.MEDIUM)
    }
  }, [files])

  return (
    <DynamicContainer className="relative flex h-full flex-col items-center justify-center gap-1 py-3">
      <DynamicDiv className=" mt-4 space-y-6  text-left">
        <div className="flex gap-2">
          <div className="flex  items-center justify-center rounded-full bg-brand-200 px-3 py-3 text-left text-xl font-bold text-white">
            <FolderIcon className="fill-brand-400 stroke-stone-700" />
          </div>
          <div>
            <Label className=" text-left text-lg font-bold text-white">Name</Label>
            <DynamicDescription className=" text-sm leading-4 tracking-tight text-stone-300">
              Embed this file to a collection.
            </DynamicDescription>
          </div>
        </div>

        <DynamicDiv className="flex items-center justify-start gap-2">
          <button
            onClick={() => setIsEditingDocSetName(true)}
            className={cn(isEditingDocSetName ? 'hidden' : 'flex items-center justify-start gap-2')}
          >
            <Edit2Icon className="h-3 w-3 stroke-brand-300" />
            <DynamicTitle className="font-black text-white">{docSetName}</DynamicTitle>
          </button>

          <Input
            value={docSetName ?? ''}
            onChange={handleDocSetNameChange}
            placeholder="folder-name"
            className={cn(
              !isEditingDocSetName
                ? 'hidden'
                : 'border-stone-100/10 bg-stone-800 text-brand-100 ring-white/10 placeholder:text-stone-300 focus-visible:border-brand-400/60 focus-visible:bg-black focus-visible:ring-white/10',
            )}
          />
        </DynamicDiv>

        <DynamicDiv className="mt-auto flex w-full gap-2">
          <Button
            onClick={handleReset}
            className="rounded-3xl border border-white/10 bg-stone-700 px-11 text-white hover:bg-stone-700/90"
          >
            reset
          </Button>

          <Button
            className="rounded-3xl border border-brand-100/10  bg-brand-400 px-11  text-brand-900 hover:bg-brand-500 hover:text-black"
            onClick={handleDocSetNameSubmit}
          >
            Submit
          </Button>
        </DynamicDiv>
      </DynamicDiv>
    </DynamicContainer>
  )
}
