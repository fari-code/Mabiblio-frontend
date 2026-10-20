import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- COMPOSANT : COMPTEUR ANIMÉ ---
// Permet de faire défiler les chiffres de 0 à la valeur cible
function AnimatedCounter({ value, duration = 1500 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // On arrondit à l'entier inférieur
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value); // Assure la valeur exacte à la fin
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function DashboardAdherent() {
  // --- ÉTAT DE CHARGEMENT (Skeleton) ---
  const [isLoading, setIsLoading] = useState(true);

  // --- DONNÉES UTILISATEUR ---
  const [user] = useState({
    prenom: 'Koffi',
    nom: 'Mensah',
    role: 'ADHERENT',
    numero_carte: 'ADH-2026-001',
    email: 'koffi.mensah@biblio.bj'
  });

  // --- STATISTIQUES ---
  const [stats, setStats] = useState({
    actifs: 0,
    enCours: 0,
    enAttente: 0,
    retournes: 0
  });

  // --- EMPRUNTS (Données de test) ---
  const [emprunts, setEmprunts] = useState([
    { id: 1, titre: 'L\'Étranger', auteur: 'Albert Camus', categorie: 'Roman', statut: 'EN_COURS', date_demande: '2026-10-01', date_retour_prevue: '2026-10-22' },
    { id: 2, titre: 'Algorithmique en Python', auteur: 'Thibault Demongodin', categorie: 'Informatique', statut: 'EN_ATTENTE', date_demande: '2026-10-10', date_retour_prevue: null },
    { id: 3, titre: 'Le Petit Prince', auteur: 'Antoine de Saint-Exupéry', categorie: 'Jeunesse', statut: 'RETOUR_SIGNALE', date_demande: '2026-09-15', date_retour_prevue: '2026-10-06' },
    { id: 4, titre: 'Les Misérables', auteur: 'Victor Hugo', categorie: 'Classique', statut: 'RETOURNE', date_demande: '2026-09-01', date_retour_prevue: '2026-09-22' }
  ]);

  const [filtreStatut, setFiltreStatut] = useState('TOUS');

  // --- SIMULATION DE L'APPEL API ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        actifs: 2,
        enCours: 1,
        enAttente: 1,
        retournes: 3
      });
      setIsLoading(false); // On arrête le chargement
    }, 800); // On simule 800ms de latence réseau
    return () => clearTimeout(timer);
  }, []);

  // Filtrage de la table
  const empruntsFiltres = emprunts.filter(emp => {
    if (filtreStatut === 'TOUS') return true;
    return emp.statut === filtreStatut;
  });

  // Action : Signaler le retour
  const handleSignalRetour = (id) => {
    setEmprunts(emprunts.map(emp => emp.id === id ? { ...emp, statut: 'RETOUR_SIGNALE' } : emp));
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] flex flex-col font-sans">
      
      {/* ================= HEADER DU DASHBOARD ================= */}
      <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <Link to="/" className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-11 h-11 bg-[var(--color-primary)] rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <i className="fas fa-book-open text-xl"></i>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[var(--color-text-main)]">
                Ma<span className="text-[var(--color-status-attente)]">Biblio</span>
              </span>
              <span className="block text-xs text-[var(--color-text-muted)] font-medium">Espace Adhérent</span>
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
              <i className="fas fa-search"></i> Catalogue
            </Link>

            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold text-sm flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                {user.prenom[0]}{user.nom[0]}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--color-status-retourne)] border-2 border-white rounded-full" title="En ligne"></span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ================= BANNIÈRE DE BIENVENUE ================= */}
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center space-x-5 relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl shadow-inner">
              {user.prenom[0]}{user.nom[0]}
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[var(--color-status-retourne)] text-xs font-bold border border-white/15 mb-2">
                <i className="fas fa-id-card"></i> Carte N° {user.numero_carte}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Bonjour, {user.prenom} {user.nom}
              </h1>
              <p className="text-blue-100 text-sm mt-1 max-w-md">
                Suivez vos emprunts et gérez vos lectures en toute simplicité.
              </p>
            </div>
          </div>

          {/* Jauge de quota */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-5 rounded-2xl w-full md:w-72 relative z-10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-blue-100 uppercase tracking-wider flex items-center gap-2">
                <i className="fas fa-layer-group"></i> Quota
              </span>
              <span className="text-sm font-extrabold text-white">
                {isLoading ? "-" : stats.actifs} / 5 max
              </span>
            </div>
            <div className="w-full bg-black/30 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[var(--color-status-attente)] h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: isLoading ? '0%' : `${(stats.actifs / 5) * 100}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-blue-200 mt-2 text-right">Emprunts simultanés autorisés</p>
          </div>
        </div>

        {/* ================= GRILLE DES KPI (STATISTIQUES) ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading ? (
            // --- SKELETON LOADER POUR LES CARTES ---
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-sm animate-pulse flex items-center justify-between">
                <div className="space-y-3 w-full">
                  <div className="h-3 bg-gray-200 rounded-md w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded-md w-1/3"></div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gray-200"></div>
              </div>
            ))
          ) : (
            // --- VRAIES DONNÉES AVEC COMPTEUR ANIMÉ ---
            <>
              <div className="bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                <div>
                  <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Emprunts Actifs</p>
                  <p className="text-3xl font-extrabold text-[var(--color-text-main)] mt-1">
                    <AnimatedCounter value={stats.actifs} />
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <i className="fas fa-book-bookmark"></i>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                <div>
                  <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">En cours de lecture</p>
                  <p className="text-3xl font-extrabold text-[var(--color-text-main)] mt-1">
                    <AnimatedCounter value={stats.enCours} />
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[var(--color-status-cours)]/10 text-[var(--color-status-cours)] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <i className="fas fa-book-open"></i>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                <div>
                  <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">En attente</p>
                  <p className="text-3xl font-extrabold text-[var(--color-text-main)] mt-1">
                    <AnimatedCounter value={stats.enAttente} />
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[var(--color-status-attente)]/10 text-[var(--color-status-attente)] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <i className="fas fa-hourglass-half"></i>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                <div>
                  <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Total Retournés</p>
                  <p className="text-3xl font-extrabold text-[var(--color-text-main)] mt-1">
                    <AnimatedCounter value={stats.retournes} />
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[var(--color-status-retourne)]/10 text-[var(--color-status-retourne)] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <i className="fas fa-check-double"></i>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ================= TABLEAU DES EMPRUNTS ================= */}
        <div className="bg-white rounded-3xl border border-[var(--color-border)] shadow-sm overflow-hidden">
          
          <div className="p-6 sm:p-8 border-b border-[var(--color-border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text-main)] flex items-center gap-2">
                <i className="fas fa-list-ul text-[var(--color-primary)]"></i> Historique et Suivi
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Gérez vos demandes en cours et signalez le retour de vos livres.</p>
            </div>

            <div className="flex bg-[var(--color-bg-base)] p-1.5 rounded-xl text-xs font-bold w-full md:w-auto overflow-x-auto">
              {[
                { key: 'TOUS', label: 'Tous' },
                { key: 'EN_COURS', label: 'En cours' },
                { key: 'EN_ATTENTE', label: 'En attente' },
                { key: 'RETOURNE', label: 'Historique' }
              ].map((tab) => (
                <button 
                  key={tab.key}
                  onClick={() => setFiltreStatut(tab.key)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    filtreStatut === tab.key 
                      ? 'bg-white text-[var(--color-primary)] shadow-sm' 
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[var(--color-bg-base)] border-b border-[var(--color-border)] text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  <th className="py-4 px-6">Ouvrage</th>
                  <th className="py-4 px-6">Catégorie</th>
                  <th className="py-4 px-6">Statut</th>
                  <th className="py-4 px-6">Date demande</th>
                  <th className="py-4 px-6">Retour prévu</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-sm text-[var(--color-text-main)]">
                
                {/* --- SKELETON LOADER POUR LE TABLEAU --- */}
                {isLoading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="py-4 px-6"><div className="h-6 bg-gray-200 rounded-lg w-20"></div></td>
                      <td className="py-4 px-6"><div className="h-6 bg-gray-200 rounded-full w-28"></div></td>
                      <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                      <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                      <td className="py-4 px-6 text-right"><div className="h-8 bg-gray-200 rounded-xl w-32 ml-auto"></div></td>
                    </tr>
                  ))
                ) : empruntsFiltres.length > 0 ? (
                  // --- VRAIES DONNÉES DU TABLEAU ---
                  empruntsFiltres.map((emp) => (
                    <tr key={emp.id} className="hover:bg-[var(--color-bg-base)] transition-colors group">
                      <td className="py-4 px-6">
                        <div className="font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                          {emp.titre}
                        </div>
                        <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Par {emp.auteur}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-semibold text-[var(--color-text-muted)] bg-[var(--color-bg-base)] border border-[var(--color-border)] px-2.5 py-1 rounded-lg">
                          {emp.categorie}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {emp.statut === 'EN_ATTENTE' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[var(--color-status-attente)]/10 text-[var(--color-status-attente)] border border-[var(--color-status-attente)]/20">
                            <i className="fas fa-clock"></i> En attente
                          </span>
                        )}
                        {emp.statut === 'EN_COURS' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[var(--color-status-cours)]/10 text-[var(--color-status-cours)] border border-[var(--color-status-cours)]/20">
                            <i className="fas fa-book-open"></i> En cours
                          </span>
                        )}
                        {emp.statut === 'RETOUR_SIGNALE' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[var(--color-status-signale)]/10 text-[var(--color-status-signale)] border border-[var(--color-status-signale)]/20">
                            <i className="fas fa-box"></i> Retour signalé
                          </span>
                        )}
                        {emp.statut === 'RETOURNE' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[var(--color-status-retourne)]/10 text-[var(--color-status-retourne)] border border-[var(--color-status-retourne)]/20">
                            <i className="fas fa-check-circle"></i> Retourné
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-[var(--color-text-muted)] font-mono text-xs">
                        {emp.date_demande}
                      </td>
                      <td className="py-4 px-6 text-[var(--color-text-muted)] font-mono text-xs">
                        {emp.date_retour_prevue || <span className="text-[var(--color-text-muted)] italic opacity-60">Non défini</span>}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {emp.statut === 'EN_COURS' && (
                          <button
                            onClick={() => handleSignalRetour(emp.id)}
                            className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md active:scale-95"
                          >
                            <i className="fas fa-undo"></i> Signaler le retour
                          </button>
                        )}
                        {emp.statut === 'RETOUR_SIGNALE' && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-status-signale)] font-bold bg-[var(--color-status-signale)]/10 px-3 py-2 rounded-lg border border-[var(--color-status-signale)]/20">
                            <i className="fas fa-spinner fa-spin"></i> En attente
                          </span>
                        )}
                        {['RETOURNE', 'REFUSE', 'EN_ATTENTE'].includes(emp.statut) && (
                          <span className="text-xs text-[var(--color-text-muted)] font-medium opacity-50">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-[var(--color-text-muted)]">
                        <i className="fas fa-inbox text-4xl mb-3 opacity-30"></i>
                        <p className="text-sm font-medium">Aucun emprunt trouvé pour ce filtre.</p>
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