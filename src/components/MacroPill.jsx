const MacroPill = ({ icon: Icon, value, label, variant }) => {
  const variants = {
    protein: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    carbs: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    fat: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    cal: "bg-lime-500/20 text-lime-300 border-lime-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]}`}>
      {Icon && <Icon size={10} />}
      {value}{label && <span className="opacity-70">{label}</span>}
    </span>
  );
};

export default MacroPill;
