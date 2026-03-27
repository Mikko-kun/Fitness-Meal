import { useState } from "react";
import { Plus, Save, Trash2, CheckCircle } from "lucide-react";

function deriveTag(p, c) {
  if (p > 30) return "High Protein";
  if (c < 20) return "Low Carb";
  if (c > 50) return "High Carb";
  return "Balanced";
}

const CreateTab = ({ onSave, onNavigate }) => {
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("🍳");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", amount: 100, unit: "g", step: 50, cals: 0, p: 0, c: 0, f: 0 }
  ]);

  const handleAddIngredient = () => {
    setIngredients(prev => [...prev, { name: "", amount: 100, unit: "g", step: 50, cals: 0, p: 0, c: 0, f: 0 }]);
  };

  const handleUpdateIngredient = (index, field, value) => {
    setIngredients(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title) return alert("Please enter a title.");

    let totalP = 0;
    let totalC = 0;

    const mappedIngredients = ingredients.map(ing => {
      totalP += Number(ing.p);
      totalC += Number(ing.c);
      return {
        name: ing.name || "Unknown",
        amount: Number(ing.amount) || 0,
        unit: ing.unit || "g",
        step: Number(ing.step) || 1,
        macros: {
          cals: Number(ing.cals) || 0,
          p: Number(ing.p) || 0,
          c: Number(ing.c) || 0,
          f: Number(ing.f) || 0
        }
      };
    });

    const newRecipe = {
      id: "custom_" + crypto.randomUUID(),
      title,
      emoji,
      time: time ? time + (time.includes("min") ? "" : " min") : "15 min",
      difficulty: "Custom",
      tag: deriveTag(totalP, totalC),
      description,
      ingredients: mappedIngredients
    };

    onSave(newRecipe);
    setSuccess(true);
    
    // Reset form
    setTitle("");
    setEmoji("🍳");
    setTime("");
    setDescription("");
    setIngredients([{ name: "", amount: 100, unit: "g", step: 50, cals: 0, p: 0, c: 0, f: 0 }]);

    setTimeout(() => {
      setSuccess(false);
      onNavigate && onNavigate("home");
    }, 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="px-5 pt-8 pb-4">
        <h1 className="text-white text-2xl font-bold mb-1">Create Recipe</h1>
        <p className="text-zinc-500 text-sm">Add your custom meals to the cookbook</p>
      </div>

      {success && (
        <div className="mx-5 mb-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle className="text-emerald-400" size={20} />
          <p className="text-emerald-400 font-semibold text-sm">Recipe saved successfully!</p>
        </div>
      )}

      <div className="px-5 space-y-4 mb-8">
        {/* Basic Details */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <h2 className="text-white font-bold text-sm mb-2">Basic Details</h2>
          <div className="flex gap-3">
            <div className="w-16 shrink-0">
              <label className="block text-zinc-500 text-[10px] font-bold uppercase mb-1">Emoji</label>
              <input 
                type="text" 
                value={emoji} 
                onChange={e => setEmoji(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-center font-semibold outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-zinc-500 text-[10px] font-bold uppercase mb-1">Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Grandma's Oats"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-semibold outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-1/3">
              <label className="block text-zinc-500 text-[10px] font-bold uppercase mb-1">Time</label>
              <input 
                type="text" 
                value={time} 
                onChange={e => setTime(e.target.value)}
                placeholder="15 min"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-semibold outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-zinc-500 text-[10px] font-bold uppercase mb-1">Description</label>
              <input 
                type="text" 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief summary..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-semibold outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Ingredients Builder */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-sm">Ingredients</h2>
            <button 
              onClick={handleAddIngredient}
              className="text-emerald-400 text-xs font-bold flex items-center gap-1 hover:text-emerald-300"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {ingredients.map((ing, idx) => (
            <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative">
              {ingredients.length > 1 && (
                <button 
                  onClick={() => handleRemoveIngredient(idx)}
                  className="absolute top-3 right-3 text-zinc-600 hover:text-rose-400"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <div className="pr-6 mb-3">
                <label className="block text-zinc-500 text-[10px] font-bold uppercase mb-1">Ingredient Name</label>
                <input 
                  type="text" 
                  value={ing.name}
                  onChange={e => handleUpdateIngredient(idx, "name", e.target.value)}
                  placeholder="e.g. Chicken Breast"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-semibold outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <label className="block text-zinc-500 text-[10px] font-bold uppercase mb-1">Base Amt</label>
                  <input 
                    type="number" 
                    value={ing.amount}
                    onChange={e => handleUpdateIngredient(idx, "amount", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-semibold outline-none"
                  />
                </div>
                <div className="w-20">
                  <label className="block text-zinc-500 text-[10px] font-bold uppercase mb-1">Unit</label>
                  <input 
                    type="text" 
                    value={ing.unit}
                    onChange={e => handleUpdateIngredient(idx, "unit", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-semibold outline-none text-center"
                  />
                </div>
                <div className="w-20">
                  <label className="block text-zinc-500 text-[10px] font-bold uppercase mb-1">Step</label>
                  <input 
                    type="number" 
                    value={ing.step}
                    onChange={e => handleUpdateIngredient(idx, "step", e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-semibold outline-none text-center"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-orange-500 text-[10px] font-bold uppercase mb-1">Cals</label>
                  <input type="number" value={ing.cals} onChange={e => handleUpdateIngredient(idx, "cals", e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-1.5 text-white font-semibold outline-none text-center text-sm focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sky-500 text-[10px] font-bold uppercase mb-1">Pro</label>
                  <input type="number" value={ing.p} onChange={e => handleUpdateIngredient(idx, "p", e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-1.5 text-white font-semibold outline-none text-center text-sm focus:border-sky-500" />
                </div>
                <div>
                  <label className="block text-amber-500 text-[10px] font-bold uppercase mb-1">Carb</label>
                  <input type="number" value={ing.c} onChange={e => handleUpdateIngredient(idx, "c", e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-1.5 text-white font-semibold outline-none text-center text-sm focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-rose-500 text-[10px] font-bold uppercase mb-1">Fat</label>
                  <input type="number" value={ing.f} onChange={e => handleUpdateIngredient(idx, "f", e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-1.5 text-white font-semibold outline-none text-center text-sm focus:border-rose-500" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-lg rounded-2xl py-4 mt-4 flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          <Save size={20} />
          Save Recipe
        </button>

      </div>
    </div>
  );
};

export default CreateTab;
