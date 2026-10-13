import Navbar from "../components/Navbar";
import { useState } from "react";
export default function Home() {
  // Données de test (mock) pour visualiser le design en attendant l'API Laravel
  const [livres] = useState([
    {
      id: 1,
      isbn: "978-2070360024",
      titre: "L'Étranger",
      auteur: "Albert Camus",
      categorie: "Roman",
      disponible: true,
    },
    {
      id: 2,
      isbn: "978-2070408504",
      titre: "Les Misérables",
      auteur: "Victor Hugo",
      categorie: "Classique",
      disponible: false,
    },
    {
      id: 3,
      isbn: "978-2266154116",
      titre: "Le Petit Prince",
      auteur: "Antoine de Saint-Exupéry",
      categorie: "Jeunesse",
      disponible: true,
    },
    {
      id: 4,
      isbn: "978-2035836946",
      titre: "Algorithmique en Python",
      auteur: "Thibault Demongodin",
      categorie: "Informatique",
      disponible: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Filtrage par recherche (titre, auteur, ISBN) et par catégorie
  const filteredLivres = livres.filter((livre) => {
    const matchesSearch =
      livre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livre.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livre.isbn.includes(searchTerm);

    const matchesCategory =
      selectedCategory === "" || livre.categorie === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar user={null} />

      {/* Hero Section */}
      <section className="bg-linear-to-br from-primary to-primary-hover text-white py-16 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Bienvenue à la bibliothèque MaBiblio
          </h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto">
            Explorez notre catalogue en ligne, recherchez vos ouvrages favoris
            et consultez leur disponibilité en temps réel.
          </p>

          {/* Barre de recherche principale */}
          {/* <div className="pt-4 max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              
              <svg
                className="w-5 h-5 text-center"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par titre, auteur ou ISBN..."
              className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 text-sm sm:text-base placeholder-gray-400 transition-all"
            />
          </div> */}

          <div className="pt-4 max-w-2xl mx-auto">
            <div className="relative">
              {/* Icône */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-400 block"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
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
                className="w-full h-14 pl-12 pr-4 box-border bg-white text-gray-900 rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 text-sm sm:text-base placeholder-gray-400 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contenu du catalogue */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filtres et tris */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>Catalogue des livres</span>
            <span className="text-xs font-semibold bg-blue-100 text-primary px-2.5 py-1 rounded-full">
              {filteredLivres.length} résultat
              {filteredLivres.length > 1 ? "s" : ""}
            </span>
          </h2>

          {/* Filtre par catégorie */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-medium text-gray-600">
              Catégorie :
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            >
              <option value="">Toutes les catégories</option>
              <option value="Roman">Roman</option>
              <option value="Classique">Classique</option>
              <option value="Jeunesse">Jeunesse</option>
              <option value="Informatique">Informatique</option>
            </select>
          </div>
        </div>

        {/* Grille des livres */}
        {filteredLivres.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLivres.map((livre) => (
              <div
                key={livre.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-1 rounded-lg">
                      {livre.categorie || "Général"}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        livre.disponible
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${livre.disponible ? "bg-emerald-500" : "bg-rose-500"}`}
                      ></span>
                      {livre.disponible ? "Disponible" : "Indisponible"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {livre.titre}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Par {livre.auteur}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 font-mono">
                    ISBN : {livre.isbn}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Un exemplaire unique
                  </span>
                  <button
                    onClick={() =>
                      alert("Veuillez vous connecter pour demander un emprunt.")
                    }
                    disabled={!livre.disponible}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                      livre.disponible
                        ? "bg-primary text-white hover:bg-primary-hover shadow-primary/20"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Emprunter
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-bold text-gray-800">
              Aucun résultat trouvé
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Essayez de modifier vos termes de recherche ou vos filtres.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-xs text-gray-500">
        <p>
          MaBiblio - Application web de gestion de bibliothèque de quartier
          (Version V1)
        </p>
      </footer>
    </div>
  );
}
