import React from 'react';
import Layout from '../components/common/Layout';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="space-y-8">

        {/* TOP PROFILE CARD */}
        <div className="glass-card p-8">

          <div className="flex flex-col md:flex-row items-center gap-8">

            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-emerald-500 flex items-center justify-center text-white text-5xl font-black shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-black text-gray-800">
                {user?.name}
              </h1>

              <p className="text-gray-500 text-lg mt-2">
                {user?.email}
              </p>

              <div className="flex gap-3 mt-5 flex-wrap">

                <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                  Premium Member
                </span>

                <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium">
                  Goal Crusher
                </span>

                <span className="px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-medium">
                  120 Day Streak
                </span>

              </div>
            </div>

          </div>
        </div>

        {/* BODY SECTION */}
        <div className="grid lg:grid-cols-2 gap-6">

          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6">
              Personal Details
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-gray-500">Full Name</p>
                <h3 className="font-bold text-lg">{user?.name}</h3>
              </div>

              <div>
                <p className="text-gray-500">Email</p>
                <h3 className="font-bold text-lg">{user?.email}</h3>
              </div>

              <div>
                <p className="text-gray-500">Role</p>
                <h3 className="font-bold text-lg">{user?.role}</h3>
              </div>

            </div>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6">
              Fitness Identity
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-gray-500">Primary Goal</p>
                <h3 className="font-bold text-lg">
                  Muscle Gain 💪
                </h3>
              </div>

              <div>
                <p className="text-gray-500">Current Streak</p>
                <h3 className="font-bold text-lg">
                  120 Days 🔥
                </h3>
              </div>

              <div>
                <p className="text-gray-500">Level</p>
                <h3 className="font-bold text-lg">
                  Advanced Athlete 🏆
                </h3>
              </div>

            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
}