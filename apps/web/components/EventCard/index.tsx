import { Card } from '@/components/ui/card'
import type { Event } from '@/types'
import Image from 'next/image'
import { Ellipsis, Pencil, Trash } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Dialog, DialogTrigger } from '../ui/dialog'
import { ConfirmationPopUp } from '../ConfirmationPopUp'
import { useEvents } from '@/hooks/useEvents'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { EditEventDialog } from '../EditEventDialog'

interface EventCardProps {
  ref: (node?: Element | null) => void
  shouldObserve: boolean
  eventDetails: Event
}

export function EventCard({
  ref,
  shouldObserve,
  eventDetails,
}: EventCardProps) {
  const { deleteEvent } = useEvents()

  const { id, title, date, description, location, imageUrl, category } =
    eventDetails
  const queryClient = useQueryClient()

  const eventDate = new Date(date)
  const day = eventDate.getDate()
  const month = eventDate
    .toLocaleDateString('en-US', { month: 'short' })
    .toUpperCase()

  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  const isToday = eventDate.toDateString() === today.toDateString()
  const isTomorrow = eventDate.toDateString() === tomorrow.toDateString()

  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const handleDeleteEvent = useCallback(async () => {
    const reponse = await deleteEvent(id)
    if (reponse) {
      queryClient.invalidateQueries({
        queryKey: ['eventsList'],
      })
    }
  }, [deleteEvent, queryClient, id])

  return (
    <Card
      className="relative flex items-center justify-between gap-4 p-4 shadow-md"
      ref={shouldObserve ? ref : undefined}
    >
      <div className="flex w-16 flex-col items-center justify-center">
        <span className="text-2xl font-bold text-red-600">{day}</span>
        <span className="text-xs font-semibold text-gray-500">{month}</span>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-hidden">
        <h2 className="truncate text-base font-semibold text-gray-800">
          {title}
        </h2>
        <p className="text-sm font-bold text-blue-700">{category}</p>
        <p className="text-sm text-gray-600">
          {isToday
            ? 'Today'
            : isTomorrow
              ? 'Tomorrow'
              : eventDate.toLocaleDateString('en-US')}
          , {formattedTime}
        </p>
        <p className="truncate text-sm text-gray-600">{location}</p>
        <p className="line-clamp-3 text-sm text-gray-400">{description}</p>
      </div>

      {imageUrl && (
        <div className="flex-shrink-0">
          <Image
            src={imageUrl}
            alt={title}
            width={70}
            height={70}
            className="mr-2 max-h-[70px] max-w-[70px] rounded-md object-cover"
          />
        </div>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <button className="absolute right-4 top-2">
            <Ellipsis className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          className="w-30 flex flex-col p-0"
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="justify-start">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <EditEventDialog eventDetails={eventDetails} />
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="justify-start">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <ConfirmationPopUp
              title="Delete event"
              description="Are you sure you want to delete this event?"
              onConfirm={handleDeleteEvent}
            />
          </Dialog>
        </PopoverContent>
      </Popover>
    </Card>
  )
}
