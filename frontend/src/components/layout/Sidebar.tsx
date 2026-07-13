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
      icon: '🏠',
      path: '/dashboard',
    },
    {
      name: 'Upload',
      icon: '⬆️',
      path: '/upload',
    },
    {
      name: 'Documents',
      icon: '📄',
      path: '/documents',
    },
    {
      name: 'AI Chat',
      icon: '💬',
      path: '/chat',
    },
  ];

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-violet-100 bg-white">

      <div className="flex items-center gap-3 border-b border-violet-100 p-6">

        <img
          src="/logo.png"
          alt="DocHive"
          className="h-12 w-12"
        />

        <div>
          <h1 className="text-2xl font-bold text-violet-700">
            DocHive
          </h1>

          <p className="text-xs text-slate-500">
            Enterprise AI Platform
          </p>
        </div>

      </div>

      <nav className="flex-1 space-y-2 p-5">

        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive
                  ? 'bg-violet-100 font-semibold text-violet-700'
                  : 'text-slate-600 hover:bg-violet-50'
              }`
            }
          >
            <span className="text-xl">
              {item.icon}
            </span>

            {item.name}
          </NavLink>
        ))}

      </nav>

      <div className="border-t border-violet-100 p-5">

        <button
          onClick={logout}
          className="w-full rounded-xl bg-violet-600 px-4 py-3 font-medium text-white hover:bg-violet-700"
        >
          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;