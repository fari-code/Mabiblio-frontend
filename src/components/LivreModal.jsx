import { useState } from "react";

// Plus besoin de isOpen ici, car le parent va gérer le montage/démontage
export default function LivreModal({ onClose, onSubmit, initialData }) {
  
  // Initialisation directe du state avec les données (pas de useEffect)
  const [formData, setFormData] = useState({
    isbn: initialData?.isbn || "",
    titre: initialData?.titre || "",
    auteur: initialData?.auteur || "",
    categorie: initialData?.categorie || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay sombre */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Contenu du Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-[fadeInUp_0.3s_ease-out]">
        
        {/* En-tête */}
        <div className="px-6 py-5 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-bg-base)]">
          <div>
            <h3 className="text-lg font-bold text-[var(--color-text-main)]">
              {isEditing ? "Modifier le livre" : "Ajouter un nouveau livre"}
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {isEditing ? "L'ISBN ne peut pas être modifié." : "Remplissez les informations de l'ouvrage."}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-[var(--color-text-muted)] transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* ISBN */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5 uppercase tracking-wider">
              ISBN <span className="text-[var(--color-status-refuse)]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                <i className="fas fa-barcode"></i>
              </div>
              <input 
                type="text" 
                required 
                disabled={isEditing} 
                value={formData.isbn} 
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} 
                placeholder="Ex: 978-2070360024" 
                className="w-full pl-11 pr-4 py-3 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-xl text-sm font-mono text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:opacity-60 disabled:cursor-not-allowed transition-all" 
              />
            </div>
          </div>

          {/* Titre */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5 uppercase tracking-wider">
              Titre du livre <span className="text-[var(--color-status-refuse)]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                <i className="fas fa-heading"></i>
              </div>
              <input 
                type="text" 
                required 
                value={formData.titre} 
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })} 
                placeholder="Ex: L'Étranger" 
                className="w-full pl-11 pr-4 py-3 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all" 
              />
            </div>
          </div>

          {/* Auteur */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5 uppercase tracking-wider">
              Auteur <span className="text-[var(--color-status-refuse)]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                <i className="fas fa-user-pen"></i>
              </div>
              <input 
                type="text" 
                required 
                value={formData.auteur} 
                onChange={(e) => setFormData({ ...formData, auteur: e.target.value })} 
                placeholder="Ex: Albert Camus" 
                className="w-full pl-11 pr-4 py-3 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all" 
              />
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5 uppercase tracking-wider flex justify-between">
              Catégorie 
              <span className="text-[var(--color-text-muted)] font-normal normal-case text-[10px]">(Optionnel)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                <i className="fas fa-tag"></i>
              </div>
              <input 
                type="text" 
                value={formData.categorie} 
                onChange={(e) => setFormData({ ...formData, categorie: e.target.value })} 
                placeholder="Ex: Roman, Science-Fiction..." 
                className="w-full pl-11 pr-4 py-3 bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all" 
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[var(--color-border)] flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-[var(--color-text-main)] rounded-xl text-sm font-bold transition-all"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
            >
              {isEditing ? "Enregistrer" : "Ajouter"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}