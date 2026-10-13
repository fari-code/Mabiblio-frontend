export default function Navbar({ user, onLogout }) {
  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo & Titre */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="w-11 h-11 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-white shadow-inner">
            {/* <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
            >
              <rect width="64" height="64" rx="15" fill="#154C6E" />

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

              <path
                d="M32 23V46"
                stroke="#5FA8DB"
                stroke-width="2"
                stroke-linecap="round"
              />

              <path
                d="M18 25C21 24 24 25 27 27M18 30C21 29 24 30 27 32M18 35C21 34 24 35 27 37"
                stroke="#5FA8DB"
                stroke-width="1.8"
                stroke-linecap="round"
              />

              <path
                d="M37 27C40 25 43 24 46 25M37 32C40 30 43 29 46 30M37 37C40 35 43 34 46 35"
                stroke="#5FA8DB"
                stroke-width="1.8"
                stroke-linecap="round"
              />

              <path
                d="M42 10H49V24L45.5 21L42 24V10Z"
                fill="#E8879F"
                stroke="#FFFFFF"
                stroke-width="1"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">
              Ma<span className="text-amber-400">Biblio</span>
            </span>
            {/* <span className="block text-xs text-blue-200 font-medium">
              Bibliothèque de quartier
            </span> */}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-4">
          <a
            href="/"
            className="text-sm font-medium text-blue-100 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
          >
            Catalogue
          </a>

          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                {user.prenom} ({user.role})
              </span>
              <button
                onClick={onLogout}
                className="text-sm font-medium bg-rose-500 hover:bg-rose-600 px-3 py-2 rounded-lg transition-colors shadow-sm"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Se connecter
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
