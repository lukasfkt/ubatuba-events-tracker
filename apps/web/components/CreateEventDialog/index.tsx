import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'

export function CreateEventDialog() {
  return (
    <DialogContent className="flex max-h-[90vh] w-[600px] max-w-[600px] flex-col gap-5 overflow-y-auto p-8 max-md:w-[90vw] max-md:max-w-[90vw]">
      <DialogTitle>Create Event</DialogTitle>
      <DialogDescription>Fill the form to create a new event</DialogDescription>
    </DialogContent>
  )
}
