import { useState } from "react";
import { X, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ onClose, initialMode = "signup" }) => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="w-full max-w-sm bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl relative z-10 overflow-hidden transform transition-all">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors z-20"
        >
          <X size={18} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-zinc-500 text-sm mb-6">
            {isLogin 
              ? "Enter your details to access your synced macros and recipes." 
              : "Sign up to securely sync your custom meal plans across devices."}
          </p>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-5 flex items-start gap-2 text-rose-400 text-xs leading-snug">
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              <span>{error.replace("Firebase: ", "")}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pl-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pl-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-black font-extrabold py-3.5 rounded-xl mt-2 transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
