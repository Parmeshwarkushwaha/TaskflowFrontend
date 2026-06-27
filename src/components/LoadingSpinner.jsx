function LoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-sky-500" />
    </div>
  );
}

export default LoadingSpinner;
