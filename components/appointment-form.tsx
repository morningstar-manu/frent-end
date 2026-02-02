'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { createAppointment, updateAppointment } from '@/lib/appointment-actions'
import type { Appointment, Commercial, AppointmentStatus } from '@/lib/types'
import { STATUS_LABELS } from '@/lib/types'

interface AppointmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  commercials: Commercial[]
  appointment?: Appointment
  isEdit?: boolean
}

export function AppointmentForm({
  open,
  onOpenChange,
  commercials,
  appointment,
  isEdit = false,
}: AppointmentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const defaultDate = appointment 
    ? new Date(appointment.appointment_date).toISOString().split('T')[0]
    : ''
  const defaultTime = appointment
    ? new Date(appointment.appointment_date).toTimeString().slice(0, 5)
    : ''

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    let result
    if (isEdit && appointment) {
      result = await updateAppointment(appointment.id, formData)
    } else {
      result = await createAppointment(formData)
    }

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    onOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? 'Modifiez les informations du rendez-vous'
              : 'Remplissez les informations pour creer un nouveau rendez-vous'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointment_date">Date</Label>
              <Input
                id="appointment_date"
                name="appointment_date"
                type="date"
                defaultValue={defaultDate}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointment_time">Heure</Label>
              <Input
                id="appointment_time"
                name="appointment_time"
                type="time"
                defaultValue={defaultTime}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="commercial_id">Commercial</Label>
            <Select name="commercial_id" defaultValue={appointment?.commercial_id || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Selectionnez un commercial" />
              </SelectTrigger>
              <SelectContent>
                {commercials.map((commercial) => (
                  <SelectItem key={commercial.id} value={commercial.id}>
                    {commercial.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Nom complet *</Label>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={appointment?.full_name || ''}
              required
              disabled={isLoading}
              placeholder="Jean Dupont"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone_mobile">Tel. Mobile</Label>
              <Input
                id="phone_mobile"
                name="phone_mobile"
                type="tel"
                defaultValue={appointment?.phone_mobile || ''}
                disabled={isLoading}
                placeholder="0601020304"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_fixed">Tel. Fixe</Label>
              <Input
                id="phone_fixed"
                name="phone_fixed"
                type="tel"
                defaultValue={appointment?.phone_fixed || ''}
                disabled={isLoading}
                placeholder="0101020304"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              name="address"
              defaultValue={appointment?.address || ''}
              disabled={isLoading}
              placeholder="123 Rue de Paris, 75001 Paris"
            />
          </div>

          {isEdit && (
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select name="status" defaultValue={appointment?.status || 'pending'}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectionnez un statut" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_LABELS) as AppointmentStatus[]).map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="comment">Commentaire</Label>
            <Textarea
              id="comment"
              name="comment"
              defaultValue={appointment?.comment || ''}
              disabled={isLoading}
              placeholder="Informations supplementaires..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? 'Modification...' : 'Creation...'}
                </>
              ) : (
                isEdit ? 'Modifier' : 'Creer'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
