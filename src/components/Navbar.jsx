import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-semibold tracking-tight text-white">
          TaskFlow
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-300">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
              <span className="hidden sm:inline-block">{user?.name}</span>
              <button type="button" onClick={handleLogout} className="rounded-full bg-slate-800 px-3 py-2 text-sm text-slate-100 transition hover:bg-slate-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-white">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-slate-800 px-3 py-2 text-sm text-slate-100 transition hover:bg-slate-700">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
