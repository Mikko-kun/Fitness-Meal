import { useState, useEffect } from "react";
import { Home, Compass, Clock, User, ShoppingBag, PlusCircle } from "lucide-react";
import HomeTab from "./components/HomeTab";
import DiscoverTab from "./components/DiscoverTab";
import HistoryTab from "./components/HistoryTab";
import ProfileTab from "./components/ProfileTab";
import CartTab from "./components/CartTab";
import CreateTab from "./components/CreateTab";
import RecipeModal from "./components/RecipeModal";
import GuestBanner from "./components/GuestBanner";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./context/AuthContext";
import { COOKBOOK } from "./data/cookbook";
import { getUserData, saveUserData } from "./services/db";

const loadFromStorage = (key) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export default function App() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [favorites, setFavorites] = useState(() => loadFromStorage("favorites"));
  const [cooked, setCooked] = useState(() => loadFromStorage("cooked"));
  const [hidden, setHidden] = useState(() => loadFromStorage("hidden"));
  const [cart, setCart] = useState(() => loadFromStorage("cart"));
  const [userRecipes, setUserRecipes] = useState(() => loadFromStorage("userRecipes"));
  const [macroGoals, setMacroGoals] = useState(() => {
    const stored = localStorage.getItem("macroGoals");
    return stored ? JSON.parse(stored) : { calories: 2100, protein: 150, carbs: 200, fat: 70 };
  });

  const [isHydrating, setIsHydrating] = useState(false);
  const [previousUser, setPreviousUser] = useState(currentUser);

  // Cloud Migration & Logout reset
  useEffect(() => {
    // Logout detection
    if (previousUser && !currentUser) {
      factoryReset();
    }
    setPreviousUser(currentUser);

    // Login Hydration
    if (currentUser) {
      setIsHydrating(true);
      getUserData(currentUser.uid).then(data => {
        if (data && Object.keys(data).length > 0) {
          if (data.macroGoals) setMacroGoals(data.macroGoals);
          if (data.favorites) setFavorites(data.favorites);
          if (data.cooked) setCooked(data.cooked);
          if (data.hidden) setHidden(data.hidden);
          if (data.cart) setCart(data.cart);
          if (data.userRecipes) setUserRecipes(data.userRecipes);
        } else {
          // New account migration
          saveUserData(currentUser.uid, { macroGoals, favorites, cooked, hidden, cart, userRecipes });
        }
      }).finally(() => {
        setTimeout(() => setIsHydrating(false), 200);
      });
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // Combined Live Sync & Local Persistence
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("cooked", JSON.stringify(cooked));
    localStorage.setItem("hidden", JSON.stringify(hidden));
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("macroGoals", JSON.stringify(macroGoals));
    localStorage.setItem("userRecipes", JSON.stringify(userRecipes));

    if (currentUser && !isHydrating) {
      saveUserData(currentUser.uid, { favorites, cooked, hidden, cart, macroGoals, userRecipes });
    }
  }, [favorites, cooked, hidden, cart, macroGoals, userRecipes, currentUser, isHydrating]);

  const ALL_RECIPES = [...COOKBOOK, ...userRecipes];

  const addToCart = (meal) => setCart(prev => [...prev, { ...meal, cartItemId: crypto.randomUUID() }]);
  const removeFromCart = (cartItemId) => setCart(prev => prev.filter(m => m.cartItemId !== cartItemId));

  const toggleFavorite = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  
  // Updates toggleCooked to accept either a scaled meal object (to add) or an ID (to remove)
  const toggleCooked = (payload) => {
    if (typeof payload === "string") {
      // Remove all instances of this ID
      setCooked(prev => prev.filter(m => (m.id || m) !== payload));
    } else {
      // Add scaled object
      setCooked(prev => [...prev, { ...payload, cookedItemId: crypto.randomUUID() }]);
    }
  };
  
  const addHidden = (id) => setHidden(prev => [...prev, id]);

  const resetDay = () => setCooked([]);

  const factoryReset = () => {
    localStorage.clear();
    setFavorites([]);
    setCooked([]);
    setHidden([]);
    setCart([]);
    setUserRecipes([]);
    setMacroGoals({ calories: 2100, protein: 150, carbs: 200, fat: 70 });
  };

  const tabs = [
    { id: "home", label: "Home", Icon: Home },
    { id: "discover", label: "Discover", Icon: Compass },
    { id: "create", label: "Create", Icon: PlusCircle },
    { id: "history", label: "History", Icon: Clock },
    { id: "cart", label: "Cart", Icon: ShoppingBag },
    { id: "profile", label: "Profile", Icon: User },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 430, margin: "0 auto", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Tab content */}
      <div className="flex-1 flex flex-col">
        {activeTab === "home" && <HomeTab onRecipeClick={setSelectedRecipe} favorites={favorites} onFavorite={toggleFavorite} cooked={cooked} onNavigate={setActiveTab} macroGoals={macroGoals} setMacroGoals={setMacroGoals} onResetDay={resetDay} allRecipes={ALL_RECIPES} />}
        {activeTab === "discover" && <DiscoverTab onRecipeClick={setSelectedRecipe} favorites={favorites} onFavorite={toggleFavorite} hidden={hidden} allRecipes={ALL_RECIPES} />}
        {activeTab === "create" && <CreateTab onSave={(r) => setUserRecipes(prev => [...prev, r])} onNavigate={setActiveTab} />}
        {activeTab === "history" && <HistoryTab cooked={cooked} favorites={favorites} onRecipeClick={setSelectedRecipe} onFavorite={toggleFavorite} allRecipes={ALL_RECIPES} />}
        {activeTab === "cart" && <CartTab cart={cart} removeFromCart={removeFromCart} />}
        {activeTab === "profile" && <ProfileTab cooked={cooked} favorites={favorites} macroGoals={macroGoals} setMacroGoals={setMacroGoals} onFactoryReset={factoryReset} onOpenAuth={() => setIsAuthModalOpen(true)} />}
      </div>

      {/* Bottom Nav */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-zinc-950/95 border-t border-zinc-800"
        style={{ backdropFilter: "blur(20px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all ${active ? "bg-emerald-500/10" : ""}`}
              >
                <Icon
                  size={22}
                  className={active ? "text-emerald-400" : "text-zinc-600"}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span className={`text-[10px] font-semibold transition-all ${active ? "text-emerald-400" : "text-zinc-600"}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          favorited={favorites.includes(selectedRecipe.id)}
          cooked={cooked.some(m => (m.id || m) === selectedRecipe.id)}
          hidden={hidden.includes(selectedRecipe.id)}
          onFavorite={toggleFavorite}
          onCooked={toggleCooked}
          onHide={addHidden}
          addToCart={addToCart}
          macroGoals={macroGoals}
          setMacroGoals={setMacroGoals}
        />
      )}

      {/* Auth UI */}
      {!currentUser && <GuestBanner onSignUp={() => setIsAuthModalOpen(true)} />}
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
}
