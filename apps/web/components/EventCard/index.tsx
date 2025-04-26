import { Card } from '@/components/ui/card'
import type { Event } from '@/types'
import Image from 'next/image'

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
  const { title, date, description, location } = eventDetails

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

  return (
    <Card
      className="flex items-center justify-between gap-4 p-4 shadow-md"
      ref={shouldObserve ? ref : undefined}
    >
      <div className="flex w-16 flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{day}</span>
        <span className="text-xs font-semibold text-gray-500">{month}</span>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-hidden">
        <h2 className="truncate text-base font-semibold text-gray-800">
          {title}
        </h2>
        <p className="text-sm text-gray-500">
          {isToday
            ? 'Today'
            : isTomorrow
              ? 'Tomorrow'
              : eventDate.toLocaleDateString('en-US')}
          , {formattedTime}
        </p>
        <p className="truncate text-sm text-gray-600">{location}</p>
      </div>

      {/* {imageUrl && (
        <div className="flex-shrink-0">
          <Image
            src={imageUrl}
            alt={title}
            width={50}
            height={50}
            className="rounded-md object-cover"
          />
        </div>
      )} */}
    </Card>
  )
}
