import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-slate-900">Welcome to Saradhi AI</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to continue</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-purple-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-purple-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition hover:bg-purple-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
