import { useState, useRef } from "react";
import {
  Search, X, ChevronRight, ChevronDown, ChevronUp, Flame, Zap, Award, Bell, Link2, Clock, RotateCcw
} from "lucide-react";
import { RECIPES } from "../data/recipes";
import RecipeCardHorizontal from "./RecipeCardHorizontal";
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

const HomeTab = ({ onRecipeClick, favorites, onFavorite, cooked, onNavigate, macroGoals, setMacroGoals, onResetDay, allRecipes }) => {
  const [query, setQuery] = useState("");
  const [isMacrosExpanded, setIsMacrosExpanded] = useState(false);
  const scrollRef = useRef(null);

  const totalCals = (cooked || []).reduce((acc, meal) => acc + (meal.calories || 0), 0);
  const totalPro = (cooked || []).reduce((acc, meal) => acc + (meal.protein || 0), 0);
  const goals = macroGoals || { calories: 2100, protein: 150, carbs: 200, fat: 70 };

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

  // Build "Jump Back In" from the user's cooked + favorited recipe IDs
  const historyIds = [...new Set([...(cooked || []).map(m => m.id || m), ...(favorites || [])])];
  const combinedRecipes = [...cookbookForCards, ...RECIPES];
  const jumpBackIn = combinedRecipes.filter(r => historyIds.includes(r.id));

  const filtered = query
    ? combinedRecipes.filter(r => {
        const lowerQ = query.toLowerCase();
        return (
          r.title.toLowerCase().includes(lowerQ) ||
          r.tag.toLowerCase().includes(lowerQ) ||
          r.ingredients?.some(i => i.name?.toLowerCase().includes(lowerQ))
        );
      })
    : null;

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-zinc-500 text-sm">Good morning 👋</p>
            <h1 className="text-white text-2xl font-bold">What are you eating today?</h1>
          </div>
          <div className="relative">
            <Bell size={22} className="text-zinc-400" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Macro Targets Card */}
      <div className="px-5 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg overflow-hidden transition-all">
          <button 
            onClick={() => setIsMacrosExpanded(!isMacrosExpanded)}
            className="w-full flex items-center justify-between p-4 bg-zinc-800/20 hover:bg-zinc-800/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-semibold">
                Target: {goals.calories} kcal | {goals.protein}g P
              </span>
            </div>
            {isMacrosExpanded ? (
              <ChevronUp size={18} className="text-zinc-400" />
            ) : (
              <ChevronDown size={18} className="text-zinc-400" />
            )}
          </button>
          
          <div 
            className={`transition-all duration-300 ease-in-out ${isMacrosExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-4 border-t border-zinc-800/50">
              <div className="grid grid-cols-2 gap-3">
                {['calories', 'protein', 'carbs', 'fat'].map(macro => (
                  <div key={macro} className="flex flex-col gap-1">
                    <label className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
                      {macro}
                    </label>
                    <input
                      type="number"
                      value={goals[macro]}
                      onChange={(e) => setMacroGoals && setMacroGoals({ ...goals, [macro]: Number(e.target.value) })}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search recipes or paste a URL..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-11 pr-12 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all"
          />
          {query ? (
            <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2">
              <X size={14} className="text-zinc-500" />
            </button>
          ) : (
            <Link2 size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600" />
          )}
        </div>
      </div>

      {/* Search results */}
      {filtered && (
        <div className="px-5 mb-6">
          <p className="text-zinc-500 text-xs mb-3 font-medium uppercase tracking-wider">{filtered.length} results</p>
          <div className="space-y-3">
            {filtered.map(r => (
              <RecipeCardVertical key={r.id} recipe={r} onClick={onRecipeClick} favorited={favorites.includes(r.id)} onFavorite={onFavorite} />
            ))}
          </div>
        </div>
      )}

      {!filtered && (
        <>
          {/* Stats bar */}
          <div className="px-5 mb-6">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Calories", value: totalCals, target: goals.calories, icon: Flame, color: "text-orange-500", unit: "" },
                { label: "Protein", value: totalPro, target: goals.protein, icon: Zap, color: "text-sky-500", unit: "g" },
                { label: "Streak", value: 7, target: null, icon: Award, color: "text-amber-500", unit: " days" },
              ].map(stat => (
                <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 shadow-inner">
                  <stat.icon size={14} className={stat.color + " mb-1"} />
                  <p className="text-white text-base font-bold leading-tight">
                    {stat.value.toLocaleString()}{stat.unit}
                  </p>
                  {stat.target && <p className="text-zinc-500 text-[10px] font-medium">of {stat.target.toLocaleString()}{stat.unit}</p>}
                  {!stat.target && <p className="text-zinc-500 text-[10px] font-medium">{stat.label}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Daily Recommended */}
          <div className="mb-6">
            <div className="px-5 flex items-center justify-between mb-3">
              <h2 className="text-white text-base font-bold flex items-center gap-2">
                Daily Recommended
                {cooked && cooked.length > 0 && (
                  <button 
                    onClick={onResetDay} 
                    className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    title="Start New Day"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
              </h2>
              <button onClick={() => onNavigate("discover")} className="text-emerald-400 text-xs font-medium flex items-center gap-0.5">
                See all <ChevronRight size={13} />
              </button>
            </div>
            <div ref={scrollRef} className="flex gap-3 px-5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {cookbookForCards.map(r => (
                <RecipeCardHorizontal key={r.id} recipe={r} onClick={onRecipeClick} favorited={favorites.includes(r.id)} onFavorite={onFavorite} />
              ))}
            </div>
          </div>

          {/* Jump Back In */}
          <div className="px-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white text-base font-bold">Jump Back In</h2>
              <button onClick={() => onNavigate("history")} className="text-emerald-400 text-xs font-medium flex items-center gap-0.5">
                History <ChevronRight size={13} />
              </button>
            </div>
            {jumpBackIn.length > 0 ? (
              <div className="space-y-3">
                {jumpBackIn.map(r => (
                  <RecipeCardVertical key={r.id} recipe={r} onClick={onRecipeClick} favorited={favorites.includes(r.id)} onFavorite={onFavorite} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
                <Clock size={28} className="text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-400 text-sm font-medium mb-1">Nothing here yet</p>
                <p className="text-zinc-600 text-xs">Save or cook a meal to see it here</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HomeTab;
