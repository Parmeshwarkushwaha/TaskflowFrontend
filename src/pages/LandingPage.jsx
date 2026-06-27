import { Link } from 'react-router-dom';
import Card from '../components/Card';

function LandingPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
      <Card className="w-full max-w-4xl space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400">TaskFlow</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white sm:text-6xl">Manage work with clarity and speed.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            TaskFlow is a modern task management workspace for boards, team alignment, and intelligent effort planning.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link to="/register" className="rounded-full bg-sky-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
            Start free
          </Link>
          <Link to="/login" className="rounded-full border border-slate-700 px-6 py-4 text-sm text-slate-100 transition hover:border-slate-500">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default LandingPage;
