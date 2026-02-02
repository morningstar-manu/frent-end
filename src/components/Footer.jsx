import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiHeart, HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";

export default function DefaultFooter() {
  const isLogged = useSelector((state) => state.auth?.isLogged);

  if (!isLogged) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <span className="text-lg font-bold text-foreground">
                  Linkuup
                </span>
                <span className="text-lg font-light text-primary">
                  {" "}
                  Medical
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Plateforme de gestion de rendez-vous medicaux. Simplifiez la prise
              de rendez-vous et optimisez votre planning quotidien.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  A propos
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Politique de confidentialite
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Conditions d'utilisation
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <HiMail className="w-4 h-4 text-primary" />
                contact@linkuup.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <HiPhone className="w-4 h-4 text-primary" />
                +212 5XX XXX XXX
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <HiLocationMarker className="w-4 h-4 text-primary" />
                Casablanca, Maroc
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Linkuup Medical. Tous droits reserves.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Fait avec <HiHeart className="w-4 h-4 text-destructive" /> au Maroc
          </p>
        </div>
      </div>
    </footer>
  );
}


