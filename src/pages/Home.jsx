import Navbar from "../components/Navbar";
import { useState, useEffect, useRef } from "react";

// --- HOOK PERSONNALISÉ POUR LES ANIMATIONS AU SCROLL ---
function useInView(options = { threshold: 0.1 }) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [options]);

  return [ref, isInView];
}

// --- COMPOSANT CARTE LIVRE ---
function LivreCard({ livre, index }) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between group ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${(index % 4) * 100}ms` }}
    >
      <div>
        <div className="flex justify-between items-start gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-1.5 rounded-lg border border-[var(--color-primary)]/20">
            {livre.categorie || "Général"}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              livre.disponible
                ? "bg-[var(--color-status-retourne)]/10 text-[var(--color-status-retourne)] border-[var(--color-status-retourne)]/20"
                : "bg-[var(--color-status-refuse)]/10 text-[var(--color-status-refuse)] border-[var(--color-status-refuse)]/20"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${livre.disponible ? "bg-[var(--color-status-retourne)]" : "bg-[var(--color-status-refuse)]"}`}></span>
            {livre.disponible ? "Disponible" : "Indisponible"}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2" title={livre.titre}>
          {livre.titre}
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] mt-1.5 font-medium">
          {livre.auteur}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-3 font-mono bg-[var(--color-bg-base)] inline-block px-2 py-1 rounded">
          {livre.isbn}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
        <span className="text-[11px] text-[var(--color-text-muted)] font-medium">
          1 exemplaire
        </span>
        <button
          onClick={() => alert("Veuillez vous connecter pour demander un emprunt.")}
          disabled={!livre.disponible}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            livre.disponible
              ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] hover:shadow-md active:scale-95"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Emprunter
        </button>
      </div>
    </div>
  );
}

// --- COMPOSANT PRINCIPAL HOME ---
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [livres] = useState([
    { id: 1, isbn: "978-2070360024", titre: "L'Étranger", auteur: "Albert Camus", categorie: "Roman", disponible: true },
    { id: 2, isbn: "978-2070408504", titre: "Les Misérables", auteur: "Victor Hugo", categorie: "Classique", disponible: false },
    { id: 3, isbn: "978-2266154116", titre: "Le Petit Prince", auteur: "Antoine de Saint-Exupéry", categorie: "Jeunesse", disponible: true },
    { id: 4, isbn: "978-2035836946", titre: "Algorithmique en Python", auteur: "Thibault Demongodin", categorie: "Informatique", disponible: true },
    { id: 5, isbn: "978-2253004226", titre: "1984", auteur: "George Orwell", categorie: "Science-Fiction", disponible: true },
    { id: 6, isbn: "978-2070413119", titre: "Madame Bovary", auteur: "Gustave Flaubert", categorie: "Classique", disponible: false },
    { id: 7, isbn: "978-2226254102", titre: "Harry Potter à l'école des sorciers", auteur: "J.K. Rowling", categorie: "Jeunesse", disponible: true },
    { id: 8, isbn: "978-2070368228", titre: "La Peste", auteur: "Albert Camus", categorie: "Roman", disponible: true },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredLivres = livres.filter((livre) => {
    const matchesSearch =
      livre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livre.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livre.isbn.includes(searchTerm);
    const matchesCategory = selectedCategory === "" || livre.categorie === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] flex flex-col font-sans text-[var(--color-text-main)]">
      <Navbar user={null} />

      {/* ================= SECTION HERO ================= */}
      <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2000&auto=format&fit=crop"
            alt="Bibliothèque moderne"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/90 via-[var(--color-primary)]/70 to-[var(--color-bg-base)]"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-[-40px]">
          
          <div className="animate-fade-in-up delay-100">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg mb-4">
              Bienvenue à <span className="text-[var(--color-status-attente)]">MaBiblio</span>
            </h1>
          </div>

          <div className="animate-fade-in-up delay-200">
            <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto mb-8 drop-shadow">
              Explorez notre catalogue en ligne, recherchez vos ouvrages favoris et consultez leur disponibilité en temps réel.
            </p>
          </div>

          {/* --- BARRE DE RECHERCHE (Design d'origine revisité) --- */}
          <div className="animate-fade-in-up delay-300 max-w-2xl mx-auto pt-2">
            <div className="relative">
              {/* Icône */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-400 block"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
              </div>

              {/* Champ de recherche */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par titre, auteur ou ISBN..."
                className="w-full h-14 pl-12 pr-4 box-border bg-white text-gray-900 rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 text-sm sm:text-base placeholder-gray-400 transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTENU DU CATALOGUE ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-20">
        
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[var(--color-border)] mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold flex items-center gap-3 w-full sm:w-auto">
            <span className="bg-[var(--color-primary)] w-2 h-6 rounded-full inline-block"></span>
            Catalogue complet
            <span className="text-xs font-semibold bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1 rounded-full">
              {filteredLivres.length} livre{filteredLivres.length > 1 ? "s" : ""}
            </span>
          </h2>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto bg-[var(--color-bg-base)] border border-[var(--color-border)] text-[var(--color-text-main)] text-sm font-medium rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow cursor-pointer"
            >
              <option value="">Toutes les catégories</option>
              <option value="Roman">Roman</option>
              <option value="Classique">Classique</option>
              <option value="Jeunesse">Jeunesse</option>
              <option value="Informatique">Informatique</option>
              <option value="Science-Fiction">Science-Fiction</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[var(--color-border)] shadow-sm animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-5 bg-gray-200 rounded-md w-1/3"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded-md w-2/3 mb-8"></div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredLivres.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLivres.map((livre, index) => (
              <LivreCard key={livre.id} livre={livre} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-[var(--color-border)] shadow-sm">
            <div className="w-20 h-20 mx-auto bg-[var(--color-bg-base)] rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-main)]">Aucun résultat trouvé</h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-2 max-w-md mx-auto">
              Nous n'avons pas trouvé de livre correspondant à "{searchTerm}". Essayez de modifier vos critères de recherche.
            </p>
          </div>
        )}
      </main>

      {/* ================= FOOTER COMPLET ================= */}
      <footer className="bg-[#0f172a] text-white pt-16 pb-8 border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            {/* Colonne 1 : Présentation */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[var(--color-status-attente)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-xl font-bold">Ma<span className="text-[var(--color-status-attente)]">Biblio</span></span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Votre bibliothèque de quartier connectée. Empruntez, découvrez et partagez votre passion pour la lecture.
              </p>
              <div className="flex space-x-3 pt-2">
                <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-primary)] transition-colors">
                  <i className="fab fa-facebook-f text-gray-300 text-sm"></i>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-primary)] transition-colors">
                  <i className="fab fa-twitter text-gray-300 text-sm"></i>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-primary)] transition-colors">
                  <i className="fab fa-instagram text-gray-300 text-sm"></i>
                </a>
              </div>
            </div>

            {/* Colonne 2 : Liens rapides */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-chevron-right text-[10px] text-[var(--color-status-attente)]"></i> Accueil</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-chevron-right text-[10px] text-[var(--color-status-attente)]"></i> Catalogue</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-chevron-right text-[10px] text-[var(--color-status-attente)]"></i> Mes emprunts</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-chevron-right text-[10px] text-[var(--color-status-attente)]"></i> Se connecter</a></li>
              </ul>
            </div>

            {/* Colonne 3 : Contact */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-4">Contact</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <i className="fas fa-map-marker-alt mt-1 text-[var(--color-status-attente)]"></i>
                  <span>123 Rue de la Lecture<br />75000 Paris, France</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fas fa-phone-alt text-[var(--color-status-attente)]"></i>
                  <span>+33 1 23 45 67 89</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fas fa-envelope text-[var(--color-status-attente)]"></i>
                  <span>contact@mabiblio.fr</span>
                </li>
              </ul>
            </div>

            {/* Colonne 4 : Horaires */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-4">Horaires</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex justify-between border-b border-gray-800 pb-2">
                  <span>Lun - Ven</span>
                  <span className="text-white font-medium">09:00 - 19:00</span>
                </li>
                <li className="flex justify-between border-b border-gray-800 pb-2">
                  <span>Samedi</span>
                  <span className="text-white font-medium">10:00 - 18:00</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span>Dimanche</span>
                  <span className="text-[var(--color-status-refuse)] font-medium">Fermé</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} MaBiblio. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-xs text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">CGU</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}