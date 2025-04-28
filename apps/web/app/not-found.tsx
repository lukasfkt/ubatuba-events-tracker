'use client'
import './globals.css'

import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="w-full">
      <div className="mt-[88px] h-full w-full">
        <div className="flex w-full flex-col items-center justify-center gap-5 p-5">
          <h1 className="text-[32px] text-indigo-600">Page not fould</h1>
          <Link
            href={'/'}
            className="rounded-lg bg-indigo-600 px-6 py-2 text-white"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
