'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Home } from 'lucide-react'

interface User {
  email: string
  name: string
  googleAuth?: boolean
}

interface ProfileHeaderProps {
  user: User
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <span className="hidden sm:inline font-semibold text-foreground">TaskFlow</span>
            </Link>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
