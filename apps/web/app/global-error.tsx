'use client'
import './globals.css'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  console.log(error)
  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      <h1 className='text-2xl font-bold'>Erro inesperado</h1>
      <span className='text-zinc-400 text-sm mt-2'>
        Um erro inesperado aconteceu
      </span>
    </div>
  )
}
