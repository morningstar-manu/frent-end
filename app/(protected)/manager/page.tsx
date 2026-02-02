'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2, Maximize2, Star, TrendingUp } from 'lucide-react'
import { redirect } from 'next/navigation'
import { cn } from '@/lib/utils'

interface WeeklyPerformance {
  user_id: string
  user_name: string
  monday: number
  tuesday: number
  wednesday: number
  thursday: number
  friday: number
  total: number
}

export default function ManagerPage() {
  const { profile, isLoading: authLoading } = useAuth()
  const [performance, setPerformance] = useState<WeeklyPerformance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const now = new Date()
    const year = now.getFullYear()
    const oneJan = new Date(year, 0, 1)
    const numberOfDays = Math.floor((now.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000))
    const week = Math.ceil((numberOfDays + oneJan.getDay() + 1) / 7)
    return `${year}-W${String(week).padStart(2, '0')}`
  })

  const supabase = createClient()

  // Redirect if not moderator or admin
  useEffect(() => {
    if (!authLoading && profile && !['moderator', 'admin'].includes(profile.role)) {
      redirect('/')
    }
  }, [profile, authLoading])

  const fetchPerformance = async () => {
    setIsLoading(true)

    // Parse week
    const [year, weekNum] = selectedWeek.split('-W').map(Number)
    const startDate = getDateOfISOWeek(weekNum, year)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 4) // Monday to Friday
    endDate.setHours(23, 59, 59, 999)

    // Get all users with role 'user'
    const { data: users } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('role', 'user')

    if (!users) {
      setPerformance([])
      setIsLoading(false)
      return
    }

    // Get all appointments for the week
    const { data: appointments } = await supabase
      .from('appointments')
      .select('id, user_id, appointment_date')
      .gte('appointment_date', startDate.toISOString())
      .lte('appointment_date', endDate.toISOString())

    // Build performance data
    const perf = users.map(user => {
      const userAppointments = appointments?.filter(a => a.user_id === user.id) || []
      
      const days = { monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0 }
      
      userAppointments.forEach(apt => {
        const date = new Date(apt.appointment_date)
        const dayOfWeek = date.getDay()
        
        switch (dayOfWeek) {
          case 1: days.monday++; break
          case 2: days.tuesday++; break
          case 3: days.wednesday++; break
          case 4: days.thursday++; break
          case 5: days.friday++; break
        }
      })

      return {
        user_id: user.id,
        user_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Sans nom',
        ...days,
        total: Object.values(days).reduce((a, b) => a + b, 0),
      }
    })

    setPerformance(perf.sort((a, b) => b.total - a.total))
    setIsLoading(false)
  }

  useEffect(() => {
    if (!authLoading && profile) {
      fetchPerformance()
    }
  }, [authLoading, profile, selectedWeek])

  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
    if (count < 3) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
    return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200'
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Calculate daily totals
  const dailyTotals = {
    monday: performance.reduce((sum, p) => sum + p.monday, 0),
    tuesday: performance.reduce((sum, p) => sum + p.tuesday, 0),
    wednesday: performance.reduce((sum, p) => sum + p.wednesday, 0),
    thursday: performance.reduce((sum, p) => sum + p.thursday, 0),
    friday: performance.reduce((sum, p) => sum + p.friday, 0),
  }
  const grandTotal = Object.values(dailyTotals).reduce((a, b) => a + b, 0)

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
            <TrendingUp className="h-8 w-8 text-primary" />
            Performance Hebdomadaire
          </h1>
          <p className="text-muted-foreground">
            Suivi des rendez-vous par agent
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="week"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="w-auto"
          />
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tableau de Performance</CardTitle>
          <CardDescription>
            Nombre de rendez-vous par jour et par agent. Objectif: 3+ RDV/jour, 14+ RDV/semaine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : performance.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucun agent trouve
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Agent</TableHead>
                    <TableHead className="text-center">Lundi</TableHead>
                    <TableHead className="text-center">Mardi</TableHead>
                    <TableHead className="text-center">Mercredi</TableHead>
                    <TableHead className="text-center">Jeudi</TableHead>
                    <TableHead className="text-center">Vendredi</TableHead>
                    <TableHead className="text-center font-bold">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performance.map((agent) => (
                    <TableRow key={agent.user_id}>
                      <TableCell className="font-medium">{agent.user_name}</TableCell>
                      <TableCell className={cn('text-center font-semibold', getCellColor(agent.monday))}>
                        {agent.monday}
                      </TableCell>
                      <TableCell className={cn('text-center font-semibold', getCellColor(agent.tuesday))}>
                        {agent.tuesday}
                      </TableCell>
                      <TableCell className={cn('text-center font-semibold', getCellColor(agent.wednesday))}>
                        {agent.wednesday}
                      </TableCell>
                      <TableCell className={cn('text-center font-semibold', getCellColor(agent.thursday))}>
                        {agent.thursday}
                      </TableCell>
                      <TableCell className={cn('text-center font-semibold', getCellColor(agent.friday))}>
                        {agent.friday}
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        <span className="flex items-center justify-center gap-1">
                          {agent.total}
                          {agent.total >= 14 && (
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Totals row */}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-center">{dailyTotals.monday}</TableCell>
                    <TableCell className="text-center">{dailyTotals.tuesday}</TableCell>
                    <TableCell className="text-center">{dailyTotals.wednesday}</TableCell>
                    <TableCell className="text-center">{dailyTotals.thursday}</TableCell>
                    <TableCell className="text-center">{dailyTotals.friday}</TableCell>
                    <TableCell className="text-center text-primary">{grandTotal}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="text-muted-foreground">Legende:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30 border" />
          <span>0 RDV</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-100 dark:bg-amber-900/30 border" />
          <span>1-2 RDV</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-100 dark:bg-emerald-900/30 border" />
          <span>3+ RDV</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          <span>14+ RDV/semaine</span>
        </div>
      </div>
    </div>
  )
}

function getDateOfISOWeek(week: number, year: number): Date {
  const simple = new Date(year, 0, 1 + (week - 1) * 7)
  const dow = simple.getDay()
  const ISOweekStart = simple
  if (dow <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
  }
  return ISOweekStart
}
