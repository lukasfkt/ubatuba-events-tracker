'use client'

import { useEffect, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

import { Skeleton } from '@/components/ui/skeleton'
import { useEvents } from '@/hooks/useEvents'
import { SearchInput } from '@/components/SearchInput'
import { LoadingComponent } from '@/components/LoadingComponent'
import { EventCard } from '@/components/EventCard'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { CreateEventDialog } from '@/components/CreateEventDialog'

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
      <Header />
      <div className="mx-auto max-w-3xl pt-16">
        <div className="flex items-center gap-5">
          <SearchInput
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') refetch()
            }}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button title="Create Event" className="h-11" variant={'outline'}>
                <Plus />
              </Button>
            </DialogTrigger>
            <CreateEventDialog />
          </Dialog>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          {!isFetched
            ? Array.from({ length: 5 }).map((_, i) => (
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
                      <EventCard
                        key={event.id}
                        ref={ref}
                        shouldObserve={shouldObserve}
                        eventDetails={event}
                      />
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
