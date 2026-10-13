import { useState, useEffect } from 'react';

export default function DashboardAdherent() {
  const [user] = useState({
    prenom: 'Koffi',
    nom: 'Mensah',
    role: 'ADHERENT',
    numero_carte: 'ADH-2026-001',
    email: 'koffi.mensah@biblio.bj'
  });

  // Statistiques avec effet d'incrémentation au chargement
  const [stats, setStats] = useState({
    actifs: 0,
    enCours: 0,
    enAttente: 0,
    retournes: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        actifs: 2,
        enCours: 1,
        enAttente: 1,
        retournes: 3
      });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const [emprunts, setEmprunts] = useState([
    { id: 1, titre: 'L\'Étranger', auteur: 'Albert Camus', categorie: 'Roman', statut: 'EN_COURS', date_demande: '2026-10-01', date_retour_prevue: '2026-10-22' },
    { id: 2, titre: 'Algorithmique en Python', auteur: 'Thibault Demongodin', categorie: 'Informatique', statut: 'EN_ATTENTE', date_demande: '2026-10-10', date_retour_prevue: null },
    { id: 3, titre: 'Le Petit Prince', auteur: 'Antoine de Saint-Exupéry', categorie: 'Jeunesse', statut: 'RETOUR_SIGNALE', date_demande: '2026-09-15', date_retour_prevue: '2026-10-06' },
    { id: 4, titre: 'Les Misérables', auteur: 'Victor Hugo', categorie: 'Classique', statut: 'RETOURNE', date_demande: '2026-09-01', date_retour_prevue: '2026-09-22' }
  ]);

  const [filtreStatut, setFiltreStatut] = useState('TOUS');

  const empruntsFiltres = emprunts.filter(emp => {
    if (filtreStatut === 'TOUS') return true;
    return emp.statut === filtreStatut;
  });

  const handleSignalRetour = (id) => {
    setEmprunts(emprunts.map(emp => emp.id === id ? { ...emp, statut: 'RETOUR_SIGNALE' } : emp));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Navbar personnalisée avec le widget profil épuré */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white shadow-md font-bold text-lg">
              MB
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Ma<span className="text-amber-500">Biblio</span></span>
              <span className="block text-xs text-slate-500 font-medium">Espace Adhérent</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a href="/" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">
              Catalogue
            </a>

            {/* Profil utilisateur : avatar + point en ligne */}
            <div className="relative w-9 h-9" title="En ligne">
              <div className="w-full h-full rounded-full bg-primary text-white font-semibold text-xs flex items-center justify-center">
                {user.prenom[0]}{user.nom[0]}
              </div>
              <span
                className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"
                aria-hidden="true"
              ></span>
              <span className="sr-only">{user.prenom} {user.nom}, en ligne</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* En-tête du Dashboard Adhérent */}
        <div className="bg-gradient-to-r from-primary to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
              {user.prenom[0]}{user.nom[0]}
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-medium border border-white/15 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Carte N° {user.numero_carte}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Bonjour, {user.prenom} {user.nom}
              </h1>
              <p className="text-blue-200 text-xs sm:text-sm">
                Suivez vos emprunts et gérez vos lectures en toute simplicité.
              </p>
            </div>
          </div>

          {/* Jauge de quota (Max 5 emprunts) */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl w-full md:w-auto">
            <div className="flex justify-between items-center mb-2 gap-4">
              <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider">Quota d'emprunts</span>
              <span className="text-sm font-bold text-white">{stats.actifs} / 5 max</span>
            </div>
            <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(stats.actifs / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Grille des KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Emprunts Actifs</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats.actifs}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shadow-inner">
              <i className='bx bx-book-bookmark'></i>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">En cours de lecture</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats.enCours}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-inner">
              <i className='bx bx-book-reader'></i>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">En attente validation</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats.enAttente}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shadow-inner">
              <i className='bx bx-time-five'></i>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Retournés</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats.retournes}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-inner">
              <i className='bx bx-check-shield'></i>
            </div>
          </div>
        </div>

        {/* Tableau des emprunts avec filtres et icônes */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <i className='bx bx-list-ul text-primary text-lg'></i> Historique et Suivi des Emprunts
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">Gérez vos demandes en cours et signalez le retour de vos livres.</p>
            </div>

            {/* Filtres par onglets */}
            <div className="flex bg-slate-100 p-1.5 rounded-xl text-xs font-semibold">
              <button 
                onClick={() => setFiltreStatut('TOUS')}
                className={`px-4 py-2 rounded-lg transition-all ${filtreStatut === 'TOUS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Tous
              </button>
              <button 
                onClick={() => setFiltreStatut('EN_COURS')}
                className={`px-4 py-2 rounded-lg transition-all ${filtreStatut === 'EN_COURS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                En cours
              </button>
              <button 
                onClick={() => setFiltreStatut('EN_ATTENTE')}
                className={`px-4 py-2 rounded-lg transition-all ${filtreStatut === 'EN_ATTENTE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                En attente
              </button>
              <button 
                onClick={() => setFiltreStatut('RETOURNE')}
                className={`px-4 py-2 rounded-lg transition-all ${filtreStatut === 'RETOURNE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Historique
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Ouvrage</th>
                  <th className="py-4 px-6">Catégorie</th>
                  <th className="py-4 px-6">Statut</th>
                  <th className="py-4 px-6">Date de demande</th>
                  <th className="py-4 px-6">Retour prévu</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {empruntsFiltres.length > 0 ? (
                  empruntsFiltres.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{emp.titre}</div>
                        <div className="text-xs text-slate-500">Par {emp.auteur}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {emp.categorie}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {emp.statut === 'EN_ATTENTE' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <i className='bx bx-time'></i> En attente de validation
                          </span>
                        )}
                        {emp.statut === 'EN_COURS' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <i className='bx bx-book-reader'></i> Emprunt en cours
                          </span>
                        )}
                        {emp.statut === 'RETOUR_SIGNALE' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            <i className='bx bx-package'></i> Retour signalé
                          </span>
                        )}
                        {emp.statut === 'RETOURNE' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <i className='bx bx-check-circle'></i> Retourné
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-mono text-xs">
                        {emp.date_demande}
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-mono text-xs">
                        {emp.date_retour_prevue || <span className="text-slate-300 italic">En attente validation</span>}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {emp.statut === 'EN_COURS' && (
                          <button
                            onClick={() => handleSignalRetour(emp.id)}
                            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm shadow-primary/20"
                          >
                            <i className='bx bx-undo text-base'></i> Signaler le retour
                          </button>
                        )}
                        {emp.statut === 'RETOUR_SIGNALE' && (
                          <span className="text-xs text-purple-600 font-medium bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
                            Validation en attente
                          </span>
                        )}
                        {['RETOURNE', 'REFUSE', 'EN_ATTENTE'].includes(emp.statut) && (
                          <span className="text-xs text-slate-400 font-medium">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 text-sm">
                      Aucun emprunt trouvé pour ce filtre.
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