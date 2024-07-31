'use client'

import { useState } from 'react'
import Balancer from 'react-wrap-balancer'

import { FadeIn } from '@/components/animations/fade-in'
import { Heading } from '@/components/cult/gradient-heading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TagIcon } from '@/components/ui/icons'
import { formatDate } from '@/lib/utils'

import { ItemDetail } from './details'

export function SearchResultGrid({ results }: { results: any }) {
  const [open, setOpen] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleViewDetails = (id: number) => {
    setSelectedId(id)
    setOpen(true)
  }

  const selectedItem = results.find((item: any) => item.id === selectedId)

  if (results.length >= 1) {
    return (
      <div className="md:pl-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
          {results?.map((result: any) => (
            <FadeIn key={result.id}>
              <div className="justify-self-center">
                <Card className="relative shadow-black/30 transition">
                  <CardHeader className=" relative flex flex-col">
                    <CardTitle className="mr-1">
                      <span className="">{result.metadata.fileName}</span>
                    </CardTitle>
                    <CardDescription className="max-w-xs md:max-w-sm">
                      <span className="mr-3 line-clamp-3">{result.content}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex gap-4">
                    <Badge>{formatDate(result?.created_at)}</Badge>

                    <figure className="text-sm font-semibold lowercase tracking-tight">
                      <p className="flex items-center gap-1 text-xs font-bold tracking-wide text-vanta-700 dark:text-stone-200">
                        <TagIcon className="h-4 w-4 fill-brand-400/70 dark:fill-brand-400/90 dark:stroke-vanta-800" />{' '}
                        {result?.name}
                      </p>
                    </figure>
                  </CardContent>

                  <CardFooter className="mt-auto w-full flex gap-4 items-center justify-center">
                    <Button className="border w-full" onClick={() => handleViewDetails(result.id)}>
                      View details
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </FadeIn>
          ))}
        </div>
        {/* Details Drawer */}
        {selectedItem && (
          <ItemDetail
            id={selectedItem.id}
            title={selectedItem.name}
            description={selectedItem.content}
            content={selectedItem.metadata.text}
            open={open}
            setOpen={setOpen}
          />
        )}
      </div>
    )
  }

  return (
    <div className="mt-24">
      <Heading>No results found </Heading>
    </div>
  )
}
