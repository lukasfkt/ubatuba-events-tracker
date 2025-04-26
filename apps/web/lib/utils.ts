import { toast } from 'react-hot-toast'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { isAxiosError } from 'axios'

const UNEXPECTED_ERROR_MESSAGE = 'Unexpected error'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function showToast(message: string, type: 'success' | 'error') {
  return type === 'success' ? toast.success(message) : toast.error(message)
}

export function handleErroMessage(error: unknown) {
  if (isAxiosError(error)) {
    const handleErroMessage =
      error.response?.data.detail ?? UNEXPECTED_ERROR_MESSAGE
    if (typeof handleErroMessage === 'string') {
      showToast(handleErroMessage, 'error')
      return
    }
    showToast(UNEXPECTED_ERROR_MESSAGE, 'error')
  } else {
    showToast(UNEXPECTED_ERROR_MESSAGE, 'error')
  }
}
