import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", { email, password });

      localStorage.setItem("auth_token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.role === "BIBLIOTHECAIRE") {
        navigate("/admin/dashboard");
      } else {
        navigate("/adherent/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de la connexion.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* ================= PARTIE GAUCHE : ANIMATION 3D & PARTICULES ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--color-primary)] overflow-hidden">
        {/* Image de fond avec effet de zoom lent */}
        <img
          src="https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=1500&auto=format&fit=crop"
          alt="Bibliothèque moderne 3D"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay animate-slow-zoom"
        />

        {/* Dégradé pour la lisibilité et l'effet de profondeur */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)] via-[var(--color-primary)]/70 to-transparent"></div>

        {/* --- PARTICULES LUMINEUSES ANIMÉES (CSS) --- */}
        <div className="absolute inset-0 z-0">
          <div
            className="particle w-2 h-2 left-[10%] top-[80%]"
            style={{ animationDelay: "0s", animationDuration: "8s" }}
          ></div>
          <div
            className="particle w-3 h-3 left-[30%] top-[90%]"
            style={{ animationDelay: "2s", animationDuration: "10s" }}
          ></div>
          <div
            className="particle w-1.5 h-1.5 left-[50%] top-[70%]"
            style={{ animationDelay: "4s", animationDuration: "7s" }}
          ></div>
          <div
            className="particle w-2.5 h-2.5 left-[70%] top-[85%]"
            style={{ animationDelay: "1s", animationDuration: "9s" }}
          ></div>
          <div
            className="particle w-1 h-1 left-[85%] top-[60%]"
            style={{ animationDelay: "3s", animationDuration: "11s" }}
          ></div>
          <div
            className="particle w-2 h-2 left-[40%] top-[95%]"
            style={{ animationDelay: "5s", animationDuration: "8s" }}
          ></div>
        </div>

        {/* Contenu texte sur l'image (SANS le logo en haut) */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white w-full">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 animate-fade-in-up">
            L'accès à votre <br />
            <span className="text-[var(--color-status-attente)]">
              bibliothèque
            </span>{" "}
            <br />
            en toute sécurité.
          </h1>
          <p className="text-blue-100 text-lg max-w-md animate-fade-in-up delay-200">
            Connectez-vous pour gérer vos emprunts, découvrir de nouveaux
            ouvrages et explorer notre catalogue.
          </p>
        </div>
      </div>

      {/* ================= PARTIE DROITE : FORMULAIRE ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* En-tête mobile (Logo visible seulement sur petit écran) */}
          <div className="text-center lg:text-left">
            <Link
              to="/"
              className="inline-flex lg:hidden items-center space-x-2 mb-8 text-[var(--color-primary)]"
            >
              <span className="text-2xl font-extrabold tracking-tight">
                MaBiblio
              </span>
            </Link>

            <h2 className="text-3xl font-extrabold text-[var(--color-text-main)] tracking-tight">
              Bon retour !
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-2">
              Veuillez vous connecter à votre compte pour continuer.
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-[var(--color-status-refuse)]/10 border border-[var(--color-status-refuse)]/20 text-[var(--color-status-refuse)] text-sm px-4 py-3 rounded-xl flex items-center gap-2 animate-[fadeInUp_0.3s_ease-out]">
              <i className="fas fa-exclamation-triangle w-5 text-center"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Champ Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[var(--color-text-main)] mb-1.5"
              >
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@domaine.com"
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3.5 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[var(--color-text-main)]"
                >
                  Mot de passe
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Oublié ?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                  <i className="fas fa-lock text-lg"></i>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3.5 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all"
                />
                {/* Bouton Afficher/Masquer le mot de passe */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                  <i
                    className={`far ${showPassword ? "fa-eye-slash" : "fa-eye"} text-lg`}
                  ></i>
                </button>
              </div>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-[var(--color-primary)]/20 text-sm mt-4 active:scale-[0.98] flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Pied de page du formulaire */}
          <div className="text-center pt-6 border-t border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-text-muted)]">
              Pas encore de compte ?{" "}
              <span className="font-semibold text-[var(--color-text-main)]">
                Contactez le bibliothécaire
              </span>{" "}
              pour créer votre accès.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-4 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              <i className="fas fa-arrow-left"></i> Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
