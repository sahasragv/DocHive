import {
  ChevronRight,
  LogOut,
  Search,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [search, setSearch] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = user?.name
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => name[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const getPageName = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/upload':
        return 'Upload';
      case '/documents':
        return 'Documents';
      case '/chat':
        return 'AI Chat';
      case '/architecture':
        return 'AI Architecture';
      case '/retrieval':
        return 'Retrieval Explorer';
      default:
        return 'Dashboard';
    }
  };

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/documents?search=${encodeURIComponent(query)}` : '/documents');
    setSearch('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-violet-100 bg-white/90 shadow-[0_1px_0_rgba(118,83,214,0.05)] backdrop-blur">
      <div className="flex h-20 items-center justify-between px-8">
        {/* Left */}
        <div>
          {/* Breadcrumb */}
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
            <span>Home</span>

            <ChevronRight
              size={15}
              className="text-slate-400"
            />

            <span className="font-medium text-slate-700">
              {getPageName()}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {getPageName()}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <form onSubmit={submitSearch} className="relative hidden lg:block">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search documents..."
              className="w-80 rounded-2xl border border-violet-100 bg-[#faf8ff] py-3 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-[#7653d6] focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </form>

          {/* User */}
          <div className="relative">
          <button type="button" onClick={() => setProfileOpen((current) => !current)} aria-label="Open profile menu" aria-expanded={profileOpen} className="flex min-w-56 items-center gap-4 rounded-2xl border border-violet-100 bg-white px-5 py-3 text-left transition hover:border-violet-300 hover:shadow-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#7653d6] to-[#f05b8d] text-lg font-semibold text-white shadow-sm shadow-violet-200">
              {initials}
            </div>

            <div className="hidden min-w-0 flex-1 text-left md:block">
              <p className="truncate text-base font-semibold text-slate-900">
                {user?.name}
              </p>

              <p className="mt-0.5 truncate text-sm text-slate-500">
                {user?.email}
              </p>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#7653d6]">{user?.role}</p>
            </div>
          </button>
          {profileOpen && <div className="absolute right-0 top-16 z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"><div className="border-b border-slate-100 p-4"><p className="font-semibold text-slate-900">{user?.name}</p><p className="mt-1 truncate text-sm text-slate-500">{user?.email}</p><span className="mt-3 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold capitalize text-blue-700">{user?.role ?? 'Member'}</span></div><div className="p-2"><button type="button" onClick={() => { navigate('/architecture'); setProfileOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"><Settings size={17} className="text-slate-400" /> Workspace overview</button><button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"><LogOut size={17} /> Log out</button></div></div>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
