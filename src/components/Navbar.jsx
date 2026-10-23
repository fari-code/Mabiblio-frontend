import { useState } from "react";

export default function Navbar({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-primary/95 backdrop-blur-md text-white sticky top-0 z-50 shadow-lg border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          {/* ================= LOGO & TITRE ================= */}
          <a href="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-12 h-12 bg-white/10 group-hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-white shadow-inner transition-all duration-300 group-hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 64 64"
                fill="none"
                className="drop-shadow-md"
              >
                {/* J'ai retiré le fond bleu du SVG pour qu'il s'intègre mieux */}
                <path
                  d="M12 20C19 17 26 19 32 24C38 19 45 17 52 20V46C44 43 38 45 32 50C26 45 20 43 12 46V20Z"
                  fill="#0D354D"
                  opacity="0.35"
                />
                <path
                  d="M13 19C20 16 27 18 32 23V46C26 41 20 40 13 43V19Z"
                  fill="#FFFFFF"
                />
                <path
                  d="M32 23C37 18 44 16 51 19V43C44 40 38 41 32 46V23Z"
                  fill="#EAF4FA"
                />
                <path d="M32 23V46" stroke="#5FA8DB" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M18 25C21 24 24 25 27 27M18 30C21 29 24 30 27 32M18 35C21 34 24 35 27 37"
                  stroke="#5FA8DB"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M37 27C40 25 43 24 46 25M37 32C40 30 43 29 46 30M37 37C40 35 43 34 46 35"
                  stroke="#5FA8DB"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M42 10H49V24L45.5 21L42 24V10Z"
                  fill="#E8879F"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
                Ma
                <span className="text-status-attente font-logo">Biblio</span>
              </span>
            </div>
          </a>

          {/* ================= NAVIGATION DESKTOP ================= */}
          <nav className="hidden md:flex items-center space-x-1">
            <a href="/" className="text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-xl transition-all">
              Catalogue
            </a>
            {/* Tu pourras ajouter d'autres liens ici plus tard */}
          </nav>

          {/* ================= ACTIONS UTILISATEUR DESKTOP ================= */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Badge Profil Utilisateur */}
                <div className="flex items-center space-x-3 bg-white/10 border border-white/20 py-1.5 pl-1.5 pr-4 rounded-full">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center font-bold text-white text-sm shadow-inner">
                    {user.prenom?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-tight text-white">{user.prenom}</span>
                    <span className="text-[10px] uppercase tracking-wider text-white/70 font-medium leading-tight">
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="text-sm font-semibold bg-white/10 hover:bg-(--color-status-refuse) text-white px-4 py-2.5 rounded-xl transition-all shadow-sm border border-white/10 hover:border-transparent active:scale-95"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="text-sm font-bold bg-white text-primary hover:bg-gray-50 px-6 py-3 rounded-xl shadow-md hover:shadow-lg active:scale-95 hover:scale-110 transition-transform duration-300"
              >
                Se connecter
              </a>
            )}
          </div>

          {/* ================= BOUTON MENU MOBILE ================= */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors focus:outline-none"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ================= MENU MOBILE DÉROULANT ================= */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-3 bg-primary border-t border-white/10 shadow-inner">
          <a href="/" className="block text-sm font-semibold text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-colors">
            Catalogue
          </a>

          <div className="pt-2 border-t border-white/10">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-4 py-2">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold text-white">
                    {user.prenom?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{user.prenom}</div>
                    <div className="text-xs text-white/70 uppercase">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full text-center text-sm font-semibold bg-(--color-status-refuse) text-white px-4 py-3 rounded-xl transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="block w-full text-center text-sm font-bold bg-white text-primary px-4 py-3 rounded-xl transition-colors"
              >
                Se connecter
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
