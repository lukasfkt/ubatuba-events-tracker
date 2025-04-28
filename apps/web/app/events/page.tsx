'use client'

import { useEffect, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

import { useEvents } from '@/hooks/useEvents'

import { Skeleton } from '@/components/ui/skeleton'
import { SearchInput } from '@/components/SearchInput'
import { LoadingComponent } from '@/components/LoadingComponent'
import { EventCard } from '@/components/EventCard'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { CreateEventDialog } from '@/components/CreateEventDialog'
import { Badge } from '@/components/ui/badge'

import { Plus, X } from 'lucide-react'

import { CategoryEnum } from '@/types'

export default function EventsPage() {
  const { fetchEvents } = useEvents()
  const { ref, inView } = useInView()

  const [search, setSearch] = useState('')
  const [delayedSearch, setDelayedSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string[]>([])

  const {
    data: eventsList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['eventsList', delayedSearch, selectedCategory],
    initialData: { pages: [[]], pageParams: [1] },
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      fetchEvents({
        page: pageParam,
        search: delayedSearch,
        limit: 5,
        categories: selectedCategory,
      }),
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedSearch(search)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-6">
      <Header />
      <div className="mx-auto max-w-3xl pt-16">
        <div className="flex items-center gap-5">
          <SearchInput
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

        <div className="mt-4 flex flex-wrap gap-2">
          {Object.values(CategoryEnum).map((category) => {
            const hasCategory = selectedCategory.includes(category)
            return (
              <Badge
                key={category}
                variant={hasCategory ? 'default' : 'secondary'}
                onClick={() =>
                  hasCategory
                    ? setSelectedCategory(
                        selectedCategory.filter((c) => c !== category),
                      )
                    : setSelectedCategory([...selectedCategory, category])
                }
                className="cursor-pointer px-5 py-2"
              >
                {category}
              </Badge>
            )
          })}
          {selectedCategory.length > 0 && (
            <button
              onClick={() => setSelectedCategory([])}
              className="flex items-center gap-1 text-xs hover:opacity-80"
            >
              <X className="h-3 w-3" /> Clear filter
            </button>
          )}
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
