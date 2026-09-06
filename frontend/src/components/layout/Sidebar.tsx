import {
  LayoutDashboard,
  Upload,
  Files,
  MessageSquare,
  Workflow,
  ScanSearch,
  LogOut,
  HardDrive,
  ChevronRight,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout: clearSession, user } = useAuth();

  const initials = user?.name
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => name[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const logout = () => {
    clearSession();
    navigate('/login');
  };

  const menu = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      name: 'Upload',
      icon: Upload,
      path: '/upload',
    },
    {
      name: 'Documents',
      icon: Files,
      path: '/documents',
    },
    {
      name: 'AI Chat',
      icon: MessageSquare,
      path: '/chat',
    },
    {
      name: 'AI Architecture',
      icon: Workflow,
      path: '/architecture',
    },
    {
      name: 'Retrieval Explorer',
      icon: ScanSearch,
      path: '/retrieval',
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col overflow-hidden border-r border-violet-100 bg-[#fbfaff] text-slate-800 shadow-[8px_0_35px_rgba(91,52,182,0.08)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-[url('/sidebar-wave.jpg')] bg-cover bg-center opacity-100" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-white/10 via-transparent to-[#fbfaff]/85" />
      {/* Logo */}
      <div className="relative border-b border-violet-100 bg-gradient-to-br from-[#e2f7ff] via-[#f2edff] to-[#ffe5ef] px-6 py-6">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="DocHive"
            className="h-12 w-12 rounded-xl"
          />

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">DocHive</h1>

            <p className="text-xs text-[#7653d6]">
              Enterprise AI Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-[#7653d6]">
          Navigation
        </p>

        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200 ${
                    isActive
                    ? 'bg-gradient-to-r from-[#f7b5ca] to-[#fcd8e5] text-[#6b2851] shadow-sm shadow-pink-200'
                      : 'text-slate-600 hover:bg-[#f1edff] hover:text-[#5834b6]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />

                  <span className="font-medium">{item.name}</span>
                </div>

                <ChevronRight
                  size={16}
                  className="opacity-40 transition group-hover:translate-x-1 group-hover:opacity-100"
                />
              </NavLink>
            );
          })}
        </nav>

        {/* Storage Card */}
        <div className="mt-10 rounded-2xl border border-violet-100 bg-white/75 p-4 shadow-sm backdrop-blur">
          <div className="mb-3 flex items-center gap-2">
            <HardDrive
              size={18}
              className="text-[#7653d6]"
            />

            <span className="font-medium">Storage</span>
          </div>

          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Used
            </span>

            <span className="font-medium">
              2.4 GB / 10 GB
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-violet-100">
            <div className="h-full w-[24%] rounded-full bg-gradient-to-r from-[#7653d6] to-[#f05b8d] transition-all" />
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Plenty of storage remaining.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-violet-100 bg-transparent p-5">
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/65 p-3 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#7653d6] to-[#f05b8d] text-sm font-bold text-white">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">
              {user?.name}
            </p>

            <p className="truncate text-xs text-slate-400">
              {user?.email}
            </p>

            <p className="truncate text-xs font-medium uppercase text-[#7653d6]">
              {user?.role}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 font-medium text-slate-600 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
