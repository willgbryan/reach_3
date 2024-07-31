import React from 'react'
import { LoaderIcon } from 'lucide-react'

import { DynamicContainer, DynamicDescription, DynamicDiv } from '@/components/cult/dynamic-blob'

export const UploadLoadingState = () => (
  <DynamicContainer className="relative  flex w-full items-center justify-between gap-6">
    <DynamicDiv className="absolute left-3 top-3 inline-flex animate-spin items-center justify-center rounded-full bg-brand-400 p-2">
      <LoaderIcon className=" h-5 w-5 fill-brand-500 stroke-black" />
    </DynamicDiv>
    <DynamicDescription className="absolute right-3 top-4 my-auto text-xl font-medium tracking-tighter text-white ">
      processing <span className="text-stone-300"> file</span>
    </DynamicDescription>
  </DynamicContainer>
)
