import { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { useAuthentication } from '@/hooks/useAuthentication'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

const HeaderTitle: {
  [key: string]: string
} = {
  '/events': 'Events List',
}

export function Header() {
  const { logout } = useAuthentication()

  const router = useRouter()
  const pathName = usePathname()

  const handleLogout = useCallback(async () => {
    await logout()
    router.push('/login')
  }, [logout, router])

  return (
    <div className="fixed left-0 top-0 z-10 flex h-16 w-full items-center justify-center bg-white p-4 shadow-md">
      <h1 className="text-2xl font-bold max-md:text-lg">
        {HeaderTitle[pathName]}
      </h1>
      <div className="absolute right-4 top-[50%] flex translate-y-[-50%] items-center gap-1">
        <Button title="Logout" variant="ghost" onClick={handleLogout}>
          <LogOut />
        </Button>
      </div>
    </div>
  )
}
