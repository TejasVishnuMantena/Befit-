import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: '🏋️',
    title: 'Workout Tracking',
    desc: 'Track exercises, calories burned, and your complete fitness journey.'
  },
  {
    icon: '🥗',
    title: 'Nutrition Logger',
    desc: 'Log meals, calories, proteins, carbs, and maintain your diet.'
  },
  {
    icon: '🎯',
    title: 'Goal Setting',
    desc: 'Set smart goals and track your progress every single day.'
  },
  {
    icon: '🤖',
    title: 'AI Insights',
    desc: 'Get personalized recommendations based on your fitness data.'
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    desc: 'Visualize your performance using powerful charts and reports.'
  },
  {
    icon: '📱',
    title: 'Responsive Design',
    desc: 'Use BeFit smoothly on mobile, tablet, laptop, and desktop.'
  }
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '500K+', label: 'Workouts Logged' },
  { value: '1M+', label: 'Meals Tracked' },
  { value: '95%', label: 'Goal Success' }
];

export default function LandingPage() {
  const { user } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-800">

      {/* Navbar */}
      <nav className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-xl font-bold">
              B
            </div>
            <div>
              <h1 className="text-xl font-black">BeFit</h1>
              <p className="text-xs text-gray-500">Your Effort. Your Result.</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-emerald-600">Features</a>
            <a href="#stats" className="hover:text-emerald-600">Stats</a>
            <a href="#about" className="hover:text-emerald-600">About</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="btn-primary"
              >
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-xl border border-gray-300 font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto">

          <div className="inline-block px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 font-medium text-sm mb-6">
            Smart Fitness Tracking Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Your Fitness.
            <br />
            <span className="gradient-text">
              Your Discipline.
            </span>
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed mb-10">
            BeFit helps you track workouts, meals, goals, and health progress
            with smart insights and a clean professional dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-primary text-lg px-8 py-4"
            >
              Start Free Today
            </Link>

            <Link
              to="/login"
              className="btn-secondary text-lg px-8 py-4"
            >
              Login
            </Link>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {stats.map((item) => (
            <div
              key={item.label}
              className="glass-card p-6 text-center"
            >
              <h2 className="text-3xl font-black text-emerald-600 mb-2">
                {item.value}
              </h2>
              <p className="text-gray-500 text-sm">
                {item.label}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black mb-4">
            Everything You Need
          </h2>

          <p className="text-gray-500 max-w-2xl mx-auto">
            A complete platform for your workouts, nutrition,
            fitness goals, and personal health growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card p-6"
            >
              <div className="text-3xl mb-4">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-500 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <h3 className="text-lg font-bold mb-2">
            BeFit
          </h3>

          <p className="text-gray-500">
            Your Effort. Your Result.
          </p>
        </div>
      </footer>

    </div>
  );
}