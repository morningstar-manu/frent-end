'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { AppointmentStatus } from '@/lib/types'

export async function createAppointment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non authentifie' }
  }

  const commercial_id = formData.get('commercial_id') as string
  const full_name = formData.get('full_name') as string
  const phone_mobile = formData.get('phone_mobile') as string
  const phone_fixed = formData.get('phone_fixed') as string
  const address = formData.get('address') as string
  const appointment_date = formData.get('appointment_date') as string
  const appointment_time = formData.get('appointment_time') as string
  const comment = formData.get('comment') as string

  const dateTime = `${appointment_date}T${appointment_time}:00`

  const { error } = await supabase.from('appointments').insert({
    user_id: user.id,
    commercial_id: commercial_id || null,
    full_name,
    phone_mobile: phone_mobile || null,
    phone_fixed: phone_fixed || null,
    address: address || null,
    appointment_date: dateTime,
    comment: comment || null,
    status: 'pending',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function updateAppointment(id: string, formData: FormData) {
  const supabase = await createClient()

  const commercial_id = formData.get('commercial_id') as string
  const full_name = formData.get('full_name') as string
  const phone_mobile = formData.get('phone_mobile') as string
  const phone_fixed = formData.get('phone_fixed') as string
  const address = formData.get('address') as string
  const appointment_date = formData.get('appointment_date') as string
  const appointment_time = formData.get('appointment_time') as string
  const comment = formData.get('comment') as string
  const status = formData.get('status') as AppointmentStatus

  const dateTime = `${appointment_date}T${appointment_time}:00`

  const { error } = await supabase.from('appointments').update({
    commercial_id: commercial_id || null,
    full_name,
    phone_mobile: phone_mobile || null,
    phone_fixed: phone_fixed || null,
    address: address || null,
    appointment_date: dateTime,
    comment: comment || null,
    status,
    updated_at: new Date().toISOString(),
  }).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteAppointment(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('appointments').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

export async function getAppointments(userId?: string, month?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // Get profile to check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  let query = supabase
    .from('appointments')
    .select(`
      *,
      commercial:commercials(id, name),
      profile:profiles!appointments_user_id_fkey(id, first_name, last_name)
    `)
    .order('appointment_date', { ascending: false })

  // If user role, only show their appointments
  if (profile?.role === 'user') {
    query = query.eq('user_id', user.id)
  } else if (userId) {
    query = query.eq('user_id', userId)
  }

  // Filter by month if provided
  if (month) {
    const startDate = new Date(`${month}-01`)
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
    query = query
      .gte('appointment_date', startDate.toISOString())
      .lte('appointment_date', endDate.toISOString())
  }

  const { data } = await query

  return data || []
}

export async function getCommercials() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('commercials')
    .select('*')
    .eq('is_active', true)
    .order('name')

  return data || []
}

export async function getWeeklyPerformance(week?: string) {
  const supabase = await createClient()

  // Get current week if not provided
  let startDate: Date
  let endDate: Date

  if (week) {
    const [year, weekNum] = week.split('-W').map(Number)
    startDate = getDateOfISOWeek(weekNum, year)
    endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 4) // Monday to Friday
  } else {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    startDate = new Date(now.setDate(diff))
    startDate.setHours(0, 0, 0, 0)
    endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 4)
  }

  endDate.setHours(23, 59, 59, 999)

  // Get all appointments for the week
  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      id,
      user_id,
      appointment_date,
      profile:profiles!appointments_user_id_fkey(id, first_name, last_name)
    `)
    .gte('appointment_date', startDate.toISOString())
    .lte('appointment_date', endDate.toISOString())

  // Get all users with role 'user'
  const { data: users } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .eq('role', 'user')

  if (!users) return []

  // Build performance data
  const performance = users.map(user => {
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

  return performance
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
