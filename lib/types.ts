export type UserRole = 'user' | 'moderator' | 'admin'

export type AppointmentStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'cancelled' 
  | 'not-interested' 
  | 'to-be-reminded' 
  | 'longest-date'

export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  role: UserRole
  is_online: boolean
  created_at: string
  updated_at: string
}

export interface Commercial {
  id: string
  name: string
  email: string | null
  phone: string | null
  is_active: boolean
  created_at: string
}

export interface Appointment {
  id: string
  user_id: string
  commercial_id: string | null
  full_name: string
  phone_mobile: string | null
  phone_fixed: string | null
  address: string | null
  appointment_date: string
  comment: string | null
  status: AppointmentStatus
  created_at: string
  updated_at: string
  // Joined fields
  commercial?: Commercial
  profile?: Profile
}

export interface AppointmentFormData {
  commercial_id: string
  full_name: string
  phone_mobile: string
  phone_fixed: string
  address: string
  appointment_date: string
  appointment_time: string
  comment: string
}

export interface WeeklyPerformance {
  user_id: string
  user_name: string
  monday: number
  tuesday: number
  wednesday: number
  thursday: number
  friday: number
  total: number
}

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  'pending': 'En attente',
  'confirmed': 'Confirme',
  'cancelled': 'Annule',
  'not-interested': 'Non interesse',
  'to-be-reminded': 'A rappeler',
  'longest-date': 'Date eloignee',
}

export const STATUS_COLORS: Record<AppointmentStatus, string> = {
  'pending': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  'confirmed': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'not-interested': 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
  'to-be-reminded': 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
  'longest-date': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
}
