'use client'

import { useState } from 'react'
import useSWR from 'swr'

import { FadeInSmall } from '@/components/animations/fade-in'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getUserDocumentSets } from '@/hooks/use-get-document-sets'
import { useDocSetName } from '@/hooks/use-vector-blob'

export function SelectScrollable({ prevDocSets }) {
  const [shouldRefetch, setShouldRefetch] = useState(false)
  const { setDocSetName } = useDocSetName()

  const { data: freshData, isLoading } = useSWR(
    shouldRefetch ? null : 'get-user-document-sets',
    getUserDocumentSets,
  )
  const docSetList = freshData || prevDocSets

  return (
    <FadeInSmall>
      <Select onValueChange={setDocSetName} onOpenChange={() => setShouldRefetch((v) => !v)}>
        <SelectTrigger
          className="w-[180px] border-neutral-500/70 "
          onClick={() => setShouldRefetch(true)}
        >
          <SelectValue placeholder="Collections " />
        </SelectTrigger>
        {!isLoading ? (
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Previous</SelectLabel>

              {docSetList?.map((ns) => (
                <SelectItem key={ns.id} value={ns.title}>
                  {ns.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        ) : null}
      </Select>
    </FadeInSmall>
  )
}
