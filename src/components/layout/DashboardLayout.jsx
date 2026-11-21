import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Compass,
  Film,
  FolderKanban,
  Handshake,
  Inbox,
  LayoutDashboard,
  LogOut,
  User,
} from 'lucide-react';
import Logo from '../common/Logo';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestsContext';
import { useToast } from '../../context/ToastContext';

// Sidebar-er menu. showBadge: true hole pending request-er count dekhabe.
const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/matches', label: 'My Matches', icon: Handshake },
  { to: '/requests', label: 'Requests', icon: Inbox, showBadge: true },
  { to: '/sessions', label: 'Sessions', icon: CalendarDays },
  { to: '/recordings', label: 'Recordings', icon: Film },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/profile', label: 'My Profile', icon: User },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { pendingReceivedCount } = useRequests();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    showToast('You have been logged out.');
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <Avatar name={user.name} color={user.avatarColor} size="sm" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row">
        <aside className="md:w-56 md:shrink-0">
          <nav className="flex gap-1 overflow-x-auto md:flex-col">
            {navItems.map(({ to, label, icon: Icon, showBadge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
                {showBadge && pendingReceivedCount > 0 && (
                  <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                    {pendingReceivedCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}