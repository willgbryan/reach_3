import { cache, Suspense } from 'react'
import z from 'zod'

import { searchDocuments } from '@/app/_data/document_sections'
import { getSession } from '@/app/_data/user'
import { Heading } from '@/components/cult/gradient-heading'
import { MobileNavSearchActions } from '@/components/nav/nav-blob-actions-mobile'
import { Separator } from '@/components/ui/separator'

import { ChatCount, DocumentCount, LoadingCard } from './count'
import { SearchResultGrid } from './grid'
import { Search } from './search'

export const dynamic = 'force-dynamic'

const loadUserSession = cache(async () => {
  return await getSession()
})

const SearchParamsSchema = z.object({
  search: z.string().max(256).optional().default(''),
})

export default async function Library({ searchParams }: any) {
  const session = await loadUserSession()

  const query = SearchParamsSchema.safeParse(searchParams)

  if (!query.success) {
    return <p>Bad request</p>
  }

  const results = await searchDocuments({ query: query.data.search })

  return (
    <>
      <div className="w-full md:pl-36 py-12 ">
        <div className="flex justify-between">
          <Heading size="xl">Library</Heading>
        </div>
        <Separator className="py-2 border-brand-300/40  border-l border-y rounded-l-lg bg-brand-400" />
      </div>

      <div className="w-full flex-col md:flex-row  pb-12 flex  justify-center gap-12 items-center ">
        <div className="hidden md:block">
          <Search />
        </div>
        <div className="flex gap-2 md:gap-6 px-2">
          <Suspense fallback={<LoadingCard />}>
            <ChatCount user={session?.user.id} />
          </Suspense>
          <Suspense fallback={<LoadingCard />}>
            <DocumentCount />
          </Suspense>
        </div>
        <div className="md:hidden">
          <Search />
        </div>
      </div>

      <div className="flex flex-col w-full  items-center">
        <Suspense fallback={null}>
          {query.data.search ? (
            <SearchResultGrid results={results} />
          ) : (
            <div className="mt-24">
              <Heading>Search to get started </Heading>
            </div>
          )}
        </Suspense>
      </div>
      <div className="absolute bottom-8  right-8">
        <MobileNavSearchActions messages={[]} handleReset={null} />
      </div>
    </>
  )
}
