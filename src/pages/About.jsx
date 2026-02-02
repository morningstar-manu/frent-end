import React from "react";
import { customHistory } from "../_helpers";
import {
  HiArrowLeft,
  HiCalendar,
  HiUsers,
  HiChartBar,
  HiShieldCheck,
  HiLightningBolt,
  HiClock,
} from "react-icons/hi";

const AboutPage = () => {
  const features = [
    {
      icon: HiCalendar,
      title: "Gestion des RDV",
      description:
        "Planifiez et organisez tous vos rendez-vous medicaux en un seul endroit.",
    },
    {
      icon: HiUsers,
      title: "Multi-utilisateurs",
      description:
        "Systeme de roles pour agents, managers et administrateurs.",
    },
    {
      icon: HiChartBar,
      title: "Statistiques",
      description:
        "Suivez les performances de votre equipe avec des tableaux de bord detailles.",
    },
    {
      icon: HiShieldCheck,
      title: "Securise",
      description: "Vos donnees sont protegees avec les meilleures pratiques de securite.",
    },
    {
      icon: HiLightningBolt,
      title: "Rapide",
      description:
        "Interface optimisee pour une utilisation fluide et efficace.",
    },
    {
      icon: HiClock,
      title: "Temps reel",
      description: "Synchronisation instantanee entre tous les utilisateurs.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container animate-fade-in">
        {/* Back Button */}
        <button
          onClick={() => customHistory.navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <HiArrowLeft className="w-5 h-5" />
          Retour
        </button>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            A propos de nous
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Simplifiez la gestion de vos rendez-vous medicaux
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Linkuup Medical est une plateforme moderne conçue pour aider les
            professionnels de sante a gerer efficacement leurs rendez-vous et
            suivre les performances de leur equipe.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card p-6 hover:shadow-card transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="card p-8 mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground mt-1">
                Rendez-vous geres
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">10+</p>
              <p className="text-sm text-muted-foreground mt-1">
                Agents actifs
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">98%</p>
              <p className="text-sm text-muted-foreground mt-1">Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground mt-1">Disponibilite</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Des questions ? Contactez notre equipe support.
          </p>
          <a
            href="mailto:contact@linkuup.com"
            className="btn-primary inline-flex items-center gap-2"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
