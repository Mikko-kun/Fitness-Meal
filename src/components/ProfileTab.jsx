import {
  Zap, TrendingUp, Droplets, Flame,
  CheckCircle, Heart, Settings, Award, User, BookOpen
} from "lucide-react";
import TagBadge from "./TagBadge";
import { useAuth } from "../context/AuthContext";
import RecipeCardVertical from "./RecipeCardVertical";

const ProfileTab = ({ cooked, favorites, macroGoals, setMacroGoals, onFactoryReset, onOpenAuth, onRecipeClick, onFavorite, allRecipes }) => {
  const { currentUser, logout } = useAuth();
  
  const cookedRecipes = cooked;
  const favRecipes = (allRecipes || []).filter(r => favorites.includes(r.id));
  const handleFactoryReset = () => {
    if (window.confirm("Are you sure you want to erase all data? This cannot be undone.")) {
      onFactoryReset && onFactoryReset();
    }
  };

  const macroStats = [
    { label: "Avg Protein", value: "38g", icon: Zap, color: "text-sky-400", bg: "bg-sky-500/10" },
    { label: "Avg Carbs", value: "31g", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Avg Fat", value: "13g", icon: Droplets, color: "text-rose-400", bg: "bg-rose-500/10" },
    { label: "Avg Cal", value: "410", icon: Flame, color: "text-orange-400", bg: "bg-orange-500/10" },
  ];
  const prefs = ["High Protein", "Low Carb", "Quick Meals"];

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="px-5 pt-8 pb-4 flex items-center justify-between">
        <h1 className="text-white text-2xl font-bold">Profile</h1>
        <button 
          onClick={handleFactoryReset} 
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-rose-500/10 hover:border-rose-500/30 transition group"
          title="Factory Reset"
        >
          <Settings size={18} className="text-zinc-400 group-hover:text-rose-400 transition" />
        </button>
      </div>

      {/* Avatar card */}
      <div className="px-5 mb-5">
        {currentUser ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4 relative">
            <button onClick={logout} className="absolute top-4 right-4 text-[10px] text-zinc-500 hover:text-rose-400 uppercase tracking-widest font-bold transition-colors">Log out</button>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-2xl font-bold text-white shrink-0">
              {currentUser.email?.substring(0, 2).toUpperCase() || "ME"}
            </div>
            <div>
              <p className="text-white font-bold text-lg truncate max-w-[180px]">{currentUser.email?.split('@')[0]}</p>
              <p className="text-emerald-400 text-sm font-semibold">{macroGoals?.calories || 2100} kcal daily goal</p>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {prefs.map(p => <TagBadge key={p} tag={p.includes("Protein") ? "High Protein" : p.includes("Carb") ? "Low Carb" : "Balanced"} />)}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-800 border-[3px] border-zinc-700 flex items-center justify-center text-zinc-500 mb-3">
              <User size={28} />
            </div>
            <p className="text-white font-bold text-lg mb-1">Guest Profile</p>
            <p className="text-zinc-400 text-xs mb-5">Your data is saved locally on this device. Sign up to sync your custom macros and plans anywhere.</p>
            <button 
              onClick={onOpenAuth}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-3 px-8 rounded-xl transition-all shadow-lg shadow-emerald-500/20 w-full active:scale-95"
            >
              Log In / Sign Up
            </button>
          </div>
        )}
      </div>

      {/* My Kitchen Section */}
      <div className="px-5 mb-8">
        <h2 className="text-white text-base font-bold mb-4 flex items-center gap-2">
          <BookOpen size={16} className="text-emerald-400" />
          My Kitchen
        </h2>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          {/* Cooked */}
          {cookedRecipes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle size={12} className="text-emerald-400" /> Cooked History
              </h3>
              <div className="space-y-3">
                {cookedRecipes.map((r, idx) => (
                  <RecipeCardVertical key={r.cookedItemId || `${r.id}-${idx}`} recipe={r} onClick={onRecipeClick} favorited={favorites.includes(r.id)} onFavorite={onFavorite} />
                ))}
              </div>
            </div>
          )}

          {/* Favorites */}
          {favRecipes.length > 0 && (
            <div>
              <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                <Heart size={12} className="text-rose-400" /> Saved Recipes
              </h3>
              <div className="space-y-3">
                {favRecipes.map(r => (
                  <RecipeCardVertical key={r.id} recipe={r} onClick={onRecipeClick} favorited={favorites.includes(r.id)} onFavorite={onFavorite} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {cookedRecipes.length === 0 && favRecipes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-4xl mb-3 opacity-50">🍽️</p>
              <p className="text-zinc-400 font-medium text-sm">Nothing in your kitchen yet.</p>
              <p className="text-zinc-500 text-xs mt-1">Cook or save meals to view them here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Goals */}
      <div className="px-5 mb-5">
        <h2 className="text-white text-base font-bold mb-3 flex items-center gap-2">
          <Settings size={15} className="text-zinc-400" />
          Edit Macro Goals
        </h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 grid grid-cols-2 gap-4">
          {[
            { id: "calories", label: "Calories (kcal)", color: "focus:border-orange-500", text: "text-orange-500" },
            { id: "protein", label: "Protein (g)", color: "focus:border-sky-500", text: "text-sky-500" },
            { id: "carbs", label: "Carbs (g)", color: "focus:border-amber-500", text: "text-amber-500" },
            { id: "fat", label: "Fat (g)", color: "focus:border-rose-500", text: "text-rose-500" },
          ].map(field => (
            <div key={field.id} className="flex flex-col gap-1.5">
              <label className={`text-xs font-bold ${field.text}`}>{field.label}</label>
              <input
                type="number"
                value={macroGoals?.[field.id] || ""}
                onChange={(e) => setMacroGoals && setMacroGoals(prev => ({ ...prev, [field.id]: Number(e.target.value) || 0 }))}
                className={`bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-semibold outline-none transition-colors ${field.color}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 mb-5">
        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3">This Week</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            { label: "Meals Cooked", value: cooked.length, icon: CheckCircle, color: "text-emerald-400" },
            { label: "Recipes Saved", value: favorites.length, icon: Heart, color: "text-rose-400" },
          ].map(s => (
            <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
              <s.icon size={22} className={s.color} />
              <div>
                <p className="text-white text-xl font-bold">{s.value}</p>
                <p className="text-zinc-500 text-xs">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {macroStats.map(m => (
            <div key={m.label} className={`${m.bg} rounded-xl p-2.5 flex flex-col items-center`}>
              <m.icon size={13} className={m.color} />
              <p className={`text-sm font-bold ${m.color} leading-tight mt-0.5`}>{m.value}</p>
              <p className="text-[9px] text-zinc-600 text-center leading-tight mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Streak */}
      <div className="px-5">
        <div className="bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-900/50 rounded-2xl p-4 flex items-center gap-4">
          <div className="text-4xl">🔥</div>
          <div>
            <p className="text-emerald-300 text-lg font-bold">7-Day Streak!</p>
            <p className="text-emerald-600 text-xs">Keep it up — 3 more days for a new badge</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
