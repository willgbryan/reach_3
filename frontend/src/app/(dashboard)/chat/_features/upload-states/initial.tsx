import React from 'react'
import { Home } from 'lucide-react'

import { DynamicContainer, DynamicDescription, DynamicDiv } from '@/components/cult/dynamic-blob'
import { FileBlankIcon } from '@/components/ui/icons'

export const DefaultState = () => (
  <DynamicContainer className="relative  flex w-full items-center justify-between gap-2 h-full">
    <DynamicDiv className="rounded-full bg-brand-400 p-1 absolute left-2 top-2">
      <Home className=" h-4 w-4 fill-brand-500 stroke-black" />
    </DynamicDiv>
    <DynamicDescription className="absolute right-4 top-1.5 my-auto text-lg font-medium tracking-tighter text-stone-300 ">
      welcome
    </DynamicDescription>
  </DynamicContainer>
)

export const InitialUploadState = () => (
  <DynamicContainer
    key="upload"
    className="relative  flex w-full items-center justify-between gap-6"
  >
    <DynamicDiv className="absolute left-[8px] top-[7px] inline-flex items-center justify-center rounded-full bg-brand-400 p-1">
      <FileBlankIcon className=" h-3 w-3 fill-brand-500 stroke-black" />
    </DynamicDiv>
    <DynamicDescription className="absolute right-4 top-1.5 my-auto text-lg font-medium tracking-tighter text-white ">
      upload <span className="text-stone-300"> file</span>
    </DynamicDescription>
  </DynamicContainer>
)
