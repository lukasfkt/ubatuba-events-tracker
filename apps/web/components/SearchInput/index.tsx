import * as React from 'react'

import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

export const SearchInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'ref'>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={`flex h-11 w-full items-center gap-2 rounded-lg border border-input bg-white p-3 px-2 py-[10px] text-base focus:outline-none`}
    >
      <Search className="h-4 w-4 text-gray-800" />
      <input
        className={cn(
          `w-full flex-1 bg-transparent text-sm text-gray-800 outline-none`,
          className,
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
})

SearchInput.displayName = 'SearchInput'
