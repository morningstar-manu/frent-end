import React from "react";
import { customHistory } from "../_helpers";
import { HiShieldExclamation, HiArrowLeft, HiHome } from "react-icons/hi";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md animate-fade-in">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-8">
          <HiShieldExclamation className="w-12 h-12 text-destructive" />
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Acces refuse
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Vous n'avez pas les permissions necessaires pour acceder a cette page.
          Veuillez contacter votre administrateur si vous pensez qu'il s'agit
          d'une erreur.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => customHistory.navigate(-1)}
            className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <HiArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <Link
            to="/"
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <HiHome className="w-5 h-5" />
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
