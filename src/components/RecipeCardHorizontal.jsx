import { Heart, Flame } from "lucide-react";
import MacroPill from "./MacroPill";
import TagBadge from "./TagBadge";

const RecipeCardHorizontal = ({ recipe, onClick, favorited, onFavorite }) => (
  <div
    onClick={() => onClick(recipe)}
    className="flex-shrink-0 w-48 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-zinc-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
    style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
  >
    <div className={`h-24 bg-gradient-to-br ${recipe.color} flex items-center justify-center relative`}>
      <span className="text-4xl">{recipe.emoji}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onFavorite(recipe.id); }}
        className="absolute top-2 right-2 p-1 rounded-full bg-black/30"
      >
        <Heart size={12} className={favorited ? "fill-rose-400 text-rose-400" : "text-white/60"} />
      </button>
    </div>
    <div className="p-3">
      <p className="text-white text-xs font-semibold leading-tight mb-1.5 line-clamp-2">{recipe.title}</p>
      <div className="flex items-center gap-1 mb-2">
        <TagBadge tag={recipe.tag} />
      </div>
      <div className="flex flex-wrap gap-1">
        <MacroPill variant="protein" value={`${recipe.protein}g`} label=" P" />
        <MacroPill variant="carbs" value={`${recipe.carbs}g`} label=" C" />
      </div>
      <div className="flex items-center gap-1 mt-2">
        <Flame size={10} className="text-orange-400" />
        <span className="text-[10px] text-zinc-400">{recipe.calories} kcal · {recipe.time}</span>
      </div>
    </div>
  </div>
);

export default RecipeCardHorizontal;
