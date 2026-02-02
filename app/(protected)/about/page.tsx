import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Stethoscope, Users, Calendar, TrendingUp, Shield } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Stethoscope className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Linkuup Medical</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Votre solution de gestion de rendez-vous medicaux
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>A propos de l&apos;application</CardTitle>
          <CardDescription>
            Linkuup Medical est un CRM specialise pour les equipes commerciales du secteur medical
          </CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            Cette application permet aux equipes de marketeurs de gerer efficacement leurs rendez-vous
            avec les professionnels de sante. Elle offre un suivi en temps reel des performances
            et facilite la coordination entre les differents acteurs.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Gestion des RDV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Creation et suivi des rendez-vous</li>
              <li>Statuts multiples (En attente, Confirme, Annule...)</li>
              <li>Association aux commerciaux</li>
              <li>Filtrage par date et agent</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Suivi des performances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Tableau de performance hebdomadaire</li>
              <li>Objectifs journaliers et hebdomadaires</li>
              <li>Visualisation par agent</li>
              <li>Totaux automatiques</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Gestion des utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>3 roles: Marketeur, Manager, Admin</li>
              <li>Statut en ligne/hors ligne</li>
              <li>Creation et modification des comptes</li>
              <li>Permissions par role</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Securite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Authentification securisee</li>
              <li>Protection des donnees (RLS)</li>
              <li>Acces controle par role</li>
              <li>Sessions securisees</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roles et permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-secondary">
              <h3 className="font-semibold mb-2">Marketeur</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Voir ses propres RDV</li>
                <li>Creer des RDV</li>
                <li>Consulter les details</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-primary/10">
              <h3 className="font-semibold mb-2">Manager</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Tout ce que fait le Marketeur</li>
                <li>Voir tous les RDV</li>
                <li>Tableau de performance</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-destructive/10">
              <h3 className="font-semibold mb-2">Admin</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Tout ce que fait le Manager</li>
                <li>Modifier/Supprimer les RDV</li>
                <li>Gerer les utilisateurs</li>
                <li>Export CSV</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>Version 2.0 - Construit avec Next.js, Supabase et shadcn/ui</p>
      </div>
    </div>
  )
}
