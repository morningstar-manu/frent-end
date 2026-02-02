'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AppointmentsTable } from '@/components/appointments-table'
import { Users, Calendar, Download, Loader2, Shield } from 'lucide-react'
import { redirect } from 'next/navigation'
import type { Appointment, Commercial, Profile } from '@/lib/types'
import { format } from 'date-fns'

export default function AdminPage() {
  const { profile, isLoading: authLoading } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [commercials, setCommercials] = useState<Commercial[]>([])
  const [agents, setAgents] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedAgent, setSelectedAgent] = useState<string>('all')

  const supabase = createClient()

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && profile && profile.role !== 'admin') {
      redirect('/')
    }
  }, [profile, authLoading])

  const fetchData = async () => {
    setIsLoading(true)

    // Fetch commercials
    const { data: commercialsData } = await supabase
      .from('commercials')
      .select('*')
      .eq('is_active', true)
      .order('name')
    
    setCommercials(commercialsData || [])

    // Fetch agents (users with role 'user')
    const { data: agentsData } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'user')
      .order('first_name')
    
    setAgents(agentsData || [])

    // Build appointments query
    let query = supabase
      .from('appointments')
      .select(`
        *,
        commercial:commercials(id, name),
        profile:profiles!appointments_user_id_fkey(id, first_name, last_name)
      `)
      .order('appointment_date', { ascending: false })

    // Filter by date range
    if (startDate) {
      query = query.gte('appointment_date', `${startDate}T00:00:00`)
    }
    if (endDate) {
      query = query.lte('appointment_date', `${endDate}T23:59:59`)
    }

    // Filter by agent
    if (selectedAgent && selectedAgent !== 'all') {
      query = query.eq('user_id', selectedAgent)
    }

    const { data: appointmentsData } = await query
    setAppointments(appointmentsData || [])
    setIsLoading(false)
  }

  useEffect(() => {
    if (!authLoading && profile?.role === 'admin') {
      fetchData()
    }
  }, [authLoading, profile, startDate, endDate, selectedAgent])

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Date creation',
      'Nom complet',
      'Tel. Mobile',
      'Tel. Fixe',
      'Adresse',
      'Date RDV',
      'Commercial',
      'Agent',
      'Statut',
      'Commentaire',
    ]

    const rows = appointments.map(apt => [
      apt.id,
      format(new Date(apt.created_at), 'dd/MM/yyyy HH:mm'),
      apt.full_name,
      apt.phone_mobile || '',
      apt.phone_fixed || '',
      apt.address || '',
      format(new Date(apt.appointment_date), 'dd/MM/yyyy HH:mm'),
      apt.commercial?.name || '',
      apt.profile ? `${apt.profile.first_name || ''} ${apt.profile.last_name || ''}`.trim() : '',
      apt.status,
      apt.comment || '',
    ])

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';')),
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `rendez-vous_${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
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
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Administration
          </h1>
          <p className="text-muted-foreground">
            Gestion complete des rendez-vous et utilisateurs
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/users">
            <Users className="h-4 w-4 mr-2" />
            Gestion des utilisateurs
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Tous les rendez-vous
              </CardTitle>
              <CardDescription>
                {appointments.length} rendez-vous trouve(s)
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-auto"
                placeholder="Date debut"
              />
              <span className="text-muted-foreground">a</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-auto"
                placeholder="Date fin"
              />
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tous les agents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les agents</SelectItem>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.first_name} {agent.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportToCSV} disabled={appointments.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
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
              showActions={true}
              showAgent={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
