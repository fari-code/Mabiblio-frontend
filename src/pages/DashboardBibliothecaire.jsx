import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LivreModal from "../components/LivreModal"; // <--- COMPOSANT MODAL DE GESTION DES LIVRES
import api from "../api/axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

// ==========================================
// COMPOSANT : COMPTEUR ANIMÉ POUR LES KPI
// ==========================================
function AnimatedCounter({ value, duration = 1500 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * value));

      if (progress < 1) window.requestAnimationFrame(step);
      else setCount(value);
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function DashboardBibliothecaire() {
  const navigate = useNavigate();

  // État utilisateur dynamique (récupéré depuis le localStorage)
  const [user, setUser] = useState({
    prenom: "",
    nom: "",
    role: "BIBLIOTHECAIRE",
    email: "",
  });

  const [currentView, setCurrentView] = useState("demandes");
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // États pour le Modal Livre
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLivre, setEditingLivre] = useState(null);

  // Listes de données dynamiques depuis Laravel
  const [emprunts, setEmprunts] = useState([]);
  const [livres, setLivres] = useState([]);

  // Statistiques du tableau de bord
  const [stats, setStats] = useState({
    demandesAttente: 0,
    retoursSignales: 0,
    actionsTraittees: 0,
  });

  // ==========================================
  // CHARGEMENT INITIAL (Données admin & User)
  // ==========================================
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 1. Récupération des infos utilisateur stockées au login
        const storedUser = localStorage.getItem("user");
        if (storedUser && !ignore) {
          setUser(JSON.parse(storedUser));
        }

        // 2. Appel simultané à l'API Laravel pour les emprunts et les livres
        const [resEmprunts, resLivres] = await Promise.all([
          api.get("/emprunts"),
          api.get("/livres"),
        ]);

        if (!ignore) {
          const empruntsData = resEmprunts.data;
          const livresData = resLivres.data;

          setEmprunts(empruntsData);
          setLivres(livresData);

          // Calcul dynamique des statistiques
          const demandesAttente = empruntsData.filter(
            (e) => e.statut === "EN_ATTENTE",
          ).length;
          const retoursSignales = empruntsData.filter(
            (e) => e.statut === "RETOUR_SIGNALE",
          ).length;
          const actionsTraittees = empruntsData.filter((e) =>
            ["RETOURNE", "REFUSE"].includes(e.statut),
          ).length;

          setStats({
            demandesAttente,
            retoursSignales,
            actionsTraittees,
          });
        }
      } catch (err) {
        console.error(
          "Erreur lors du chargement des données administrateur",
          err,
        );
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  // ==========================================
  // ACTION : DÉCONNEXION SÉCURISÉE (Sanctum)
  // ==========================================
  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Erreur lors de la déconnexion du serveur :", err);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // ==========================================
  // CONFIGURATION DES GRAPHIQUES (Chart.js)
  // ==========================================
  const chartFont = { family: "Inter, sans-serif", size: 12, weight: 500 };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: chartFont,
          color: "#64748b",
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleFont: { ...chartFont, weight: 700 },
        bodyFont: chartFont,
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  const barChartData = {
    labels: [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
    ],
    datasets: [
      {
        label: "Emprunts mensuels",
        data: [4, 8, 12, 15, 9, 14, 20, 18, 25, 22],
        backgroundColor: "var(--color-primary)",
        hoverBackgroundColor: "var(--color-primary-hover)",
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const barChartOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9", drawBorder: false },
        ticks: { font: chartFont, color: "#94a3b8" },
      },
      x: {
        grid: { display: false },
        ticks: { font: chartFont, color: "#94a3b8" },
      },
    },
    plugins: { ...commonOptions.plugins, legend: { display: false } },
  };

  const doughnutData = {
    labels: ["Romans", "Informatique", "Classiques", "Jeunesse"],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: ["#1e3a8a", "#0ea5e9", "#8b5cf6", "#ec4899"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    ...commonOptions,
    cutout: "75%",
    plugins: {
      ...commonOptions.plugins,
      legend: {
        position: "bottom",
        labels: { ...commonOptions.plugins.legend.labels, padding: 15 },
      },
    },
  };

  // Re-fetch helper
  const refreshData = async () => {
    try {
      const [resEmprunts, resLivres] = await Promise.all([
        api.get("/emprunts"),
        api.get("/livres"),
      ]);
      const empruntsData = resEmprunts.data;
      setEmprunts(empruntsData);
      setLivres(resLivres.data);

      const demandesAttente = empruntsData.filter(
        (e) => e.statut === "EN_ATTENTE",
      ).length;
      const retoursSignales = empruntsData.filter(
        (e) => e.statut === "RETOUR_SIGNALE",
      ).length;
      const actionsTraittees = empruntsData.filter((e) =>
        ["RETOURNE", "REFUSE"].includes(e.statut),
      ).length;

      setStats({ demandesAttente, retoursSignales, actionsTraittees });
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // ACTIONS SUR LES EMPRUNTS (API Laravel)
  // ==========================================
  const handleValiderDemande = async (id) => {
    try {
      await api.patch(`/emprunts/${id}/valider`);
      refreshData();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Prêt validé",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (err) {
      Swal.fire(
        "Erreur",
        err.response?.data?.message || "Impossible de valider le prêt",
        "error",
      );
    }
  };

  const handleRefuserDemande = async (id) => {
    try {
      await api.patch(`/emprunts/${id}/refuser`);
      refreshData();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Demande refusée",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (err) {
      Swal.fire(
        "Erreur",
        err.response?.data?.message || "Impossible de refuser",
        "error",
      );
    }
  };

  const handleValiderRetour = async (id) => {
    try {
      await api.patch(`/emprunts/${id}/valider-retour`);
      refreshData();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Retour confirmé et livre libéré",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (err) {
      Swal.fire(
        "Erreur",
        err.response?.data?.message || "Impossible de valider le retour",
        "error",
      );
    }
  };

  // ==========================================
  // ACTIONS SUR LE CATALOGUE (API Laravel)
  // ==========================================
  const handleOpenModal = (livre = null) => {
    setEditingLivre(livre);
    setIsModalOpen(true);
  };

  const handleSaveLivre = async (formData) => {
    try {
      await api.post("/livres", formData);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Livre enregistré",
        showConfirmButton: false,
        timer: 3000,
      });
      setIsModalOpen(false);
      refreshData();
    } catch (err) {
      Swal.fire(
        "Erreur",
        err.response?.data?.message || "Erreur lors de l'enregistrement",
        "error",
      );
    }
  };

  const handleDesactiverLivre = (id, titre) => {
    Swal.fire({
      title: "Désactiver ce livre ?",
      html: `Le livre <b>${titre}</b> ne sera plus disponible pour de nouveaux emprunts.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Oui, désactiver",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/livres/${id}`);
          refreshData();
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Livre désactivé",
            showConfirmButton: false,
            timer: 3000,
          });
        } catch {
          Swal.fire("Erreur", "Impossible de désactiver ce livre", "error");
        }
      }
    });
  };

  const handleSaveParametres = () => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Paramètres mis à jour !",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-bg-base flex font-sans">
      {/* Overlay sombre pour mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR RESPONSIVE ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 h-screen bg-text-main text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:shrink-0 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Partie haute (défilable si l'écran est très petit) */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-md">
                <i className="fas fa-book-open text-lg" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">
                  Ma<span className="text-amber-500 font-logo">Biblio</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
                  Admin Console
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <i className="fas fa-times text-xl" />
            </button>
          </div>

          <nav className="p-4 space-y-1.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 mt-2">
              Principal
            </p>

            <button
              onClick={() => handleNavigation("demandes")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${currentView === "demandes" ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-800 text-slate-300"}`}
            >
              <i className="fas fa-tasks text-lg" /> Demandes & Retours
            </button>

            <button
              onClick={() => handleNavigation("catalogue")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${currentView === "catalogue" ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-800 text-slate-300"}`}
            >
              <i className="fas fa-book text-lg" /> Gestion Catalogue
            </button>

            <button
              onClick={() => handleNavigation("adherents")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${currentView === "adherents" ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-800 text-slate-300"}`}
            >
              <i className="fas fa-users text-lg" /> Comptes Adhérents
            </button>

            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-6 mb-2">
              Système
            </p>

            <button
              onClick={() => handleNavigation("parametres")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${currentView === "parametres" ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-800 text-slate-300"}`}
            >
              <i className="fas fa-sliders-h text-lg" /> Paramètres Prêt
            </button>
          </nav>
        </div>

        {/* Bouton de déconnexion : toujours visible en bas */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2.5 px-4 rounded-lg cursor-pointer transition-colors"
          >
            <i className="fas fa-sign-out-alt" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ================= ZONE PRINCIPALE ================= */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header Responsive */}
        <header className="h-20 bg-white border-b border-border px-4 sm:px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-text-muted hover:bg-bg-base hover:text-primary transition-colors"
            >
              <i className="fas fa-bars text-xl" />
            </button>

            <h1 className="text-lg sm:text-xl font-extrabold text-text-main tracking-tight truncate max-w-50 sm:max-w-none">
              {currentView === "demandes" && "Tableau de bord"}
              {currentView === "catalogue" && "Gestion du Catalogue"}
              {currentView === "adherents" && "Gestion des Comptes"}
              {currentView === "parametres" && "Paramètres du Système"}
            </h1>
          </div>

          <div
            className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0"
            title="En ligne"
          >
            <div className="w-full h-full rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center">
              {user.prenom ? user.prenom[0] : "M"}
              {user.nom ? user.nom[0] : "D"}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
        </header>

        {/* Corps Dynamique */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 overflow-x-hidden">
          {/* VUE 1 : DEMANDES & RETOURS */}
          {currentView === "demandes" && (
            <div className="space-y-6 sm:space-y-8">
              {/* Cartes KPI */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white p-6 rounded-2xl border border-border shadow-sm animate-pulse flex items-center justify-between"
                    >
                      <div className="space-y-3 w-full">
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-8 bg-gray-200 rounded w-1/3" />
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gray-200" />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between transition-all hover:shadow-md group">
                      <div>
                        <p className="text-[10px] sm:text-xs font-bold text-text-muted uppercase tracking-wider">
                          Demandes en attente
                        </p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-text-main mt-1">
                          <AnimatedCounter value={stats.demandesAttente} />
                        </p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg sm:text-xl group-hover:scale-110 transition-transform">
                        <i className="fas fa-hourglass-half" />
                      </div>
                    </div>

                    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between transition-all hover:shadow-md group">
                      <div>
                        <p className="text-[10px] sm:text-xs font-bold text-text-muted uppercase tracking-wider">
                          Retours signalés
                        </p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-text-main mt-1">
                          <AnimatedCounter value={stats.retoursSignales} />
                        </p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg sm:text-xl group-hover:scale-110 transition-transform">
                        <i className="fas fa-box-open" />
                      </div>
                    </div>

                    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between transition-all hover:shadow-md group">
                      <div>
                        <p className="text-[10px] sm:text-xs font-bold text-text-muted uppercase tracking-wider">
                          Total Actions
                        </p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-text-main mt-1">
                          <AnimatedCounter value={stats.actionsTraittees} />
                        </p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg sm:text-xl group-hover:scale-110 transition-transform">
                        <i className="fas fa-check-double" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Graphiques */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-3xl border border-border shadow-sm lg:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                      <i className="fas fa-chart-line text-primary text-lg" />{" "}
                      Statistiques des emprunts
                    </h3>
                  </div>
                  <div className="relative w-full h-62.5">
                    {isLoading ? (
                      <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl" />
                    ) : (
                      <Bar data={barChartData} options={barChartOptions} />
                    )}
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-3xl border border-border shadow-sm flex flex-col">
                  <h3 className="text-sm font-bold text-text-main mb-2 flex items-center gap-2">
                    <i className="fas fa-chart-pie text-primary text-lg" />{" "}
                    Répartition
                  </h3>
                  <div className="relative w-full flex-1 min-h-55 sm:min-h-50 flex items-center justify-center">
                    {isLoading ? (
                      <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-100 animate-pulse rounded-full" />
                    ) : (
                      <Doughnut data={doughnutData} options={doughnutOptions} />
                    )}
                  </div>
                </div>
              </div>

              {/* Tableau des Demandes & File d'attente */}
              <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h3 className="font-bold text-text-main flex items-center gap-2">
                    <i className="fas fa-list-check text-primary" /> File
                    d'attente
                  </h3>
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                    Temps réel
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-175">
                    <thead>
                      <tr className="bg-bg-base border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        <th className="py-4 px-4 sm:px-6">Adhérent</th>
                        <th className="py-4 px-4 sm:px-6">Livre demandé</th>
                        <th className="py-4 px-4 sm:px-6">Statut</th>
                        <th className="py-4 px-4 sm:px-6 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm text-text-main">
                      {emprunts.length > 0 ? (
                        emprunts.map((emp) => (
                          <tr
                            key={emp.id}
                            className="hover:bg-bg-base transition-colors group"
                          >
                            <td className="py-4 px-4 sm:px-6">
                              <div className="font-bold text-text-main group-hover:text-primary transition-colors whitespace-nowrap">
                                {emp.user
                                  ? `${emp.user.prenom} ${emp.user.nom}`
                                  : emp.adherent || "Utilisateur"}
                              </div>
                              <div className="text-xs text-text-muted font-mono mt-0.5">
                                {emp.user?.numero_carte ||
                                  emp.numero_carte ||
                                  "ADH-000"}
                              </div>
                            </td>

                            <td className="py-4 px-4 sm:px-6">
                              <div className="font-semibold">
                                {emp.livre?.titre || emp.titre}
                              </div>
                              <div className="text-xs text-text-muted font-mono mt-0.5">
                                ISBN : {emp.livre?.isbn || emp.isbn}
                              </div>
                            </td>

                            <td className="py-4 px-4 sm:px-6">
                              {emp.statut === "EN_ATTENTE" && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
                                  <i className="fas fa-clock" /> En attente
                                </span>
                              )}
                              {emp.statut === "RETOUR_SIGNALE" && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 whitespace-nowrap">
                                  <i className="fas fa-box" /> Retour signalé
                                </span>
                              )}
                              {emp.statut === "EN_COURS" && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                                  <i className="fas fa-book-open" /> En cours
                                </span>
                              )}
                              {emp.statut === "RETOURNE" && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                                  <i className="fas fa-check-circle" /> Retourné
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-4 sm:px-6">
                              <div className="flex flex-col sm:flex-row justify-end gap-2">
                                {emp.statut === "EN_ATTENTE" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleValiderDemande(emp.id)
                                      }
                                      className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                                    >
                                      <i className="fas fa-check" /> Valider
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleRefuserDemande(emp.id)
                                      }
                                      className="inline-flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                                    >
                                      <i className="fas fa-times" /> Refuser
                                    </button>
                                  </>
                                )}

                                {emp.statut === "RETOUR_SIGNALE" && (
                                  <button
                                    onClick={() => handleValiderRetour(emp.id)}
                                    className="inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                                  >
                                    <i className="fas fa-check-double" />{" "}
                                    Confirmer retour
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-12 text-center text-slate-400 text-xs"
                          >
                            Aucune demande ou signalement en cours.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VUE 2 : CATALOGUE */}
          {currentView === "catalogue" && (
            <div className="bg-white rounded-3xl border border-border shadow-sm p-4 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-text-main">
                    Catalogue des Ouvrages
                  </h3>
                  <p className="text-sm text-text-muted">
                    Gérez l'ensemble des livres enregistrés dans la
                    bibliothèque.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenModal(null)}
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 w-full sm:w-auto"
                >
                  <i className="fas fa-plus" /> Ajouter un livre
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {livres.map((l) => (
                  <div
                    key={l.id}
                    className="bg-bg-base border border-border p-5 rounded-2xl flex flex-col justify-between group hover:border-primary/50 transition-colors"
                  >
                    <div>
                      <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-lg">
                        {l.categorie || "Non classé"}
                      </span>
                      <h4 className="font-bold text-text-main mt-3 group-hover:text-primary transition-colors">
                        {l.titre}
                      </h4>
                      <p className="text-sm text-text-muted">{l.auteur}</p>
                      <p className="text-xs text-text-muted font-mono mt-2">
                        ISBN : {l.isbn}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                      {l.actif !== false ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />{" "}
                          Actif
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />{" "}
                          Inactif
                        </span>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleDesactiverLivre(l.id, l.titre)}
                          className="text-xs text-rose-600 font-bold hover:underline"
                        >
                          Désactiver
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VUE 3 : PARAMÈTRES */}
          {currentView === "parametres" && (
            <div className="bg-white rounded-3xl border border-border shadow-sm p-6 sm:p-8 max-w-lg space-y-6">
              <div>
                <h3 className="text-lg font-bold text-text-main">
                  Paramètres Généraux
                </h3>
                <p className="text-sm text-text-muted">
                  Durée par défaut des prêts (21 jours par défaut).
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Durée de prêt (jours)
                  </label>
                  <input
                    type="number"
                    defaultValue={21}
                    className="w-full px-4 py-3 bg-bg-base border border-border rounded-xl text-sm font-bold text-text-main focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleSaveParametres}
                  className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold shadow-md active:scale-95 transition-all"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          )}

          {/* VUE 4 : COMPTES ADHÉRENTS */}
          {currentView === "adherents" && (
            <div className="bg-white rounded-3xl border border-border shadow-sm p-6 sm:p-8 text-center py-16 sm:py-20 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-bg-base rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-users text-2xl text-text-muted opacity-50" />
              </div>
              <h3 className="text-lg font-bold text-text-main">
                Gestion des comptes adhérents
              </h3>
              <p className="text-sm text-text-muted mt-1 max-w-sm">
                Module de consultation et de gestion des cartes d'adhérents de
                la bibliothèque.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* MODAL DE GESTION DU LIVRE : monté uniquement quand il est ouvert */}
      {isModalOpen && (
        <LivreModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSaveLivre}
          initialData={editingLivre}
        />
      )}
    </div>
  );
}
