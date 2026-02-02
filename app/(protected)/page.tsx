'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppointmentsTable } from '@/components/appointments-table'
import { AppointmentForm } from '@/components/appointment-form'
import { Plus, Calendar, Loader2 } from 'lucide-react'
import type { Appointment, Commercial } from '@/lib/types'

export default function HomePage() {
  const { user, profile, isLoading: authLoading } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [commercials, setCommercials] = useState<Commercial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const supabase = createClient()

  const fetchData = async () => {
    if (!user) return
    setIsLoading(true)

    // Fetch commercials
    const { data: commercialsData } = await supabase
      .from('commercials')
      .select('*')
      .eq('is_active', true)
      .order('name')
    
    setCommercials(commercialsData || [])

    // Build appointments query
    let query = supabase
      .from('appointments')
      .select(`
        *,
        commercial:commercials(id, name),
        profile:profiles!appointments_user_id_fkey(id, first_name, last_name)
      `)
      .order('appointment_date', { ascending: false })

    // Filter by user if role is 'user'
    if (profile?.role === 'user') {
      query = query.eq('user_id', user.id)
    }

    // Filter by month
    if (selectedMonth) {
      const startDate = new Date(`${selectedMonth}-01`)
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
      query = query
        .gte('appointment_date', startDate.toISOString())
        .lte('appointment_date', endDate.toISOString())
    }

    const { data: appointmentsData } = await query
    setAppointments(appointmentsData || [])
    setIsLoading(false)
  }

  useEffect(() => {
    if (user && !authLoading) {
      fetchData()
    }
  }, [user, authLoading, selectedMonth])

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open)
    if (!open) {
      fetchData() // Refresh data when form closes
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bienvenue, {profile?.first_name || 'Utilisateur'}!
          </h1>
          <p className="text-muted-foreground">
            Gerez vos rendez-vous medicaux
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rendez-vous
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Mes rendez-vous
              </CardTitle>
              <CardDescription>
                {appointments.length} rendez-vous trouve(s)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-auto"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <AppointmentsTable
              appointments={appointments}
              commercials={commercials}
              showActions={profile?.role === 'admin'}
              showAgent={profile?.role !== 'user'}
            />
          )}
        </CardContent>
      </Card>

      <AppointmentForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        commercials={commercials}
      />
    </div>
  )
}
