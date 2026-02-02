import React, { useState } from "react";
import { AppointmentList } from "../appointments/AppointmentList";
import { Button, Modal } from "flowbite-react";
import { AppointmentAdd } from "../appointments/AppointmentAdd";
import { useSelector } from "react-redux";
import {
  HiPlus,
  HiCalendar,
  HiClock,
  HiCheckCircle,
  HiTrendingUp,
} from "react-icons/hi";

export default function HomePage() {
  const [openModal, setOpenModal] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const user = useSelector((state) => state.auth?.user);

  const handleClose = () => {
    setRefreshList((prevState) => !prevState);
    setOpenModal(false);
  };

  // Stats cards data
  const statsCards = [
    {
      title: "Aujourd'hui",
      value: "-",
      icon: HiCalendar,
      color: "bg-primary/10 text-primary",
      description: "Rendez-vous du jour",
    },
    {
      title: "En attente",
      value: "-",
      icon: HiClock,
      color: "bg-warning/10 text-warning",
      description: "A confirmer",
    },
    {
      title: "Confirmes",
      value: "-",
      icon: HiCheckCircle,
      color: "bg-success/10 text-success",
      description: "Ce mois",
    },
    {
      title: "Performance",
      value: "-",
      icon: HiTrendingUp,
      color: "bg-accent/10 text-accent",
      description: "Cette semaine",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container animate-fade-in">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">
                Bonjour, {user?.firstName || "Agent"} !
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerez vos rendez-vous medicaux en toute simplicite.
              </p>
            </div>
            <Button
              onClick={() => setOpenModal(true)}
              className="btn-primary flex items-center gap-2 shadow-soft hover:shadow-md transition-all"
            >
              <HiPlus className="w-5 h-5" />
              Nouveau Rendez-vous
            </Button>
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

        {/* Main Content */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              Mes Rendez-vous
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Liste de tous vos rendez-vous programmes
            </p>
          </div>
          <AppointmentList refreshList={refreshList} />
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        size="xl"
        className="animate-fade-in"
      >
        <Modal.Header className="border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <HiCalendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Nouveau Rendez-vous
              </h3>
              <p className="text-sm text-muted-foreground">
                Remplissez les informations du patient
              </p>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="p-6">
          <AppointmentAdd closeModal={handleClose} />
        </Modal.Body>
      </Modal>
    </div>
  );
}
