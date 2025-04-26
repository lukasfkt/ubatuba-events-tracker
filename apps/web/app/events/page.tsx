'use client'

import { useEffect, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useEvents } from '@/hooks/useEvents'
import { SearchInput } from '@/components/SearchInput'
import { LoadingComponent } from '@/components/LoadingComponent'

export default function EventsPage() {
  const { fetchEvents } = useEvents()
  const [search, setSearch] = useState('')
  const { ref, inView } = useInView()

  const {
    data: eventsList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isFetched,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['events', search],
    initialData: { pages: [[]], pageParams: [1] },
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      fetchEvents({ page: pageParam, search, limit: 5 }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length > 0 ? pages.length + 1 : undefined
    },
  })

  useEffect(() => {
    const fetchNextPageOnScroll = async () => {
      if (inView && hasNextPage && !isFetchingNextPage && !isFetching) {
        await fetchNextPage()
      }
    }

    fetchNextPageOnScroll()
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, isFetching])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="bg-red mb-6 text-3xl font-bold text-gray-800">
          Eventos
        </h1>

        <SearchInput
          placeholder="Buscar por título ou localização..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') refetch()
          }}
        />

        <div className="mt-8 flex flex-col gap-4">
          {!isFetched
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-lg" />
              ))
            : eventsList?.pages.map((page, pageIndex) => (
                <div key={pageIndex} className="flex flex-col gap-4">
                  {page.map((event, index) => {
                    const isLastItem =
                      pageIndex === eventsList.pages.length - 1 &&
                      index === page.length - 1
                    const shouldObserve = isLastItem && !isFetchingNextPage
                    return (
                      <Card
                        key={event.id}
                        className="transition-all hover:shadow-lg"
                        ref={shouldObserve ? ref : undefined}
                      >
                        <CardHeader>
                          <CardTitle className="text-sky-800">
                            {event.name}
                          </CardTitle>
                          <CardDescription>{event.location}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-gray-700">
                          <p className="text-xs text-gray-500">
                            {new Date(event.date).toLocaleDateString('pt-BR')}
                          </p>
                          <p>{event.description}</p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ))}
        </div>

        <LoadingComponent isLoading={isFetchingNextPage} />
      </div>
    </div>
  )
}
