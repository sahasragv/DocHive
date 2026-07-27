import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { login, register } from '../../services/api';

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [success, setSuccess] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        await register({ name, email, password });

        setSuccess('Account created successfully. Please sign in.');
        setIsRegister(false);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        return;
      }

      const response = await login({
        email,
        password,
      });

      localStorage.setItem(
        'token',
        response.accessToken,
      );

      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            'Login failed',
        );
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-violet-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">

        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo.png"
            alt="DocHive Logo"
            className="h-20 w-20 mb-4"
          />

          <h1 className="text-3xl font-bold text-slate-900">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              DocHive
            </span>
          </h1>

          <p className="mt-2 text-center text-sm text-slate-500">
            Enterprise AI Knowledge Platform
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
            />
          </div>

          {isRegister && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />
            </div>
          )}

          {isRegister && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-100 border border-red-300 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-green-100 border border-green-300 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 font-semibold text-white transition duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60"
          >
            {loading
              ? isRegister
                ? 'Creating Account...'
                : 'Signing In...'
              : isRegister
              ? 'Create Account'
              : 'Sign In'}
          </button>

          <div className="mt-3 text-center">
            {!isRegister ? (
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                  setSuccess('');
                }}
                className="text-sm text-violet-600 hover:underline"
              >
                Create Account
              </button>
            ) : (
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-violet-600 hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </form>

        <div className="mt-8 border-t pt-6">
          <p className="text-center text-xs text-slate-400">
            © {new Date().getFullYear()} DocHive.
            All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;