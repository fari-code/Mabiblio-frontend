import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import api from "../api/axios";

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
function LivreCard({ livre, index, onEmprunter }) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between group ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${(index % 4) * 100}ms` }}
    >
      <div>
        <div className="flex justify-between items-start gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1.5 rounded-lg border border-primary/20">
            {livre.categorie || "Général"}
          </span>

          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              livre.actif !== false
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${livre.actif !== false ? "bg-emerald-500" : "bg-rose-500"}`}></span>
            {livre.actif !== false ? "Disponible" : "Indisponible"}
          </span>
        </div>

        <h3 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors line-clamp-2" title={livre.titre}>
          {livre.titre}
        </h3>

        <p className="text-sm text-text-muted mt-1.5 font-medium">
          {livre.auteur}
        </p>

        <p className="text-xs text-text-muted mt-3 font-mono bg-bg-base inline-block px-2 py-1 rounded">
          ISBN : {livre.isbn}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-[11px] text-text-muted font-medium">
          Exemplaire physique
        </span>

        <button
          onClick={() => onEmprunter(livre)}
          disabled={livre.actif === false}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            livre.actif !== false
              ? "bg-primary text-white hover:bg-primary-hover hover:shadow-md active:scale-95 cursor-pointer"
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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [livres, setLivres] = useState([]);

  // Récupération de l'utilisateur connecté depuis le localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Chargement du catalogue depuis l'API Laravel
  useEffect(() => {
    const fetchCatalogue = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/livres");
        setLivres(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement du catalogue :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalogue();
  }, []);

  // Gestion de la demande d'emprunt
  const handleEmprunter = async (livre) => {
    // 1. Si non connecté
    if (!user) {
      Swal.fire({
        title: "Connexion requise",
        text: "Veuillez vous connecter en tant qu'adhérent pour demander un emprunt.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Se connecter",
        cancelButtonText: "Annuler",
        confirmButtonColor: "var(--color-primary)",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    // 2. Si c'est un bibliothécaire
    if (user.role === "BIBLIOTHECAIRE") {
      Swal.fire("Action non autorisée", "Les comptes administrateurs/bibliothécaires ne peuvent pas effectuer d'emprunts.", "warning");
      return;
    }

    // 3. Confirmation de l'emprunt
    const confirm = await Swal.fire({
      title: `Emprunter "${livre.titre}" ?`,
      text: "Une demande officielle sera transmise au bibliothécaire de permanence.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmer la demande",
      cancelButtonText: "Annuler",
      confirmButtonColor: "var(--color-primary)",
    });

    if (confirm.isConfirmed) {
      try {
        await api.post("/emprunts", { livre_id: livre.id });

        Swal.fire({
          icon: "success",
          title: "Demande enregistrée !",
          text: "Votre demande a été transmise avec succès.",
          timer: 2500,
          showConfirmButton: false,
        });

        // Redirection vers le dashboard adhérent
        navigate("/adherent/dashboard");
      } catch (error) {
        const message = error.response?.data?.message || "Une erreur est survenue lors de la demande.";
        Swal.fire("Impossible d'emprunter", message, "error");
      }
    }
  };

  const filteredLivres = livres.filter((livre) => {
    const matchesSearch =
      livre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livre.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livre.isbn.includes(searchTerm);

    const matchesCategory = selectedCategory === "" || livre.categorie === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-bg-base flex flex-col font-sans text-text-main">
      <Navbar user={user} />

      {/* ================= SECTION HERO ================= */}
      <section className="relative h-[65vh] min-h-125 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2000&auto=format&fit=crop"
            alt="Bibliothèque moderne"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-linear-to-b from-primary/90 via-primary/70 to-bg-base"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center -mt-10">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg mb-4">
              Bienvenue à <span className="text-status-attente font-logo">MaBiblio</span>
            </h1>
          </div>
          <div>
            <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto mb-8 drop-shadow">
              Explorez notre catalogue en ligne, recherchez vos ouvrages favoris et consultez leur disponibilité en temps réel.
            </p>
          </div>

          {/* --- BARRE DE RECHERCHE --- */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative">
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
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-border mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold flex items-center gap-3 w-full sm:w-auto">
            <span className="bg-primary w-2 h-6 rounded-full inline-block"></span>
            Catalogue complet
            <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
              {filteredLivres.length} livre{filteredLivres.length > 1 ? "s" : ""}
            </span>
          </h2>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto bg-bg-base border border-border text-text-main text-sm font-medium rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow cursor-pointer"
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
              <div key={i} className="bg-white rounded-2xl p-6 border border-border shadow-sm animate-pulse">
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
              <LivreCard key={livre.id} livre={livre} index={index} onEmprunter={handleEmprunter} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-border shadow-sm">
            <div className="w-20 h-20 mx-auto bg-bg-base rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-main">Aucun résultat trouvé</h3>
            <p className="text-sm text-text-muted mt-2 max-w-md mx-auto">
              Nous n'avons pas trouvé de livre correspondant à "{searchTerm}". Essayez de modifier vos critères de recherche.
            </p>
          </div>
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-text-main text-white pt-16 pb-8 border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-status-attente" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-xl font-bold">Ma<span className="text-status-attente">Biblio</span></span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Votre bibliothèque de quartier connectée. Empruntez, découvrez et partagez votre passion pour la lecture.
              </p>
               <div className="flex space-x-3 pt-2">

                <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">

                  <i className="fab fa-facebook-f text-gray-300 text-sm"></i>

                </a>

                <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">

                  <i className="fab fa-twitter text-gray-300 text-sm"></i>

                </a>

                <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">

                  <i className="fab fa-instagram text-gray-300 text-sm"></i>

                </a>

              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-chevron-right text-[10px] text-status-attente"></i> Accueil</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors flex items-center gap-2"><i className="fas fa-chevron-right text-[10px] text-status-attente"></i> Se connecter</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200 mb-4">Contact</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <i className="fas fa-map-marker-alt mt-1 text-status-attente"></i>
                  <span>123 Rue de la Lecture<br />Cotonou, Bénin</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fas fa-phone-alt text-status-attente"></i>
                  <span>+229 01 23 45 67</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fas fa-envelope text-status-attente"></i>
                  <span>contact@mabiblio.bj</span>
                </li>
              </ul>
            </div>

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
                  <span className="text-rose-500 font-medium">Fermé</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} MaBiblio. Tous droits réservés.
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