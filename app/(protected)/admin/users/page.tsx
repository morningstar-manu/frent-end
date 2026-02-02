'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Users, Plus, Pencil, Trash2, Loader2, ArrowLeft, Circle } from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Profile, UserRole } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

export default function UsersManagementPage() {
  const { profile, isLoading: authLoading } = useAuth()
  const [users, setUsers] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const supabase = createClient()

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && profile && profile.role !== 'admin') {
      redirect('/')
    }
  }, [profile, authLoading])

  const fetchUsers = async () => {
    setIsLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    setUsers(data || [])
    setIsLoading(false)
  }

  useEffect(() => {
    if (!authLoading && profile?.role === 'admin') {
      fetchUsers()
    }
  }, [authLoading, profile])

  const handleCreate = () => {
    setSelectedUser(null)
    setFormError(null)
    setIsFormOpen(true)
  }

  const handleEdit = (user: Profile) => {
    setSelectedUser(user)
    setFormError(null)
    setIsFormOpen(true)
  }

  const handleDelete = async (user: Profile) => {
    if (!confirm(`Etes-vous sur de vouloir supprimer ${user.first_name} ${user.last_name}?`)) {
      return
    }

    setIsDeleting(true)
    
    // Note: Deleting from auth.users will cascade to profiles due to foreign key
    // This requires admin privileges which we don't have from client
    // So we'll just update the profile to mark as deleted or use a server action
    
    const { error } = await supabase.from('profiles').delete().eq('id', user.id)
    
    if (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Succes',
        description: 'Utilisateur supprime avec succes',
      })
      fetchUsers()
    }
    setIsDeleting(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get('first_name') as string
    const lastName = formData.get('last_name') as string
    const email = formData.get('email') as string
    const role = formData.get('role') as UserRole
    const password = formData.get('password') as string

    if (selectedUser) {
      // Update existing user
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedUser.id)

      if (error) {
        setFormError(error.message)
        setIsSubmitting(false)
        return
      }
    } else {
      // Create new user via auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            first_name: firstName,
            last_name: lastName,
            role,
          },
        },
      })

      if (error) {
        setFormError(error.message)
        setIsSubmitting(false)
        return
      }

      // The trigger will create the profile automatically
    }

    toast({
      title: 'Succes',
      description: selectedUser ? 'Utilisateur modifie avec succes' : 'Utilisateur cree avec succes',
    })
    setIsFormOpen(false)
    setIsSubmitting(false)
    fetchUsers()
  }

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>
      case 'moderator':
        return <Badge variant="default">Manager</Badge>
      default:
        return <Badge variant="secondary">Marketeur</Badge>
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
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Gestion des utilisateurs
            </h1>
            <p className="text-muted-foreground">
              Creer, modifier et supprimer des utilisateurs
            </p>
          </div>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel utilisateur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            {users.length} utilisateur(s) enregistre(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucun utilisateur trouve
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prenom</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.first_name || '-'}</TableCell>
                      <TableCell>{user.last_name || '-'}</TableCell>
                      <TableCell>{user.email || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Circle 
                            className={`h-3 w-3 ${user.is_online ? 'fill-emerald-500 text-emerald-500' : 'fill-slate-300 text-slate-300'}`} 
                          />
                          <span className="text-sm">
                            {user.is_online ? 'En ligne' : 'Hors ligne'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user)}
                            disabled={isDeleting || user.id === profile?.id}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? 'Modifier utilisateur' : 'Nouvel utilisateur'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser 
                ? 'Modifiez les informations de l\'utilisateur'
                : 'Creez un nouveau compte utilisateur'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Prenom</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  defaultValue={selectedUser?.first_name || ''}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Nom</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  defaultValue={selectedUser?.last_name || ''}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {!selectedUser && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    minLength={6}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" defaultValue={selectedUser?.role || 'user'}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectionnez un role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Marketeur</SelectItem>
                  <SelectItem value="moderator">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {selectedUser ? 'Modification...' : 'Creation...'}
                  </>
                ) : (
                  selectedUser ? 'Modifier' : 'Creer'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
