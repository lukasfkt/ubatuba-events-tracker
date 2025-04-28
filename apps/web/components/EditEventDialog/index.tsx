'use client'

import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { CategoryEnum, type Event } from '@/types'
import { showToast } from '@/lib/utils'
import { useCallback, useEffect, useRef } from 'react'
import { useEvents } from '@/hooks/useEvents'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { LoadingComponent } from '../LoadingComponent'

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(10, 'Minimum 10 characters').max(255),
  location: z.string().min(1, 'Location is required').max(100),
  category: z.nativeEnum(CategoryEnum),
  imageUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/[\w-]+(\.[\w-]+)+[/#?]?.*$/.test(val),
      { message: 'Must be a valid URL' },
    ),
  date: z.date({
    required_error: 'Date is required',
    invalid_type_error: 'Invalid date',
  }),
  time: z.string().min(1, 'Time is required'),
})

type EventFormValues = z.infer<typeof eventSchema>

interface EditEventDialogProps {
  eventDetails: Event
}

export function EditEventDialog({ eventDetails }: EditEventDialogProps) {
  const { updateEvent, getEventById } = useEvents()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      date: new Date(),
      time: '12:00',
    },
  })

  const { data: event, isLoading } = useQuery({
    queryKey: ['eventDetails', eventDetails.id],
    queryFn: () => getEventById(eventDetails.id),
  })

  const watchDate = watch('date')
  const watchTime = watch('time')

  const dialogCloseButtonRef = useRef<HTMLButtonElement>(null)

  const resetForm = useCallback(() => {
    dialogCloseButtonRef.current?.click()
    reset()
  }, [dialogCloseButtonRef, reset])

  const onSubmitForm = useCallback(
    async (data: EventFormValues) => {
      const [hours, minutes] = data.time.split(':').map(Number)

      if (typeof hours !== 'number' || typeof minutes !== 'number') {
        showToast('Invalid time format', 'error')
        return
      }

      if (!eventDetails?.id) {
        showToast('Event not found', 'error')
        return
      }

      const finalDate = new Date(data.date)
      finalDate.setUTCHours(hours)
      finalDate.setUTCMinutes(minutes)
      finalDate.setUTCSeconds(0)
      finalDate.setUTCMilliseconds(0)

      data.date = finalDate
      const response = await updateEvent(eventDetails.id, data)
      if (response) {
        resetForm()
        queryClient.invalidateQueries({
          queryKey: ['eventsList'],
        })
      }
    },
    [updateEvent, resetForm, queryClient, eventDetails],
  )

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.date)
      const time = format(eventDate, 'HH:mm')
      console.log(eventDate)
      reset({
        ...event,
        time,
        date: eventDate,
      })
    }
  }, [event, reset])

  return (
    <DialogContent className="flex max-h-[90vh] w-[600px] max-w-[600px] flex-col gap-5 overflow-y-auto p-8 max-md:w-[90vw] max-md:max-w-[90vw]">
      <DialogClose hidden ref={dialogCloseButtonRef} />
      <DialogHeader>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogDescription>Edit the details of the event</DialogDescription>
      </DialogHeader>

      {isLoading ? (
        <LoadingComponent isLoading={isLoading} />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="flex flex-col gap-4"
        >
          <Input
            error={errors?.title?.message}
            placeholder="Title"
            {...register('title')}
          />

          <Textarea
            error={errors?.description?.message}
            placeholder="Description"
            {...register('description')}
          />

          <Input
            error={errors?.location?.message}
            placeholder="Location"
            {...register('location')}
          />

          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select
                value={field.value}
                defaultValue={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger error={errors?.category?.message}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CategoryEnum).map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <Input
            error={errors?.imageUrl?.message}
            placeholder="Image URL"
            {...register('imageUrl')}
          />

          <div className="flex flex-col gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`justify-start text-left font-normal ${errors.date ? 'border-red-500' : ''}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watchDate && watchTime ? (
                    `${format(watchDate, 'PPP')} at ${watchTime}`
                  ) : (
                    <span>Select date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  )}
                />
                <Input
                  type="time"
                  className="mt-2 items-center justify-center"
                  error={errors?.time?.message}
                  {...register('time')}
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <span className="text-xs text-red-500">
                {errors.date.message}
              </span>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      )}
    </DialogContent>
  )
}
