import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import Balancer from 'react-wrap-balancer'

import {
  DynamicContainer,
  DynamicDescription,
  DynamicDiv,
  SIZE_PRESETS,
  useDynamicBlobSize,
} from '@/components/cult/dynamic-blob'
import { FilePlusIcon } from '@/components/ui/icons'
import { useFiles } from '@/hooks/use-vector-blob'
import { cn } from '@/lib/utils'

export function UploadState() {
  const { setSize } = useDynamicBlobSize()
  const { setFiles } = useFiles()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = async (acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length < 1) {
      setFiles(acceptedFiles)
      setSelectedFile(acceptedFiles[0] || null)
      setSize(SIZE_PRESETS.MEDIUM)
    }
  }

  // Configure settings for file support + file size here
  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
    maxSize: 5000000,
    multiple: false,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/json': ['.json'],
      'text/plain': ['.txt', '.md', '.mdx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'text/html': ['.html'],
    },
    onDrop,
  })

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    // @ts-ignore
    <p className=" max-w-[190px] text-xs" key={errors[0]}>
      Make sure your file is <br /> .pdf .json .md .doc(x) or .txt
    </p>
  ))

  const acceptedFileItems = acceptedFiles.map((file) => (
    // @ts-ignore
    <span key={file.path}>
      {/* @ts-ignore */}
      {file.path}
    </span>
  ))

  return (
    <DynamicContainer className="relative ">
      <motion.form className="relative w-full">
        <div
          className={' cursor-pointer p-0 py-0  text-stone-400   md:min-w-full'}
          {...getRootProps()}
        >
          <DynamicDiv className="     ">
            <DynamicDiv
              className={cn(
                fileRejections.length >= 1 ? 'bg-red-200' : ' bg-brand-500',
                'absolute left-[16px] top-[14.5px] rounded-full border border-black/10  px-[11px] py-[11px] shadow-black/10 ',
              )}
            >
              <FilePlusIcon
                className={cn(
                  fileRejections.length >= 1
                    ? 'fill-red-400 stroke-black '
                    : ' fill-brand-400 stroke-black ',
                )}
              />
            </DynamicDiv>

            <DynamicDiv className="absolute right-6 top-4 text-left text-sm leading-4 text-stone-300">
              <DynamicDescription className=" text-base font-semibold leading-4 tracking-wide">
                <Balancer>
                  .md <br /> .docx <br /> .pdf
                </Balancer>
              </DynamicDescription>
            </DynamicDiv>
            <DynamicDiv
              className={cn(
                fileRejections,
                length >= 1 ? 'mt-2' : 'mt-5',
                ' absolute left-20   text-sm leading-5',
              )}
            >
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <>
                  <p className="flex flex-col items-start">
                    <span
                      className={cn(
                        fileRejections.length >= 1
                          ? ' text-red-100'
                          : ' text-stone-100 dark:text-brand-300',
                        'text-xl font-semibold tracking-tight',
                      )}
                    >
                      {fileRejections.length >= 1 ? 'Try again' : 'Click to upload'}
                    </span>{' '}
                    <span
                      className={cn(
                        fileRejections.length >= 1
                          ? 'text-red-300'
                          : 'text-stone-400 dark:text-stone-300',
                        'text-start text-base font-semibold leading-3 tracking-tight ',
                      )}
                    >
                      {selectedFile
                        ? acceptedFileItems
                        : fileRejections.length >= 1
                          ? fileRejectionItems
                          : '2 MB limit'}
                    </span>
                  </p>
                </>
              )}
            </DynamicDiv>
          </DynamicDiv>
          <div className="flex  cursor-pointer items-center justify-center ">
            <input {...getInputProps()} className="h-full" />
          </div>
        </div>
      </motion.form>
    </DynamicContainer>
  )
}

//   const acceptedFileItems = acceptedFiles.map((file) => (
//     // @ts-ignore
//     <span key={file.path}>
//       {/* @ts-ignore */}
//       {file.path}
//     </span>
//   ))
// const [isEditingDocSetName, setIsEditingDocSetName] = useState(() =>
// previousDocSet ? false : true,
// )
// Document Set State
// const { previousDocSet } = usePreviousDocSet()
// const { docSetName, setDocSetName, validateDocSetName } = useDocSetName()

// const defaultValue = previousDocSet || '' // Fallback to empty string if no default value
// const handleDocSetNameChange = (e) => setDocSetName(e.target.value)

//   Dynamic Blob
// const { setFileData } = useFileData()
