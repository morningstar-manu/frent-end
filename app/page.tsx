"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function RootPage() {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('[v0] RootPage: Checking auth...')
        const { data: { user }, error } = await supabase.auth.getUser()
        console.log('[v0] RootPage: Auth result', { user: !!user, error })
        if (error) {
          console.log('[v0] RootPage: Auth error, redirecting to login')
          router.push('/auth/login')
          return
        }
        if (user) {
          console.log('[v0] RootPage: User found, redirecting to dashboard')
          router.push('/dashboard')
        } else {
          console.log('[v0] RootPage: No user, redirecting to login')
          router.push('/auth/login')
        }
      } catch (e) {
        console.error('[v0] RootPage: Error checking auth', e)
        setError(e instanceof Error ? e.message : 'Une erreur est survenue')
      }
    }
    checkAuth()
  }, [router, supabase.auth])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 p-6 border border-destructive rounded-lg">
          <p className="text-destructive font-medium">Erreur</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    </div>
  )
}
