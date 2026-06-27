import { Link } from 'react-router-dom';
import Card from '../components/Card';

function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen items-center justify-center px-4 py-20 sm:px-6">
      <Card className="w-full max-w-xl text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-sky-400">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Page not found</h1>
        <p className="mt-3 text-slate-400">The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="mt-8 inline-flex rounded-full bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700">
          Return home
        </Link>
      </Card>
    </div>
  );
}

export default NotFoundPage;
