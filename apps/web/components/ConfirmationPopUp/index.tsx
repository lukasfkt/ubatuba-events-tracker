import { useRef } from 'react'
import {
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Check, ChevronLeft } from 'lucide-react'

interface ConfirmationPopUpProps {
  onConfirm: () => void
  title: string
  description: string
}

export function ConfirmationPopUp({
  title,
  description,
  onConfirm,
}: ConfirmationPopUpProps) {
  const closeButton = useRef<HTMLButtonElement>(null)

  return (
    <DialogContent className="w-[600px] max-w-[600px] gap-0 p-8 max-md:w-[80vw] max-md:max-w-[80vw]">
      <DialogTitle className="text-2xl font-bold text-red-600">
        {title}
      </DialogTitle>
      <DialogDescription className="mt-2 text-sm text-zinc-500">
        {description}
      </DialogDescription>
      <div className="mt-8 flex items-center justify-start gap-4">
        <DialogClose ref={closeButton} asChild>
          <Button>
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </DialogClose>
        <Button
          variant={'destructive'}
          onClick={() => {
            onConfirm()
            closeButton?.current?.click()
          }}
        >
          <span> Confirm </span>
          <Check className="h-4 w-4" />
        </Button>
      </div>
    </DialogContent>
  )
}
