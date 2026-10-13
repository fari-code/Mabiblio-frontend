import { useState, useEffect } from "react";
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

export default function DashboardBibliothecaire() {
  const [user] = useState({
    prenom: "Mariam",
    nom: "Diallo",
    role: "BIBLIOTHECAIRE",
    email: "mariam.diallo@biblio.bj",
  });

  const [currentView, setCurrentView] = useState("demandes");

  // Statistiques avec effet d'incrémentation au chargement
  const [stats, setStats] = useState({
    demandesAttente: 0,
    retoursSignales: 0,
    actionsTraittees: 0,
  });

  useEffect(() => {
    // Animation d'incrémentation fluide au chargement de la page
    const timer = setTimeout(() => {
      setStats({
        demandesAttente: 1,
        retoursSignales: 1,
        actionsTraittees: 12,
      });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const [emprunts, setEmprunts] = useState([
    {
      id: 1,
      adherent: "Koffi Mensah",
      numero_carte: "ADH-2026-001",
      titre: "Algorithmique en Python",
      isbn: "978-2035836946",
      statut: "EN_ATTENTE",
      date_demande: "2026-10-12",
    },
    {
      id: 2,
      adherent: "Awa Touré",
      numero_carte: "ADH-2026-002",
      titre: "L'Étranger",
      isbn: "978-2070360024",
      statut: "RETOUR_SIGNALE",
      date_demande: "2026-09-28",
    },
  ]);

  const [livres] = useState([
    {
      id: 1,
      isbn: "978-2070360024",
      titre: "L'Étranger",
      auteur: "Albert Camus",
      categorie: "Roman",
      actif: true,
    },
    {
      id: 2,
      isbn: "978-2070408504",
      titre: "Les Misérables",
      auteur: "Victor Hugo",
      categorie: "Classique",
      actif: true,
    },
    {
      id: 3,
      isbn: "978-2035836946",
      titre: "Algorithmique en Python",
      auteur: "Thibault Demongodin",
      categorie: "Informatique",
      actif: true,
    },
  ]);

  // Données pour les graphiques professionnels
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
        backgroundColor: "#1e3a8a",
        borderRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: ["Romans", "Informatique", "Classiques", "Jeunesse"],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: ["#1e3a8a", "#2563eb", "#059669", "#f59e0b"],
        borderWidth: 0,
      },
    ],
  };

  const handleValiderDemande = (id) => {
    setEmprunts(
      emprunts.map((e) => (e.id === id ? { ...e, statut: "EN_COURS" } : e)),
    );
  };

  const handleRefuserDemande = (id) => {
    setEmprunts(
      emprunts.map((e) => (e.id === id ? { ...e, statut: "REFUSE" } : e)),
    );
  };

  const handleValiderRetour = (id) => {
    setEmprunts(
      emprunts.map((e) => (e.id === id ? { ...e, statut: "RETOURNE" } : e)),
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* 1. SIDEBAR AVEC BOXICONS */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col justify-between hidden md:flex border-r border-slate-800">
        <div>
          <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-800/80">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-md font-bold text-lg">
              MB
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">
                Ma<span className="text-amber-400">Biblio</span>
              </span>
              <span className="block text-[11px] text-slate-400 font-medium tracking-wide uppercase">
                Admin Console
              </span>
            </div>
          </div>

          <nav className="p-4 space-y-1.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Principal
            </p>

            <button
              onClick={() => setCurrentView("demandes")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${currentView === "demandes" ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-800 text-slate-300"}`}
            >
              <i className="bx bx-task text-xl"></i>
              Demandes & Retours
            </button>

            <button
              onClick={() => setCurrentView("catalogue")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${currentView === "catalogue" ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-800 text-slate-300"}`}
            >
              <i className="bx bx-book-open text-xl"></i>
              Gestion Catalogue
            </button>

            <button
              onClick={() => setCurrentView("adherents")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${currentView === "adherents" ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-800 text-slate-300"}`}
            >
              <i className="bx bx-group text-xl"></i>
              Comptes Adhérents
            </button>

            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-6 mb-2">
              Système
            </p>
            <button
              onClick={() => setCurrentView("parametres")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${currentView === "parametres" ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-800 text-slate-300"}`}
            >
              <i className="bx bx-slider-alt text-xl"></i>
              Paramètres Prêt
            </button>
          </nav>
        </div>

        {/* Profil connecté en bas de sidebar */}
        <div className="p-4 border-t border-slate-800 m-4 bg-slate-950/40 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-sm">
                {user.prenom[0]}
                {user.nom[0]}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                {user.prenom} {user.nom}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Bibliothécaire
              </p>
            </div>
          </div>
          <button
            onClick={() => alert("Déconnexion")}
            className="text-slate-400 hover:text-rose-400 transition-colors"
          >
            <i className="bx bx-log-out text-xl"></i>
          </button>
        </div>
      </aside>

      {/* 2. ZONE PRINCIPALE */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header moderne avec Profil et indicateur vert */}
        <header className="h-20 bg-white border-b border-slate-200 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
              {currentView === "demandes" &&
                "Validation des Emprunts & Retours"}
              {currentView === "catalogue" && "Gestion du Catalogue"}
              {currentView === "adherents" && "Gestion des Comptes Adhérents"}
              {currentView === "parametres" && "Paramètres du Système"}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Widget Utilisateur Connecté avec pastille verte */}
            {/* Profil utilisateur : avatar + point en ligne */}
            <div className="relative w-12 h-12" title="En ligne">
              <div className="w-full h-full rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center">
                {user.prenom[0]}
                {user.nom[0]}
              </div>
              <span
                className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"
                aria-hidden="true"
              ></span>
              <span className="sr-only">
                {user.prenom} {user.nom}, en ligne
              </span>
            </div>
          </div>
        </header>

        {/* Corps dynamique */}
        <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
          {currentView === "demandes" && (
            <div className="space-y-6">
              {/* Cartes KPI avec chiffres incrémentés */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Demandes en attente
                    </p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1">
                      {stats.demandesAttente}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shadow-inner">
                    <i className="bx bx-time-five"></i>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Retours signalés
                    </p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1">
                      {stats.retoursSignales}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shadow-inner">
                    <i className="bx bx-package"></i>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Total Actions Traitées
                    </p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1">
                      {stats.actionsTraittees}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-inner">
                    <i className="bx bx-check-shield"></i>
                  </div>
                </div>
              </div>

              {/* Section Graphiques Professionnels */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm lg:col-span-2">
                  <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <i className="bx bx-bar-chart-alt-2 text-primary text-lg"></i>{" "}
                    Statistiques globales des emprunts
                  </h3>
                  <div className="h-64">
                    <Bar
                      data={barChartData}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <i className="bx bx-pie-chart-alt-2 text-primary text-lg"></i>{" "}
                    Répartition par Catégorie
                  </h3>
                  <div className="h-48 flex items-center justify-center">
                    <Doughnut
                      data={doughnutData}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </div>

              {/* Tableau principal avec icônes sur les boutons */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <i className="bx bx-list-check text-primary text-lg"></i>{" "}
                    File d'attente des requêtes adhérents
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    Temps réel
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-4 px-6">Adhérent & Carte</th>
                        <th className="py-4 px-6">Livre demandé</th>
                        <th className="py-4 px-6">Statut</th>
                        <th className="py-4 px-6 text-right">
                          Actions requises
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {emprunts.map((emp) => (
                        <tr
                          key={emp.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-900">
                              {emp.adherent}
                            </div>
                            <div className="text-xs text-slate-400 font-mono">
                              {emp.numero_carte}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-semibold text-slate-800">
                              {emp.titre}
                            </div>
                            <div className="text-xs text-slate-400 font-mono">
                              ISBN : {emp.isbn}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            {emp.statut === "EN_ATTENTE" && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                <i className="bx bx-time"></i> En attente
                                validation
                              </span>
                            )}
                            {emp.statut === "RETOUR_SIGNALE" && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                <i className="bx bx-package"></i> Retour signalé
                              </span>
                            )}
                            {emp.statut === "EN_COURS" && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                <i className="bx bx-check-circle"></i> Prêt en
                                cours
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            {emp.statut === "EN_ATTENTE" && (
                              <>
                                <button
                                  onClick={() => handleValiderDemande(emp.id)}
                                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
                                >
                                  <i className="bx bx-check text-base"></i>{" "}
                                  Valider prêt
                                </button>
                                <button
                                  onClick={() => handleRefuserDemande(emp.id)}
                                  className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
                                >
                                  <i className="bx bx-x text-base"></i> Refuser
                                </button>
                              </>
                            )}
                            {emp.statut === "RETOUR_SIGNALE" && (
                              <button
                                onClick={() => handleValiderRetour(emp.id)}
                                className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
                              >
                                <i className="bx bx-check-double text-base"></i>{" "}
                                Valider retour effectif
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentView === "catalogue" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Catalogue des Ouvrages
                  </h3>
                  <p className="text-sm text-slate-500">
                    Un ISBN correspond à un unique exemplaire physique.
                  </p>
                </div>
                <button
                  onClick={() => alert("Ouvrir modal ajout")}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md"
                >
                  <i className="bx bx-plus text-base"></i> Ajouter un livre
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {livres.map((l) => (
                  <div
                    key={l.id}
                    className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-semibold bg-blue-100 text-primary px-2.5 py-1 rounded-lg">
                        {l.categorie}
                      </span>
                      <h4 className="font-bold text-slate-900 mt-3">
                        {l.titre}
                      </h4>
                      <p className="text-sm text-slate-600">{l.auteur}</p>
                      <p className="text-xs text-slate-400 font-mono mt-2">
                        ISBN : {l.isbn}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-xs font-semibold text-emerald-600">
                        Actif
                      </span>
                      <button
                        onClick={() => alert("Désactivation logique")}
                        className="text-xs text-rose-600 font-semibold hover:underline"
                      >
                        Désactiver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView === "parametres" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 max-w-lg space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Paramètres Généraux
                </h3>
                <p className="text-sm text-slate-500">
                  Durée par défaut des prêts (21 jours par défaut).
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Durée de prêt (jours)
                  </label>
                  <input
                    type="number"
                    defaultValue={21}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => alert("Mis à jour !")}
                  className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold shadow-md"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          )}

          {currentView === "adherents" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 text-center py-16">
              <h3 className="text-lg font-bold text-slate-800">
                Gestion des comptes adhérents
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Interface de création et désactivation des cartes d'adhésion.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
