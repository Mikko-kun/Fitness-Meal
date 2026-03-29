import { useState, useMemo, useEffect } from "react";
import {
  X, Clock, Flame, Zap, TrendingUp, Droplets,
  Heart, CheckCircle, EyeOff, BookOpen, ShoppingBag
} from "lucide-react";
import TagBadge from "./TagBadge";
import { solveForMacros } from "../utils/mathEngine";

const RecipeModal = ({ recipe, onClose, favorited, cooked, hidden, onFavorite, onCooked, onHide, addToCart, macroGoals, setMacroGoals }) => {
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [mealsPerDay, setMealsPerDay] = useState(3);

  const [customMealMacros, setCustomMealMacros] = useState(() => ({
    calories: Math.round((macroGoals.calories || 2100) / 3),
    protein: Math.round((macroGoals.protein || 150) / 3),
    carbs: Math.round((macroGoals.carbs || 200) / 3),
    fat: Math.round((macroGoals.fat || 70) / 3)
  }));

  useEffect(() => {
    setCustomMealMacros({
      calories: Math.round(macroGoals.calories / mealsPerDay),
      protein: Math.round(macroGoals.protein / mealsPerDay),
      carbs: Math.round(macroGoals.carbs / mealsPerDay),
      fat: Math.round(macroGoals.fat / mealsPerDay)
    });
  }, [macroGoals, mealsPerDay]);

  const handleMacroChange = (macro, val) => {
    const newVal = Number(val);
    const oldVal = customMealMacros[macro];
    const diff = newVal - oldVal;

    setCustomMealMacros(prev => ({ ...prev, [macro]: newVal }));

    if (setMacroGoals && diff !== 0) {
      setMacroGoals(prev => ({
        ...prev,
        [macro]: prev[macro] + (diff * mealsPerDay)
      }));
    }
  };

  const calculatedIngredients = useMemo(() => solveForMacros(recipe, customMealMacros), [recipe, customMealMacros]);

  const toggleIngredient = (idx) => setCheckedIngredients(prev =>
    prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
  );

  // ── Dynamic Totals (The Math Engine Output) ──
  const totals = calculatedIngredients.reduce(
    (acc, ing) => {
      const macros = ing.calculatedMacros || {};
      acc.calories += (macros.cals ?? 0);
      acc.protein += (macros.p ?? 0);
      acc.carbs += (macros.c ?? 0);
      acc.fat += (macros.f ?? 0);
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const cal = Math.round(totals.calories);
  const pro = Math.round(totals.protein);
  const carb = Math.round(totals.carbs);
  const fatVal = Math.round(totals.fat);

  const handleAddToCart = () => {
    addToCart({
      id: recipe.id,
      title: recipe.title,
      calories: cal,
      protein: pro,
      carbs: carb,
      fat: fatVal,
      ingredients: calculatedIngredients,
      emoji: recipe.emoji,
      color: recipe.color,
    });
    onClose();
  };

  const handleCookedToggle = () => {
    if (cooked) {
      onCooked(recipe.id);
    } else {
      onCooked({
        id: recipe.id,
        title: recipe.title,
        calories: cal,
        protein: pro,
        carbs: carb,
        fat: fatVal,
        ingredients: calculatedIngredients,
        emoji: recipe.emoji,
        color: recipe.color,
      });
      onClose();
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

          {/* ── Editable Target Macros ────────────────── */}
          <div className="grid grid-cols-4 gap-2 mb-5">
            {[
              { id: 'calories', label: "Calories", value: customMealMacros.calories, unit: "kcal", bg: "bg-orange-500/10 border-orange-500/20", text: "text-orange-300", textHover: "text-orange-200", icon: Flame },
              { id: 'protein', label: "Protein", value: customMealMacros.protein, unit: "g", bg: "bg-sky-500/10 border-sky-500/20", text: "text-sky-300", textHover: "text-sky-200", icon: Zap },
              { id: 'carbs', label: "Carbs", value: customMealMacros.carbs, unit: "g", bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-300", textHover: "text-amber-200", icon: TrendingUp },
              { id: 'fat', label: "Fat", value: customMealMacros.fat, unit: "g", bg: "bg-rose-500/10 border-rose-500/20", text: "text-rose-300", textHover: "text-rose-200", icon: Droplets },
            ].map(m => (
              <div key={m.label} className={`rounded-xl p-2 border ${m.bg} flex flex-col items-center relative group`}>
                <m.icon size={14} className={`${m.text} opacity-70 mb-0.5`} />
                <div className="flex items-center justify-center gap-0.5 w-full">
                  <input
                    type="number"
                    value={m.value === 0 ? '' : m.value}
                    onChange={(e) => handleMacroChange(m.id, e.target.value)}
                    className={`w-10 bg-transparent text-center text-base font-bold ${m.text} p-0 m-0 border-none focus:outline-none focus:ring-0 group-hover:${m.textHover}`}
                    style={{ WebkitAppearance: 'none', appearance: 'textfield' }}
                  />
                  <span className={`text-[10px] font-bold ${m.text}`}>{m.unit}</span>
                </div>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wide mt-1">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Meals Per Day Slicer */}
          <div className="mb-5">
            <h3 className="text-zinc-300 text-sm font-semibold mb-3 flex justify-between items-center">
              <span>Target Frequency</span>
              <span className="text-[10px] text-zinc-500 font-normal py-0.5 px-2 bg-zinc-800 rounded-full">Syncs Globally</span>
            </h3>
            <div className="flex gap-2 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
              {[2, 3, 4, 5, 6].map(num => (
                <button
                  key={num}
                  onClick={() => setMealsPerDay(num)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${mealsPerDay === num ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {num} Meals
                </button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500 mt-2 px-1">
              Edit the exact macro targets above to dynamically fine-tune this meal!
            </p>
          </div>

          {/* ── Interactive Ingredients ─────────────── */}
          <div className="mb-5">
            <h3 className="text-zinc-300 text-sm font-semibold mb-3 flex items-center gap-2">
              <BookOpen size={14} className="text-emerald-400" />
              Ingredients
            </h3>
            <div className="space-y-2">
              {calculatedIngredients.map((ing, idx) => (
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

                  {/* Name and Auto-Scaling Label */}
                  <div className="flex-1 flex flex-col justify-center">
                    <span className={`text-sm font-medium transition-all ${checkedIngredients.includes(idx) ? "text-zinc-600 line-through" : "text-zinc-200"}`}>
                      {ing.name}
                    </span>
                    {ing.isFlexible && ing.targetMacro && (
                      <span className="text-[9px] text-emerald-500/70 font-medium uppercase tracking-wider">
                        Scales for {ing.targetMacro}
                      </span>
                    )}
                  </div>

                  {/* Calculated Amount */}
                  <div className="flex items-center">
                    <span className="text-emerald-400 text-sm font-bold w-16 text-right tabular-nums">
                      {ing.amount}{ing.unit ? ` ${ing.unit}` : ""}
                    </span>
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
