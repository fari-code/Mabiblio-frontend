import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";
// --- COMPOSANT : COMPTEUR ANIMÉ ---
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

export default function DashboardAdherent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [user] = useState({
    prenom: "Koffi",
    nom: "Mensah",
    role: "ADHERENT",
    numero_carte: "ADH-2026-001",
    email: "koffi.mensah@biblio.bj",
  });

  const [stats, setStats] = useState({
    actifs: 0,
    enCours: 0,
    enAttente: 0,
    retournes: 0,
  });

  const [emprunts, setEmprunts] = useState([
    {
      id: 1,
      titre: "L'Étranger",
      auteur: "Albert Camus",
      categorie: "Roman",
      statut: "EN_COURS",
      date_demande: "2026-10-01",
      date_retour_prevue: "2026-10-22",
    },
    {
      id: 2,
      titre: "Algorithmique en Python",
      auteur: "Thibault Demongodin",
      categorie: "Informatique",
      statut: "EN_ATTENTE",
      date_demande: "2026-10-10",
      date_retour_prevue: null,
    },
    {
      id: 3,
      titre: "Le Petit Prince",
      auteur: "Antoine de Saint-Exupéry",
      categorie: "Jeunesse",
      statut: "RETOUR_SIGNALE",
      date_demande: "2026-09-15",
      date_retour_prevue: "2026-10-06",
    },
    {
      id: 4,
      titre: "Les Misérables",
      auteur: "Victor Hugo",
      categorie: "Classique",
      statut: "RETOURNE",
      date_demande: "2026-09-01",
      date_retour_prevue: "2026-09-22",
    },
  ]);

  const [filtreStatut, setFiltreStatut] = useState("TOUS");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        actifs: 2,
        enCours: 1,
        enAttente: 1,
        retournes: 3,
      });
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const empruntsFiltres = emprunts.filter((emp) => {
    if (filtreStatut === "TOUS") return true;
    if (filtreStatut === "RETOURNE") {
      return ["RETOURNE", "RETOUR_SIGNALE"].includes(emp.statut);
    }
    return emp.statut === filtreStatut;
  });

  const handleSignalRetour = (id) => {
    setEmprunts((previousEmprunts) =>
      previousEmprunts.map((emp) =>
        emp.id === id ? { ...emp, statut: "RETOUR_SIGNALE" } : emp,
      ),
    );
  };

  // --- ACTION : DÉCONNEXION ---
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Se déconnecter ?",
      text: "Vous devrez vous reconnecter pour accéder à vos emprunts.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "var(--color-status-refuse)",
      cancelButtonColor: "#64748b",
      confirmButtonText:
        '<i class="fas fa-sign-out-alt"></i> Oui, me déconnecter',
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      // localStorage.removeItem("auth_token");
      // localStorage.removeItem("user");
      // navigate("/login");
          try {
      // 1. Appel à l'API Laravel pour invalider le token en base de données
      await api.post("/logout");
    } catch (error) {
      console.error("Erreur lors de la déconnexion du serveur :", error);
    } finally {
      // 2. Nettoyage du localStorage (suppression du token et des infos user)
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");

      // 3. Redirection immédiate vers la page de connexion
      navigate("/");
    }
    }
  };

  const tabs = [
    { key: "TOUS", label: "Tous" },
    { key: "EN_COURS", label: "En cours" },
    { key: "EN_ATTENTE", label: "En attente" },
    { key: "RETOURNE", label: "Historique" },
  ];

  return (
    <div className="min-h-screen bg-bg-base flex flex-col font-sans">
      {/* ================= HEADER RESPONSIVE ================= */}
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-primary rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <i className="fas fa-book-open text-lg sm:text-xl" />
            </div>

            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-text-main">
                Ma<span className="text-status-attente">Biblio</span>
              </span>
              <span className="block text-[10px] sm:text-xs text-text-muted font-medium">
                Espace Adhérent
              </span>
            </div>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary transition-colors"
            >
              <i className="fas fa-search" /> Catalogue
            </Link>

            <div className="flex items-center space-x-4 pl-6 border-l border-border">
              <div className="text-right">
                <p className="text-sm font-bold text-text-main">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-[10px] font-mono text-text-muted">
                  {user.numero_carte}
                </p>
              </div>

              <div className="relative group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  {user.prenom[0]}
                  {user.nom[0]}
                </div>
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-status-retourne border-2 border-white rounded-full"
                  title="En ligne"
                />
              </div>

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

          {/* Bouton menu mobile */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="md:hidden p-2 rounded-lg text-text-main hover:bg-bg-base transition-colors"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
          >
            <i
              className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-2xl`}
            />
          </button>
        </div>

        {/* Menu mobile */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-4 bg-white border-t border-border shadow-inner">
            {/* Profil mobile */}
            <div className="flex items-center space-x-4 px-2 py-2">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center">
                  {user.prenom[0]}
                  {user.nom[0]}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-status-retourne border-2 border-white rounded-full" />
              </div>

              <div>
                <p className="text-base font-bold text-text-main">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-xs font-mono text-text-muted">
                  Carte : {user.numero_carte}
                </p>
              </div>
            </div>

            {/* Liens mobile */}
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-text-main hover:bg-bg-base transition-colors"
              >
                <i className="fas fa-search text-text-muted w-5 text-center" />
                Catalogue
              </Link>

              <Link
                to="/adherent/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-primary/10 text-primary"
              >
                <i className="fas fa-book-open w-5 text-center" />
                Mes emprunts
              </Link>
            </div>

            {/* Déconnexion mobile */}
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ================= BANNIÈRE DE BIENVENUE ================= */}
        <div className="relative bg-text-main rounded-4xl p-6 sm:p-10 text-white shadow-2xl overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-primary rounded-full mix-blend-screen filter blur-[80px] opacity-60 pointer-events-none" />
          <div className="absolute bottom-[-50%] right-[10%] w-96 h-96 bg-[#0ea5e9] rounded-full mix-blend-screen filter blur-[80px] opacity-30 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 border-4 border-white/20 shadow-xl flex items-center justify-center text-white font-extrabold text-3xl backdrop-blur-sm shrink-0">
              {user.prenom[0]}
              {user.nom[0]}
            </div>

            <div className="pt-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-text-main text-xs font-bold shadow-sm mb-3">
                <i className="fas fa-id-card text-primary" />
                Carte N° {user.numero_carte}
              </span>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Bonjour, {user.prenom} {user.nom}
              </h1>

              <p className="text-slate-300 text-sm mt-2 max-w-md">
                Suivez vos emprunts et gérez vos lectures en toute simplicité.
              </p>
            </div>
          </div>

          <div className="relative z-10 w-full lg:w-80 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block mb-1">
                    Quota d&apos;emprunts
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

                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <i className="fas fa-layer-group text-white" />
                </div>
              </div>

              <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden shadow-inner">
                <div
                  className="bg-linear-to-r from-status-attente to-amber-300 h-full rounded-full transition-all duration-1000 ease-out relative"
                  style={{
                    width: isLoading
                      ? "0%"
                      : `${Math.min((stats.actifs / 5) * 100, 100)}%`,
                  }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px]" />
                </div>
              </div>

              <p className="text-[10px] text-slate-400 mt-3 text-right font-medium">
                Limite simultanée autorisée
              </p>
            </div>
          </div>
        </div>

        {/* ================= GRILLE DES KPI ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-border shadow-sm animate-pulse flex items-center justify-between"
              >
                <div className="space-y-3 w-full">
                  <div className="h-3 bg-gray-200 rounded-md w-2/3" />
                  <div className="h-8 bg-gray-200 rounded-md w-1/3" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-gray-200" />
              </div>
            ))
          ) : (
            <>
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                <div>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Emprunts actifs
                  </p>
                  <p className="text-3xl font-extrabold text-text-main mt-1">
                    <AnimatedCounter value={stats.actifs} />
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <i className="fas fa-book-bookmark" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                <div>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    En cours de lecture
                  </p>
                  <p className="text-3xl font-extrabold text-text-main mt-1">
                    <AnimatedCounter value={stats.enCours} />
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-status-cours/10 text-status-cours flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <i className="fas fa-book-open" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                <div>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    En attente
                  </p>
                  <p className="text-3xl font-extrabold text-text-main mt-1">
                    <AnimatedCounter value={stats.enAttente} />
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-status-attente/10 text-status-attente flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <i className="fas fa-hourglass-half" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                <div>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Total retournés
                  </p>
                  <p className="text-3xl font-extrabold text-text-main mt-1">
                    <AnimatedCounter value={stats.retournes} />
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-status-retourne/10 text-status-retourne flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <i className="fas fa-check-double" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* ================= TABLEAU DES EMPRUNTS ================= */}
        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                <i className="fas fa-list-ul text-primary" />
                Historique et suivi
              </h3>
              <p className="text-sm text-text-muted mt-1">
                Gérez vos demandes en cours et signalez le retour de vos livres.
              </p>
            </div>

            <div className="flex bg-bg-base p-1.5 rounded-xl text-xs font-bold w-full md:w-auto overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFiltreStatut(tab.key)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    filtreStatut === tab.key
                      ? "bg-white text-primary shadow-sm"
                      : "text-text-muted hover:text-text-main"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-200">
              <thead>
                <tr className="bg-bg-base border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  <th className="py-4 px-6">Ouvrage</th>
                  <th className="py-4 px-6">Catégorie</th>
                  <th className="py-4 px-6">Statut</th>
                  <th className="py-4 px-6">Date demande</th>
                  <th className="py-4 px-6">Retour prévu</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border text-sm text-text-main">
                {isLoading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-6 bg-gray-200 rounded-lg w-20" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-6 bg-gray-200 rounded-full w-28" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-200 rounded w-24" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-200 rounded w-24" />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="h-8 bg-gray-200 rounded-xl w-32 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : empruntsFiltres.length > 0 ? (
                  empruntsFiltres.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-bg-base transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="font-bold text-text-main group-hover:text-primary transition-colors">
                          {emp.titre}
                        </div>
                        <div className="text-xs text-text-muted mt-0.5">
                          Par {emp.auteur}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="text-xs font-semibold text-text-muted bg-bg-base border border-border px-2.5 py-1 rounded-lg">
                          {emp.categorie}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        {emp.statut === "EN_ATTENTE" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-status-attente/10 text-status-attente border border-status-attente/20">
                            <i className="fas fa-clock" /> En attente
                          </span>
                        )}

                        {emp.statut === "EN_COURS" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-status-cours/10 text-status-cours border border-status-cours/20">
                            <i className="fas fa-book-open" /> En cours
                          </span>
                        )}

                        {emp.statut === "RETOUR_SIGNALE" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-status-signale/10 text-status-signale border border-status-signale/20">
                            <i className="fas fa-box" /> Retour signalé
                          </span>
                        )}

                        {emp.statut === "RETOURNE" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-status-retourne/10 text-status-retourne border border-status-retourne/20">
                            <i className="fas fa-check-circle" /> Retourné
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-text-muted font-mono text-xs">
                        {emp.date_demande}
                      </td>

                      <td className="py-4 px-6 text-text-muted font-mono text-xs">
                        {emp.date_retour_prevue || (
                          <span className="text-text-muted italic opacity-60">
                            Non défini
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {emp.statut === "EN_COURS" && (
                          <button
                            type="button"
                            onClick={() => handleSignalRetour(emp.id)}
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md active:scale-95"
                          >
                            <i className="fas fa-undo" /> Signaler le retour
                          </button>
                        )}

                        {emp.statut === "RETOUR_SIGNALE" && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-status-signale font-bold bg-status-signale/10 px-3 py-2 rounded-lg border border-status-signale/20">
                            <i className="fas fa-spinner fa-spin" /> En attente
                          </span>
                        )}

                        {["RETOURNE", "REFUSE", "EN_ATTENTE"].includes(
                          emp.statut,
                        ) && (
                          <span className="text-xs text-text-muted font-medium opacity-50">
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-text-muted">
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
