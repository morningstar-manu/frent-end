import { useDispatch } from "react-redux";
import { authActions } from "../_store";
import { Spinner } from "flowbite-react";
import { useForm } from "react-hook-form";
import { HiMail, HiLockClosed, HiArrowRight } from "react-icons/hi";

export default function SigninPage() {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({});

  const onSubmit = async ({ email, password }) => {
    try {
      await dispatch(authActions.signin({ email, password }));
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
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
            <span className="text-2xl font-bold text-white">
              Linkuup Medical
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight text-balance">
            Gerez vos rendez-vous medicaux en toute simplicite
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Une plateforme complete pour organiser, suivre et optimiser vos
            rendez-vous patients au quotidien.
          </p>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30"
                />
              ))}
            </div>
            <p className="text-white/80 text-sm">
              Rejoignez notre equipe d'agents
            </p>
          </div>
        </div>

        <div className="text-white/60 text-sm">
          &copy; {new Date().getFullYear()} Linkuup Medical. Tous droits
          reserves.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
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
            <span className="text-xl font-bold text-foreground">
              Linkuup Medical
            </span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">
              Bienvenue !
            </h2>
            <p className="text-muted-foreground mt-2">
              Connectez-vous pour acceder a votre espace
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <HiMail className="w-4 h-4 text-primary" />
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="off"
                placeholder="votre@email.com"
                className="input-field"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-xs text-destructive">
                  Ce champ est requis
                </span>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <HiLockClosed className="w-4 h-4 text-primary" />
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                autoComplete="off"
                placeholder="Entrez votre mot de passe"
                className="input-field"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <span className="text-xs text-destructive">
                  Ce champ est requis
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-base"
            >
              {isSubmitting ? (
                <Spinner size="sm" />
              ) : (
                <>
                  Se connecter
                  <HiArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Help */}
          <p className="text-center text-sm text-muted-foreground">
            Besoin d'aide ?{" "}
            <a href="#" className="text-primary hover:underline">
              Contactez l'administrateur
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
