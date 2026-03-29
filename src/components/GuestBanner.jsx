import { useState, useEffect } from "react";
import { X, UserPlus } from "lucide-react";

const GuestBanner = ({ onSignUp }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem("guestBannerDismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("guestBannerDismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-[72px] sm:bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[410px] z-40 px-4">
      <div className="bg-emerald-900/40 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-4 shadow-lg shadow-emerald-900/20 flex flex-col gap-3 relative">
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-emerald-500/70 hover:text-emerald-400 p-1"
        >
          <X size={14} />
        </button>
        <div className="pr-6">
          <p className="text-zinc-200 text-sm font-medium leading-tight">
            Create a free account to sync your custom macros and meal plans across devices.
          </p>
        </div>
        <button 
          onClick={() => {
            onSignUp();
            handleDismiss();
          }}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all"
        >
          <UserPlus size={16} />
          Sign Up Now
        </button>
      </div>
    </div>
  );
};

export default GuestBanner;
