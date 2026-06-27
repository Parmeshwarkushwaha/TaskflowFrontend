function Card({ children, className = '' }) {
  return (
    <div className={`rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-card ${className}`}>
      {children}
    </div>
  );
}

export default Card;
