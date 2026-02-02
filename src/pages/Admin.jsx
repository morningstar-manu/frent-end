import React from "react";
import { Link } from "react-router-dom";
import { AppointmentAllList } from "../appointments/AppointmentAllList";
import {
  HiUsers,
  HiCalendar,
  HiClipboardCheck,
  HiTrendingUp,
  HiCog,
  HiChartBar,
  HiArrowRight,
} from "react-icons/hi";

export default function AdminPage() {
  const quickActions = [
    {
      title: "Gerer les utilisateurs",
      description: "Ajouter, modifier ou supprimer des utilisateurs",
      icon: HiUsers,
      link: "../users",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Statistiques",
      description: "Voir les performances globales",
      icon: HiChartBar,
      link: "#",
      color: "bg-success/10 text-success",
    },
    {
      title: "Parametres",
      description: "Configurer l'application",
      icon: HiCog,
      link: "#",
      color: "bg-warning/10 text-warning",
    },
  ];

  const statsCards = [
    {
      title: "Total Rendez-vous",
      value: "-",
      change: "+12%",
      icon: HiCalendar,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Taux de Confirmation",
      value: "-",
      change: "+5%",
      icon: HiClipboardCheck,
      color: "bg-success/10 text-success",
    },
    {
      title: "Agents Actifs",
      value: "-",
      change: "0",
      icon: HiUsers,
      color: "bg-accent/10 text-accent",
    },
    {
      title: "Performance",
      value: "-",
      change: "+8%",
      icon: HiTrendingUp,
      color: "bg-warning/10 text-warning",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Tableau de bord Admin
          </h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble de l'activite et gestion globale
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="card p-5 hover:shadow-card transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-success mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="card p-5 hover:shadow-card transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                    {action.title}
                    <HiArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Appointments Table */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              Tous les Rendez-vous
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Liste complete de tous les rendez-vous de la plateforme
            </p>
          </div>
          <AppointmentAllList />
        </div>
      </div>
    </div>
  );
}
