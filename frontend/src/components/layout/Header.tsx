import {
  Bell,
  ChevronRight,
  Search,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

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
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
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
          <div className="relative hidden lg:block">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search documents..."
              className="w-80 rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Notifications */}
          <button className="relative rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-blue-500 hover:bg-blue-50">
            <Bell
              size={20}
              className="text-slate-600"
            />

            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
          </button>

          {/* User */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 transition hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
              DH
            </div>

            <div className="hidden text-left md:block">
              <p className="text-sm font-semibold text-slate-900">
                DocHive User
              </p>

              <p className="text-xs text-slate-500">
                Enterprise Workspace
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;