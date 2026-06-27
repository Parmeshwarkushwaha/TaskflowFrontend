function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/70 p-10 text-center">
      <p className="text-sm uppercase tracking-[0.25em] text-sky-400">{title}</p>
      <p className="mt-4 text-slate-300">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default EmptyState;
