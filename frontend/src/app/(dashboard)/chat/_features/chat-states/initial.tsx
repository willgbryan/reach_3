import React from 'react'
import { Search } from 'lucide-react'

import { DynamicContainer, DynamicDescription, DynamicDiv } from '@/components/cult/dynamic-blob'

export const InitialChatState = () => (
  <DynamicContainer key="chat" className="relative  flex w-full items-center justify-between gap-6">
    <DynamicDiv className="absolute left-[8px] top-[7px] inline-flex items-center justify-center rounded-full bg-brand-400 p-1">
      <Search className=" h-5 w-5 fill-brand-500 stroke-black" />
    </DynamicDiv>
    <DynamicDescription className="absolute right-4 top-1.5 my-auto text-lg font-medium tracking-tighter text-white ">
      AI <span className="text-stone-300"> search</span>
    </DynamicDescription>
  </DynamicContainer>
)
