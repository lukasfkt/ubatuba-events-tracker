'use client'

import {
  type Toast,
  type Renderable,
  toast,
  ToastBar,
  Toaster,
  CheckmarkIcon,
  ErrorIcon,
} from 'react-hot-toast'
import './style.css'

interface ToastContainerProps {
  t: Toast
  message: Renderable
}

const toastType: Record<string, React.ReactNode> = {
  success: <CheckmarkIcon />,
  error: <ErrorIcon />,
}

function ToastContainer({ t, message }: ToastContainerProps) {
  return (
    <div
      onClick={() => toast.dismiss(t.id)}
      className={`relative z-50 flex cursor-pointer items-center gap-5 p-3`}
    >
      {toastType[t.type]}
      <div className="flex flex-col items-start justify-start gap-1 text-sm">
        <div className="font-bold">
          {t.type === 'success' ? 'Sucesso' : 'Erro'}
        </div>
        <div className="toast-message">{message}</div>
      </div>
    </div>
  )
}

export function ToasterProvider() {
  return (
    <Toaster position="top-right">
      {(t) => (
        <ToastBar toast={t}>
          {({ message }) => <ToastContainer t={t} message={message} />}
        </ToastBar>
      )}
    </Toaster>
  )
}
