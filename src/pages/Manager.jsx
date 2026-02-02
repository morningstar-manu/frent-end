import React from "react";
import { AppointmentWeek } from "../appointments/AppointmentWeek";
import { FullScreen } from "../utils/Fullscreen";
import { Clock } from "../utils/dateUtils";
import {
  HiUsers,
  HiCalendar,
  HiClock,
  HiChartBar,
  HiTrendingUp,
} from "react-icons/hi";

export default function ManagerPage() {
  const statsCards = [
    {
      title: "Agents",
      value: "-",
      icon: HiUsers,
      color: "bg-primary/10 text-primary",
      description: "Equipe active",
    },
    {
      title: "Cette semaine",
      value: "-",
      icon: HiCalendar,
      color: "bg-success/10 text-success",
      description: "Total RDV",
    },
    {
      title: "Moyenne/jour",
      value: "-",
      icon: HiChartBar,
      color: "bg-warning/10 text-warning",
      description: "RDV par agent",
    },
    {
      title: "Objectif",
      value: "15+",
      icon: HiTrendingUp,
      color: "bg-accent/10 text-accent",
      description: "Par semaine",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Espace Manager
            </h1>
            <p className="text-muted-foreground mt-1">
              Suivez les performances de votre equipe
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
              <HiClock className="w-5 h-5 text-primary" />
              <Clock />
            </div>
            <FullScreen>
              <span className="sr-only">Plein ecran</span>
            </FullScreen>
          </div>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Table */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              Performance Hebdomadaire
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Suivi des performances par agent
            </p>
          </div>
          <div className="p-6">
            <AppointmentWeek />
          </div>
        </div>
      </div>
    </div>
  );
}
