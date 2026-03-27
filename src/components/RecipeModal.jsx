import { useState } from "react";
import {
  X, Clock, Flame, Zap, TrendingUp, Droplets,
  Heart, CheckCircle, EyeOff, BookOpen, Minus, Plus, ShoppingBag
} from "lucide-react";
import TagBadge from "./TagBadge";

const RecipeModal = ({ recipe, onClose, favorited, cooked, hidden, onFavorite, onCooked, onHide, addToCart }) => {
  // Local state: current amount for each ingredient, initialized from recipe data
  const [amounts, setAmounts] = useState(() =>
    recipe.ingredients.map(ing => ing.amount ?? ing.baseAmount ?? 0)
  );
  const [checkedIngredients, setCheckedIngredients] = useState([]);

  const toggleIngredient = (idx) => setCheckedIngredients(prev =>
    prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
  );

  // Adjust a single ingredient by its step
  const adjustAmount = (idx, delta) => {
    setAmounts(prev => {
      const next = [...prev];
      const step = recipe.ingredients[idx].step || 1;
      const newVal = Math.round((next[idx] + step * delta) * 100) / 100;
      next[idx] = Math.max(0, newVal);
      return next;
    });
  };

  // ── Dynamic Totals (The Math Engine) ──
  // For each ingredient: multiplier = currentAmount / originalAmount
  // totalMacro = Σ (ingredient.macros.X * multiplier)
  const totals = recipe.ingredients.reduce(
    (acc, ing, idx) => {
      const original = ing.amount ?? ing.baseAmount ?? 1;
      const multiplier = original > 0 ? amounts[idx] / original : 0;
      const macros = ing.macros || {};
      acc.calories += (macros.cals ?? 0) * multiplier;
      acc.protein += (macros.p ?? 0) * multiplier;
      acc.carbs += (macros.c ?? 0) * multiplier;
      acc.fat += (macros.f ?? 0) * multiplier;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const cal = Math.round(totals.calories);
  const pro = Math.round(totals.protein);
  const carb = Math.round(totals.carbs);
  const fatVal = Math.round(totals.fat);

  const handleAddToCart = () => {
    const currentIngredients = recipe.ingredients.map((ing, idx) => ({
      ...ing,
      amount: amounts[idx],
    }));

    addToCart({
      id: recipe.id,
      title: recipe.title,
      calories: cal,
      protein: pro,
      carbs: carb,
      fat: fatVal,
      ingredients: currentIngredients,
      emoji: recipe.emoji,
      color: recipe.color,
    });
    onClose();
  };

  const handleCookedToggle = () => {
    if (cooked) {
      onCooked(recipe.id); // Remove it
    } else {
      const currentIngredients = recipe.ingredients.map((ing, idx) => ({
        ...ing,
        amount: amounts[idx],
      }));
      onCooked({
        id: recipe.id,
        title: recipe.title,
        calories: cal,
        protein: pro,
        carbs: carb,
        fat: fatVal,
        ingredients: currentIngredients,
        emoji: recipe.emoji,
        color: recipe.color,
      });
      onClose(); // Optional: close modal on cook
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md bg-zinc-950 rounded-t-3xl overflow-hidden"
        style={{ maxHeight: "90vh", overflowY: "auto", boxShadow: "0 -8px 48px rgba(0,0,0,0.8)" }}
      >
        {/* Hero */}
        <div className={`h-52 bg-gradient-to-br ${recipe.color || "from-zinc-800 to-zinc-700"} flex items-center justify-center relative`}>
          <span className="text-8xl">{recipe.emoji}</span>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white"
          >
            <X size={18} />
          </button>
          {recipe.tag && (
            <div className="absolute bottom-4 left-4">
              <TagBadge tag={recipe.tag} />
            </div>
          )}
          <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/30 rounded-full px-2 py-1">
            <Clock size={10} className="text-white/70" />
            <span className="text-[11px] text-white/70">{recipe.time}</span>
          </div>
        </div>

        <div className="p-5">
          {/* Title */}
          <div className="mb-4">
            <h2 className="text-white text-xl font-bold mb-1">{recipe.title}</h2>
            {recipe.description && (
              <p className="text-zinc-400 text-sm leading-relaxed">{recipe.description}</p>
            )}
          </div>

          {/* ── Dynamic Macro Totals ────────────────── */}
          <div className="grid grid-cols-4 gap-2 mb-5">
            {[
              { label: "Calories", value: cal, unit: "kcal", bg: "bg-orange-500/10 border-orange-500/20", text: "text-orange-300", icon: Flame },
              { label: "Protein", value: `${pro}g`, unit: "", bg: "bg-sky-500/10 border-sky-500/20", text: "text-sky-300", icon: Zap },
              { label: "Carbs", value: `${carb}g`, unit: "", bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-300", icon: TrendingUp },
              { label: "Fat", value: `${fatVal}g`, unit: "", bg: "bg-rose-500/10 border-rose-500/20", text: "text-rose-300", icon: Droplets },
            ].map(m => (
              <div key={m.label} className={`rounded-xl p-2 border ${m.bg} flex flex-col items-center`}>
                <m.icon size={14} className={m.text} />
                <span className={`text-base font-bold ${m.text} leading-tight mt-0.5`}>{m.value}</span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wide">{m.label}</span>
              </div>
            ))}
          </div>

          {/* ── Interactive Ingredients ─────────────── */}
          <div className="mb-5">
            <h3 className="text-zinc-300 text-sm font-semibold mb-3 flex items-center gap-2">
              <BookOpen size={14} className="text-emerald-400" />
              Ingredients
            </h3>
            <div className="space-y-2">
              {recipe.ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800/60 rounded-xl px-3 py-2.5"
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleIngredient(idx)}
                    className="flex-shrink-0"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${checkedIngredients.includes(idx) ? "bg-emerald-500 border-emerald-500" : "border-zinc-700"}`}>
                      {checkedIngredients.includes(idx) && <CheckCircle size={12} className="text-white fill-white" />}
                    </div>
                  </button>

                  {/* Name */}
                  <span className={`flex-1 text-sm font-medium transition-all ${checkedIngredients.includes(idx) ? "text-zinc-600 line-through" : "text-zinc-200"}`}>
                    {ing.name}
                  </span>

                  {/* +/- Stepper */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => adjustAmount(idx, -1)}
                      disabled={amounts[idx] <= 0}
                      className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 hover:border-zinc-600 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-emerald-400 text-sm font-bold w-16 text-center tabular-nums">
                      {amounts[idx]}{ing.unit ? ` ${ing.unit}` : ""}
                    </span>
                    <button
                      onClick={() => adjustAmount(idx, 1)}
                      className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 hover:border-zinc-600 transition-all"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-4 gap-2 pb-2">
            <button
              onClick={() => onFavorite(recipe.id)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all ${favorited ? "bg-rose-500/15 border-rose-500/30 text-rose-400" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600"}`}
            >
              <Heart size={16} className={favorited ? "fill-rose-400" : ""} />
              <span className="text-[10px] sm:text-[11px] font-medium">{favorited ? "Saved" : "Favorite"}</span>
            </button>
            <button
              onClick={handleCookedToggle}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all ${cooked ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"}`}
            >
              <CheckCircle size={16} className={cooked ? "fill-emerald-400 text-emerald-400" : ""} />
              <span className="text-[10px] sm:text-[11px] font-medium">{cooked ? "Cooked" : "I Cooked"}</span>
            </button>
            <button
              onClick={handleAddToCart}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border bg-amber-500/15 border-amber-500/30 text-amber-500 hover:bg-amber-500/25 transition-all"
            >
              <ShoppingBag size={16} />
              <span className="text-[10px] sm:text-[11px] font-medium">Add to Cart</span>
            </button>
            <button
              onClick={() => { onHide(recipe.id); onClose(); }}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 transition-all"
            >
              <EyeOff size={16} />
              <span className="text-[10px] sm:text-[11px] font-medium">Hide</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
