import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: '📊',
    description: 'Track your fitness journey'
  },
  {
    name: 'Workout',
    path: '/workouts',
    icon: '🏋️',
    description: 'Manage your training sessions'
  },
  {
    name: 'Nutrition',
    path: '/nutrition',
    icon: '🥗',
    description: 'Monitor your meal plans'
  },
  {
    name: 'Goals',
    path: '/goals',
    icon: '🎯',
    description: 'Set and achieve targets'
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: '👤',
    description: 'Your personal fitness profile'
  },
  {
    name: 'AI Insights',
    path: '/ai',
    icon: '🤖',
    description: 'Smart fitness recommendations'
  }
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-8 py-5">

        {/* Top Row */}
        <div className="flex items-center justify-between">

          {/* Left Section */}
          <div className="flex items-center gap-12">

            {/* Brand Logo + Name */}
            <Link
              to="/dashboard"
              className="flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-2xl shadow-md text-white">
                💪
              </div>

              <div>
                <h1 className="text-3xl font-black text-gray-800 leading-none">
                  BeFit
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Your Effort. Your Result.
                </p>
              </div>
            </Link>

            {/* Horizontal Navigation */}
            <nav className="hidden lg:flex items-center gap-3">

              {menuItems.map((item) => {
                const active = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group px-5 py-3 rounded-2xl transition-all duration-300 ${
                      active
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">

                      <span className="text-lg">
                        {item.icon}
                      </span>

                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          {item.name}
                        </span>

                        <span
                          className={`text-xs ${
                            active
                              ? 'text-white/80'
                              : 'text-gray-400'
                          }`}
                        >
                          {item.description}
                        </span>
                      </div>

                    </div>
                  </Link>
                );
              })}

            </nav>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-6">

            {/* Daily Motivation */}
            <Link
              to="/goals"
              className="text-right block hover:opacity-80 transition"
            >
              <p className="text-sm font-semibold text-gray-700">
                Stay Consistent 🔥
              </p>

              <p className="text-xs text-gray-500">
                Small progress every day
              </p>
            </Link>

            {/* Profile Quick Avatar */}
            <Link
              to="/profile"
              className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xl border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 transition"
            >
              👤
            </Link>

          </div>

        </div>

        {/* Bottom Mobile Navigation */}
        <div className="lg:hidden mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">

          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium ${
                  active
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {item.icon} {item.name}
              </Link>
            );
          })}

        </div>

      </div>

    </header>
  );
}