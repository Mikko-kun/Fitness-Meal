const TagBadge = ({ tag }) => {
  const styles = {
    "High Protein": "bg-sky-500/15 text-sky-400 border-sky-500/25",
    "Low Carb": "bg-rose-500/15 text-rose-400 border-rose-500/25",
    "Balanced": "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    "High Carb": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${styles[tag] || "bg-zinc-700 text-zinc-400 border-zinc-600"}`}>
      {tag}
    </span>
  );
};

export default TagBadge;
