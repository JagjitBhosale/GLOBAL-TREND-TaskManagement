'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProfileHeader from '@/components/profile-header'
import ProfileForm from '@/components/profile-form'
import ConsistencyAnalysis from '@/components/consistency-analysis'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface User {
  email: string
  name: string
  googleAuth?: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push('/login')
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-primary/20 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <ProfileHeader user={user} />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
            <TabsTrigger value="analytics">Consistency Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileForm initialUser={user} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <ConsistencyAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
