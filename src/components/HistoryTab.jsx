import { CheckCircle, Heart } from "lucide-react";
import RecipeCardVertical from "./RecipeCardVertical";

const HistoryTab = ({ cooked, favorites, onRecipeClick, onFavorite, allRecipes }) => {
  const cookedRecipes = cooked;
  const favRecipes = (allRecipes || []).filter(r => favorites.includes(r.id));

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="px-5 pt-8 pb-4">
        <h1 className="text-white text-2xl font-bold mb-1">History</h1>
        <p className="text-zinc-500 text-sm">{cookedRecipes.length} meals cooked total</p>
      </div>

      {cookedRecipes.length > 0 && (
        <div className="px-5 mb-6">
          <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
            <CheckCircle size={12} className="text-emerald-400" /> Cooked
          </h2>
          <div className="space-y-3">
            {cookedRecipes.map((r, idx) => (
              <RecipeCardVertical key={r.cookedItemId || `${r.id}-${idx}`} recipe={r} onClick={onRecipeClick} favorited={favorites.includes(r.id)} onFavorite={onFavorite} />
            ))}
          </div>
        </div>
      )}

      {favRecipes.length > 0 && (
        <div className="px-5 mb-6">
          <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
            <Heart size={12} className="text-rose-400" /> Saved
          </h2>
          <div className="space-y-3">
            {favRecipes.map(r => (
              <RecipeCardVertical key={r.id} recipe={r} onClick={onRecipeClick} favorited={favorites.includes(r.id)} onFavorite={onFavorite} />
            ))}
          </div>
        </div>
      )}

      {cookedRecipes.length === 0 && favRecipes.length === 0 && (
        <div className="text-center py-24 px-5">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-zinc-300 font-semibold mb-1">Nothing here yet</p>
          <p className="text-zinc-600 text-sm">Cook a meal or save a favorite to see it here.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
