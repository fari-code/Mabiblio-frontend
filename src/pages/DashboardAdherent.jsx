import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";

// Constante pour regrouper les statuts considérés comme "Historique / Retournés"
const STATUTS_RETOURNES = ["RETOURNE", "RETOUR_SIGNALE"];

// ==========================================
// 1. COMPOSANT : COMPTEUR ANIMÉ POUR LES KPI
// ==========================================
function AnimatedCounter({ value, duration = 1500 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrame;

    const step = (timestamp) => {
      if (startTimestamp === null) startTimestamp = timestamp;

      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    animationFrame = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}</span>;
}

// ==========================================
// 2. APPEL API PUR (Récupération des emprunts)
// ==========================================
const fetchMesEmprunts = async () => {
  const response = await api.get("/emprunts");
  return response.data;
};

// ==========================================
// 3. COMPOSANT PRINCIPAL : DASHBOARD ADHÉRENT
// ==========================================
export default function DashboardAdherent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // État dynamique pour l'utilisateur connecté (récupéré depuis le localStorage)
  const [user, setUser] = useState({
    prenom: "",
    nom: "",
    role: "",
    numero_carte: "",
    email: "",
  });

  const [emprunts, setEmprunts] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState("TOUS");

  // ==========================================
  // 4. STATISTIQUES DÉRIVÉES (Calcul dynamique des KPI)
  // ==========================================
  const stats = useMemo(() => {
    const enCours = emprunts.filter((e) => e.statut === "EN_COURS").length;
    const enAttente = emprunts.filter((e) => e.statut === "EN_ATTENTE").length;
    const retournes = emprunts.filter((e) => STATUTS_RETOURNES.includes(e.statut)).length;
    return {
      actifs: enCours + enAttente,
      enCours,
      enAttente,
      retournes,
    };
  }, [emprunts]);

  // ==========================================
  // 5. CHARGEMENT INITIAL (Utilisateur & Emprunts)
  // ==========================================
  useEffect(() => {
    let ignore = false;

    const chargerDonnees = async () => {
      try {
        // Chargement des infos de l'utilisateur stockées lors du login
        const storedUser = localStorage.getItem("user");
        if (storedUser && !ignore) {
          setUser(JSON.parse(storedUser));
        }

        // Chargement des emprunts depuis l'API Laravel
        const data = await fetchMesEmprunts();
        if (!ignore) setEmprunts(data);
      } catch (error) {
        console.error("Erreur lors du chargement des données", error);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    chargerDonnees();

    return () => {
      ignore = true;
    };
  }, []);

  // ==========================================
  // 6. RAFRAÎCHISSEMENT MANUEL DES EMPRUNTS
  // ==========================================
  const rafraichirEmprunts = async () => {
    try {
      setEmprunts(await fetchMesEmprunts());
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des emprunts", error);
    }
  };

  // ==========================================
  // 7. FILTRAGE DES EMPRUNTS SELON L'ONGLET ACTIF
  // ==========================================
  const empruntsFiltres = emprunts.filter((emp) => {
    if (filtreStatut === "TOUS") return true;
    if (filtreStatut === "RETOURNE") {
      return STATUTS_RETOURNES.includes(emp.statut);
    }
    return emp.statut === filtreStatut;
  });

  // ==========================================
  // 8. ACTION : SIGNALER LE RETOUR D'UN LIVRE
  // ==========================================
  const handleSignalRetour = async (id) => {
    try {
      await api.patch(`/emprunts/${id}/signaler-retour`);
      await rafraichirEmprunts();
      Swal.fire({
        icon: 'success',
        title: 'Retour signalé',
        text: 'Le bibliothécaire va valider la réception.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors du signalement");
    }
  };

  // ==========================================
  // 9. ACTION : DÉCONNEXION SÉCURISÉE (Sanctum)
  // ==========================================
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Se déconnecter ?",
      text: "Vous devrez vous reconnecter pour accéder à vos emprunts.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: '<i class="fas fa-sign-out-alt"></i> Oui, me déconnecter',
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        // Invalidation du token côté Laravel
        await api.post("/logout");
      } catch (error) {
        console.error("Erreur lors de la déconnexion du serveur :", error);
      } finally {
        // Nettoyage du stockage local et redirection
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        navigate("/");
      }
    }
  };

  // Onglets de filtrage du tableau
  const tabs = [
    { key: "TOUS", label: "Tous" },
    { key: "EN_COURS", label: "En cours" },
    { key: "EN_ATTENTE", label: "En attente" },
    { key: "RETOURNE", label: "Historique" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* ================= HEADER RESPONSIVE ================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo MaBiblio */}
          <Link to="/" className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-900 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <i className="fas fa-book-open text-lg sm:text-xl" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                Ma<span className="text-amber-500">Biblio</span>
              </span>
              <span className="block text-[10px] sm:text-xs text-slate-500 font-medium">
                Espace Adhérent
              </span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-900 transition-colors">
              <i className="fas fa-search" /> Catalogue
            </Link>

            <div className="flex items-center space-x-4 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-[10px] font-mono text-slate-500">
                  {user.numero_carte}
                </p>
              </div>

              {/* Avatar Initiales */}
              <div className="relative group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-900/10 border border-blue-900/20 text-blue-900 font-bold text-sm flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-all">
                  {user.prenom ? user.prenom[0] : ''}{user.nom ? user.nom[0] : ''}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" title="En ligne" />
              </div>

              {/* Bouton déconnexion rapide */}
              <button
                type="button"
                onClick={handleLogout}
                className="ml-2 w-9 h-9 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                title="Déconnexion"
                aria-label="Se déconnecter"
              >
                <i className="fas fa-sign-out-alt" />
              </button>
            </div>
          </div>

          {/* Bouton Hamburger Menu Mobile */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="md:hidden p-2 rounded-lg text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Menu"
          >
            <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-2xl`} />
          </button>
        </div>

        {/* Menu Mobile déroulant */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-4 pt-2 pb-6 space-y-4 bg-white border-t border-slate-200 shadow-inner">
            <div className="flex items-center space-x-4 px-2 py-2">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-blue-900 text-white font-bold text-lg flex items-center justify-center">
                  {user.prenom ? user.prenom[0] : ''}{user.nom ? user.nom[0] : ''}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-xs font-mono text-slate-500">
                  Carte : {user.numero_carte}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-900 hover:bg-slate-100 transition-colors">
                <i className="fas fa-search text-slate-500 w-5 text-center" /> Catalogue
              </Link>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
              >
                <i className="fas fa-sign-out-alt" /> Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================= CONTENU PRINCIPAL ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Bannière de Bienvenue & Quota */}
        <div className="relative bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 border-4 border-white/20 shadow-xl flex items-center justify-center text-white font-extrabold text-3xl backdrop-blur-sm shrink-0">
              {user.prenom ? user.prenom[0] : ''}{user.nom ? user.nom[0] : ''}
            </div>

            <div className="pt-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-slate-900 text-xs font-bold shadow-sm mb-3">
                <i className="fas fa-id-card text-blue-900" />
                Carte N° {user.numero_carte || '---'}
              </span>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Bonjour, {user.prenom} {user.nom}
              </h1>

              <p className="text-slate-300 text-sm mt-2 max-w-md">
                Suivez vos emprunts et gérez vos lectures en toute simplicité.
              </p>
            </div>
          </div>

          {/* Jauge du Quota d'emprunts (Max 5) */}
          <div className="relative z-10 w-full lg:w-80 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block mb-1">
                    Quota d'emprunts
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">
                      {isLoading ? "-" : stats.actifs}
                    </span>
                    <span className="text-sm font-medium text-slate-400">
                      / 5 max
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden shadow-inner">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-1000 ease-out relative"
                  style={{
                    width: isLoading ? "0%" : `${Math.min((stats.actifs / 5) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grille des KPI (Indicateurs clés de performance) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emprunts actifs</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">
                <AnimatedCounter value={stats.actifs} />
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center text-xl">
              <i className="fas fa-book-bookmark" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">En cours de lecture</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">
                <AnimatedCounter value={stats.enCours} />
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
              <i className="fas fa-book-open" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">En attente</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">
                <AnimatedCounter value={stats.enAttente} />
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
              <i className="fas fa-hourglass-half" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total retournés</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">
                <AnimatedCounter value={stats.retournes} />
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
              <i className="fas fa-check-double" />
            </div>
          </div>
        </div>

        {/* ================= TABLEAU DES EMPRUNTS ET HISTORIQUE ================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* En-tête du tableau et onglets de filtrage */}
          <div className="p-6 sm:p-8 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <i className="fas fa-list-ul text-blue-900" /> Historique et suivi
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Gérez vos demandes en cours et signalez le retour de vos livres.
              </p>
            </div>

            <div className="flex bg-slate-100 p-1.5 rounded-xl text-xs font-bold w-full md:w-auto overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFiltreStatut(tab.key)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    filtreStatut === tab.key
                      ? "bg-white text-blue-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Corps du tableau */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-175">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Ouvrage</th>
                  <th className="py-4 px-6">Catégorie</th>
                  <th className="py-4 px-6">Statut</th>
                  <th className="py-4 px-6">Date demande</th>
                  <th className="py-4 px-6">Retour prévu</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 text-sm text-slate-900">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Chargement des données...
                    </td>
                  </tr>
                ) : empruntsFiltres.length > 0 ? (
                  empruntsFiltres.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                      
                      {/* Titre et Auteur (via relation Eloquent 'livre') */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                          {emp.livre?.titre || emp.titre}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Par {emp.livre?.auteur || emp.auteur}
                        </div>
                      </td>

                      {/* Catégorie */}
                      <td className="py-4 px-6">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                          {emp.livre?.categorie || emp.categorie || 'Général'}
                        </span>
                      </td>

                      {/* Pastille de Statut en temps réel */}
                      <td className="py-4 px-6">
                        {emp.statut === "EN_ATTENTE" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <i className="fas fa-clock" /> En attente
                          </span>
                        )}

                        {emp.statut === "EN_COURS" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <i className="fas fa-book-open" /> En cours
                          </span>
                        )}

                        {emp.statut === "REFUSE" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200">
                            <i className="fas fa-times-circle" /> Refusé
                          </span>
                        )}

                        {emp.statut === "RETOUR_SIGNALE" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            <i className="fas fa-box" /> Retour signalé
                          </span>
                        )}

                        {emp.statut === "RETOURNE" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <i className="fas fa-check-circle" /> Retourné
                          </span>
                        )}
                      </td>

                      {/* Dates */}
                      <td className="py-4 px-6 text-slate-500 font-mono text-xs">
                        {emp.date_demande}
                      </td>

                      <td className="py-4 px-6 text-slate-500 font-mono text-xs">
                        {emp.date_retour_prevue || (
                          <span className="text-slate-400 italic">Non défini</span>
                        )}
                      </td>

                      {/* Actions contextuelles par ligne */}
                      <td className="py-4 px-6 text-right">
                        {emp.statut === "EN_COURS" && (
                          <button
                            type="button"
                            onClick={() => handleSignalRetour(emp.id)}
                            className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                          >
                            <i className="fas fa-undo" /> Signaler le retour
                          </button>
                        )}

                        {emp.statut === "RETOUR_SIGNALE" && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-purple-600 font-bold bg-purple-50 px-3 py-2 rounded-lg border border-purple-100">
                            <i className="fas fa-spinner fa-spin" /> En attente validation
                          </span>
                        )}

                        {["RETOURNE", "REFUSE", "EN_ATTENTE"].includes(emp.statut) && (
                          <span className="text-xs text-slate-400 font-medium">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <i className="fas fa-inbox text-4xl mb-3 opacity-30" />
                        <p className="text-sm font-medium">
                          Aucun emprunt trouvé pour ce filtre.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}