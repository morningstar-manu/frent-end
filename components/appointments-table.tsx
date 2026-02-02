'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { AppointmentForm } from '@/components/appointment-form'
import { deleteAppointment } from '@/lib/appointment-actions'
import type { Appointment, Commercial } from '@/lib/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface AppointmentsTableProps {
  appointments: Appointment[]
  commercials: Commercial[]
  showActions?: boolean
  showAgent?: boolean
}

export function AppointmentsTable({
  appointments,
  commercials,
  showActions = false,
  showAgent = false,
}: AppointmentsTableProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleRowClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsDetailOpen(true)
  }

  const handleEdit = () => {
    setIsDetailOpen(false)
    setIsEditOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedAppointment) return
    
    setIsDeleting(true)
    const result = await deleteAppointment(selectedAppointment.id)
    
    if (result.error) {
      toast({
        title: 'Erreur',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Succes',
        description: 'Rendez-vous supprime avec succes',
      })
      setIsDetailOpen(false)
      router.refresh()
    }
    setIsDeleting(false)
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucun rendez-vous trouve
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Date creation</TableHead>
              <TableHead>Nom complet</TableHead>
              <TableHead>Telephones</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Date RDV</TableHead>
              <TableHead>Commercial</TableHead>
              {showAgent && <TableHead>Agent</TableHead>}
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment, index) => (
              <TableRow
                key={appointment.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(appointment)}
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  {format(new Date(appointment.created_at), 'dd/MM/yyyy', { locale: fr })}
                </TableCell>
                <TableCell className="font-medium">{appointment.full_name}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {appointment.phone_mobile && <div>M: {appointment.phone_mobile}</div>}
                    {appointment.phone_fixed && <div>F: {appointment.phone_fixed}</div>}
                  </div>
                </TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {appointment.address || '-'}
                </TableCell>
                <TableCell>
                  {format(new Date(appointment.appointment_date), 'dd/MM/yyyy HH:mm', { locale: fr })}
                </TableCell>
                <TableCell>{appointment.commercial?.name || '-'}</TableCell>
                {showAgent && (
                  <TableCell>
                    {appointment.profile 
                      ? `${appointment.profile.first_name || ''} ${appointment.profile.last_name || ''}`.trim() || '-'
                      : '-'
                    }
                  </TableCell>
                )}
                <TableCell>
                  <StatusBadge status={appointment.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Details du rendez-vous</DialogTitle>
            <DialogDescription>
              Informations completes sur le rendez-vous
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Nom complet:</span>
                  <p className="font-medium">{selectedAppointment.full_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Statut:</span>
                  <p className="mt-1">
                    <StatusBadge status={selectedAppointment.status} />
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tel. Mobile:</span>
                  <p className="font-medium">{selectedAppointment.phone_mobile || '-'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tel. Fixe:</span>
                  <p className="font-medium">{selectedAppointment.phone_fixed || '-'}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Adresse:</span>
                  <p className="font-medium">{selectedAppointment.address || '-'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date du RDV:</span>
                  <p className="font-medium">
                    {format(new Date(selectedAppointment.appointment_date), 'dd/MM/yyyy a HH:mm', { locale: fr })}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Commercial:</span>
                  <p className="font-medium">{selectedAppointment.commercial?.name || '-'}</p>
                </div>
                {selectedAppointment.comment && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Commentaire:</span>
                    <p className="font-medium">{selectedAppointment.comment}</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Cree le:</span>
                  <p className="font-medium">
                    {format(new Date(selectedAppointment.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {showActions && (
              <>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Supprimer
                </Button>
                <Button onClick={handleEdit}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {selectedAppointment && (
        <AppointmentForm
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          commercials={commercials}
          appointment={selectedAppointment}
          isEdit
        />
      )}
    </>
  )
}
