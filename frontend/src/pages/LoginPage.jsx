// ============================================================
// pages/LoginPage.jsx - Updated Light Theme Login Page
// ============================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error('Please fill in all fields.');
    }

    setLoading(true);

    try {
      const { data } = await API.post('/auth/login', form);

      login(data.user, data.token);

      toast.success(
        data.message || 'Welcome back to BeFit!'
      );

      navigate('/dashboard');

    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Login failed. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">

          <Link
            to="/"
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-md text-white">
              💪
            </div>

            <div className="text-left">
              <h1 className="text-3xl font-black text-gray-800">
                BeFit
              </h1>

              <p className="text-sm text-gray-500">
                Your Effort. Your Result.
              </p>
            </div>
          </Link>

          <h2 className="text-3xl font-bold text-gray-800">
            Welcome Back 👋
          </h2>

          <p className="text-gray-500 mt-2">
            Login to continue your fitness journey
          </p>

        </div>

        {/* Login Card */}
        <div className="glass-card p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-base rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login to BeFit →'
              )}
            </button>

          </form>

          {/* Bottom Link */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-emerald-600 font-semibold hover:text-emerald-700"
            >
              Sign up free
            </Link>
          </p>

        </div>

        {/* Back Link */}
        <p className="text-center text-gray-500 text-xs mt-6">
          <Link
            to="/"
            className="hover:text-gray-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </p>

      </div>
    </div>
  );
}