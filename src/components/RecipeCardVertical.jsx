import {
  Heart, Flame, Zap, TrendingUp, Droplets, Clock, ArrowUpRight,
} from "lucide-react";
import MacroPill from "./MacroPill";
import TagBadge from "./TagBadge";

const RecipeCardVertical = ({ recipe, onClick, favorited, onFavorite }) => (
  <div
    onClick={() => onClick(recipe)}
    className="rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-zinc-600 transition-all active:scale-[0.98]"
    style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}
  >
    <div className={`h-32 bg-gradient-to-br ${recipe.color} flex items-center justify-center relative`}>
      <span className="text-5xl">{recipe.emoji}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onFavorite(recipe.id); }}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-black/30"
      >
        <Heart size={14} className={favorited ? "fill-rose-400 text-rose-400" : "text-white/60"} />
      </button>
      <div className="absolute bottom-2 left-3">
        <TagBadge tag={recipe.tag} />
      </div>
    </div>
    <div className="p-4">
      <p className="text-white text-sm font-semibold mb-1 line-clamp-1">{recipe.title}</p>
      <p className="text-zinc-500 text-xs mb-3 line-clamp-2">{recipe.description}</p>
      <div className="flex gap-1.5 flex-wrap mb-3">
        <MacroPill variant="protein" icon={Zap} value={`${recipe.protein}g`} label=" protein" />
        <MacroPill variant="carbs" icon={TrendingUp} value={`${recipe.carbs}g`} label=" carbs" />
        <MacroPill variant="fat" icon={Droplets} value={`${recipe.fat}g`} label=" fat" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Flame size={11} className="text-orange-400" />
          <span className="text-xs text-zinc-400">{recipe.calories} kcal</span>
          <span className="text-zinc-700 mx-1">·</span>
          <Clock size={11} className="text-zinc-500" />
          <span className="text-xs text-zinc-400">{recipe.time}</span>
        </div>
        <ArrowUpRight size={14} className="text-zinc-600" />
      </div>
    </div>
  </div>
);

export default RecipeCardVertical;
