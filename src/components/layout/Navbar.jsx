import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="flex items-center gap-4">
          <a href="#how-it-works" className="hidden text-sm font-medium text-slate-600 hover:text-brand-600 sm:block">
            How it works
          </a>
          {user ? (
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-brand-600">
                Log in
              </Link>
              <Link to="/register">
                <Button>Get started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}