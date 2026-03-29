import { useState, useMemo } from "react";
import { CheckCircle, ShoppingBag, Utensils, X } from "lucide-react";

export default function CartTab({ cart, removeFromCart }) {
  const [checkedItems, setCheckedItems] = useState([]);

  const toggleCheck = (idx) => {
    setCheckedItems(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  // ── The Consolidation Algorithm ──
  const shoppingList = useMemo(() => {
    const list = {};
    cart.forEach(meal => {
      meal.ingredients.forEach(ing => {
        // Handle ingredients that don't have a structured amount (e.g. strings)
        if (typeof ing === "string") return; 

        const key = `${ing.name.toLowerCase()}_${ing.unit || ""}`;
        if (!list[key]) {
          list[key] = { name: ing.name, amount: 0, unit: ing.unit || "" };
        }
        list[key].amount += ing.amount || 0;
      });
    });

    // Convert object to array and round amounts to 1 decimal place
    return Object.values(list).map(item => ({
      ...item,
      amount: Math.round(item.amount * 10) / 10
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [cart]);

  return (
    <div className="flex-1 overflow-y-auto pb-24" style={{ scrollbarWidth: "none" }}>
      {/* Header */}
      <div className="pt-12 px-5 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <ShoppingBag size={18} className="text-amber-400" />
          <h1 className="text-white text-2xl font-bold">Meal Cart</h1>
        </div>
        <p className="text-zinc-400 text-sm">Your planned meals and shopping list.</p>
      </div>

      {cart.length === 0 ? (
        <div className="px-5 text-center mt-10">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
            <ShoppingBag size={24} className="text-zinc-600" />
          </div>
          <h3 className="text-white font-semibold mb-1">Cart is empty</h3>
          <p className="text-zinc-500 text-sm">Add meals to generate your shopping list.</p>
        </div>
      ) : (
        <>
          {/* Planned Meals UI */}
          <div className="px-5 mb-8">
            <h2 className="text-white text-base font-bold mb-3 flex items-center gap-2">
              <Utensils size={15} className="text-zinc-400" />
              Planned Meals ({cart.length})
            </h2>
            <div className="space-y-3">
              {cart.map((meal, idx) => (
                <div key={meal.cartItemId || `${meal.id}-${idx}`} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex items-center gap-4 relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meal.color || "from-zinc-800 to-zinc-700"} flex items-center justify-center text-2xl shrink-0`}>
                    {meal.emoji}
                  </div>
                  <div className="flex-1 overflow-hidden pr-6">
                    <h3 className="text-white font-semibold text-sm truncate">{meal.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-orange-400 text-[11px] font-medium">{meal.calories} kcal</span>
                      <span className="text-sky-400 text-[11px] font-medium">{meal.protein}g P</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(meal.cartItemId)}
                    className="absolute top-3 right-3 p-1 rounded-full text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Consolidated Shopping List UI */}
          <div className="px-5">
            <h2 className="text-white text-base font-bold mb-3 flex items-center gap-2">
              <ShoppingBag size={15} className="text-amber-400" />
              Shopping List
            </h2>
            <div className="space-y-2">
              {shoppingList.map((item, idx) => {
                const isChecked = checkedItems.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800/60 rounded-xl px-4 py-3 cursor-pointer select-none"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isChecked ? "bg-amber-500 border-amber-500" : "border-zinc-700"}`}>
                      {isChecked && <CheckCircle size={12} className="text-white fill-white" />}
                    </div>
                    
                    <span className={`flex-1 text-sm font-medium transition-all ${isChecked ? "text-zinc-600 line-through" : "text-zinc-200"}`}>
                      {item.name}
                    </span>
                    
                    <span className={`text-sm font-bold tabular-nums transition-all ${isChecked ? "text-zinc-600" : "text-amber-400"}`}>
                      {item.amount}{item.unit ? ` ${item.unit}` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
