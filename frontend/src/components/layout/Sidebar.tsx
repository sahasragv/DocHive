import {
  LayoutDashboard,
  Upload,
  Files,
  MessageSquare,
  LogOut,
  HardDrive,
  ChevronRight,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
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
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col bg-slate-900 text-white shadow-2xl">
      {/* Logo */}
      <div className="border-b border-slate-800 px-6 py-6">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="DocHive"
            className="h-12 w-12 rounded-xl"
          />

          <div>
            <h1 className="text-xl font-bold tracking-tight">DocHive</h1>

            <p className="text-xs text-slate-400">
              Enterprise AI Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
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
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
          <div className="mb-3 flex items-center gap-2">
            <HardDrive
              size={18}
              className="text-blue-400"
            />

            <span className="font-medium">Storage</span>
          </div>

          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Used
            </span>

            <span className="font-medium">
              2.4 GB / 10 GB
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-700">
            <div className="h-full w-[24%] rounded-full bg-blue-500 transition-all" />
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Plenty of storage remaining.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 p-5">
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-800 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
            DH
          </div>

          <div className="min-w-0">
            <p className="truncate font-medium">
              DocHive User
            </p>

            <p className="truncate text-xs text-slate-400">
              Enterprise Workspace
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 font-medium text-slate-200 transition hover:border-red-500 hover:bg-red-500 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;