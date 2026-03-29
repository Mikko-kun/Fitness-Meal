import { useState } from "react";
import { Zap, TrendingUp } from "lucide-react";
import RecipeCardVertical from "./RecipeCardVertical";

/* Compute card macros by summing ingredient-level macros + assign gradient colors + derive tag */
const GRADIENT_POOL = [
  "from-sky-900 to-sky-800",
  "from-emerald-900 to-emerald-800",
  "from-amber-900 to-amber-800",
  "from-orange-900 to-orange-800",
  "from-rose-900 to-rose-800",
];

function sumMacros(ingredients) {
  return (ingredients || []).reduce(
    (acc, ing) => {
      const m = ing.macros || {};
      acc.calories += m.cals ?? 0;
      acc.protein += m.p ?? 0;
      acc.carbs += m.c ?? 0;
      acc.fat += m.f ?? 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

function deriveTag(p, c) {
  if (p > 30) return "High Protein";
  if (c < 20) return "Low Carb";
  if (c > 50) return "High Carb";
  return "Balanced";
}

const DiscoverTab = ({ onRecipeClick, favorites, onFavorite, hidden, allRecipes }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "High Protein", "Low Carb", "Balanced", "High Carb"];

  const cookbookForCards = (allRecipes || []).map((r, i) => {
    const m = sumMacros(r.ingredients);
    return {
      ...r,
      calories: Math.round(m.calories),
      protein: Math.round(m.protein),
      carbs: Math.round(m.carbs),
      fat: Math.round(m.fat),
      tag: r.tag || deriveTag(Math.round(m.protein), Math.round(m.carbs)),
      color: r.color || GRADIENT_POOL[i % GRADIENT_POOL.length],
    };
  });

  const visible = cookbookForCards.filter(r => {
    if (hidden && hidden.includes(r.id)) return false;
    if (activeFilter === "All") return true;
    return r.tag === activeFilter;
  });

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="px-5 pt-8 pb-4">
        <h1 className="text-white text-2xl font-bold mb-1">Discover</h1>
        <p className="text-zinc-500 text-sm">Find your next favorite meal</p>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-5 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
              activeFilter === f
                ? "bg-emerald-500 border-emerald-500 text-black"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            {f === "High Protein" && <Zap size={10} className="inline mr-1" />}
            {f === "Low Carb" && <TrendingUp size={10} className="inline mr-1" />}
            {f}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="px-5 space-y-4">
        {visible.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🫙</p>
            <p className="text-zinc-400 text-sm">No recipes found for this filter.</p>
          </div>
        ) : (
          visible.map(r => (
            <RecipeCardVertical key={r.id} recipe={r} onClick={onRecipeClick} favorited={favorites.includes(r.id)} onFavorite={onFavorite} />
          ))
        )}
      </div>
    </div>
  );
};

export default DiscoverTab;
