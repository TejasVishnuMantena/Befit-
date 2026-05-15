import React from 'react';
import Layout from '../components/common/Layout';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const sliderCards = [
  {
    icon: "🏃",
    title: "Running Session",
    subtitle: "Cardio + Endurance",
    stat: "5.2 KM"
  },
  {
    icon: "🏋️",
    title: "Weight Lifting",
    subtitle: "Strength Training",
    stat: "Upper Body"
  },
  {
    icon: "🔥",
    title: "Calories Burned",
    subtitle: "Today's Burn",
    stat: "1240 kcal"
  },
  {
    icon: "🎯",
    title: "Goal Progress",
    subtitle: "Weekly Discipline",
    stat: "84%"
  }
];

const stats = [
  {
    title: "Calories Burned",
    value: "1,240",
    icon: "🔥",
    growth: "+12%"
  },
  {
    title: "Protein Intake",
    value: "132g",
    icon: "🥩",
    growth: "+8%"
  },
  {
    title: "Workout Hours",
    value: "7.5h",
    icon: "🏋️",
    growth: "+15%"
  },
  {
    title: "Goal Progress",
    value: "84%",
    icon: "🎯",
    growth: "+20%"
  }
];

const recentActivities = [
  {
    title: "Morning Run Completed",
    time: "Today • 7:30 AM",
    icon: "🏃"
  },
  {
    title: "Protein Goal Achieved",
    time: "Today • 1:15 PM",
    icon: "🥩"
  },
  {
    title: "Strength Workout Logged",
    time: "Yesterday • 6:45 PM",
    icon: "🏋️"
  }
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="space-y-8">

        {/* HERO SECTION */}
        <div className="glass-card p-8 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* LEFT SECTION */}
            <div>
              <p className="text-emerald-600 font-semibold mb-2">
                Welcome Back 👋
              </p>

              <h1 className="text-5xl font-black text-gray-800 leading-tight mb-4">
                Hello {user?.name},
                <br />
                Keep Moving.
                <br />
                Keep Winning.
              </h1>

              <p className="text-gray-500 text-lg mb-8">
                Your discipline builds your body.
                Your effort creates your result.
                Stay consistent. Stay strong.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="btn-primary text-lg px-8 py-4">
                  Start Today’s Workout →
                </button>

                <button className="px-8 py-4 rounded-2xl border border-gray-300 font-semibold hover:bg-gray-50 transition">
                  View Progress
                </button>
              </div>
            </div>

            {/* RIGHT PREMIUM SLIDER */}
            <div className="relative w-full max-w-[520px] h-[380px] flex items-center overflow-hidden mx-auto">

              <motion.div
                className="flex gap-6"
                animate={{
                  x: [0, -280, -560, -840, 0]
                }}
                transition={{
                  duration: 16,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {[...sliderCards, ...sliderCards].map((card, index) => (
                  <div
                    key={index}
                    className="min-w-[260px] bg-white border border-gray-200 rounded-3xl p-6 shadow-sm"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-4xl mb-5">
                      {card.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800">
                      {card.title}
                    </h3>

                    <p className="text-gray-500 mt-2">
                      {card.subtitle}
                    </p>

                    <p className="text-emerald-600 font-bold text-lg mt-4">
                      {card.stat}
                    </p>
                  </div>
                ))}
              </motion.div>

            </div>

          </div>
        </div>

        {/* STATS SECTION */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {stats.map((item) => (
            <div
              key={item.title}
              className="glass-card p-6 hover:scale-105 transition duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">
                  {item.icon}
                </div>

                <span className="text-sm font-semibold text-emerald-600">
                  {item.growth}
                </span>
              </div>

              <h2 className="text-3xl font-black text-gray-800">
                {item.value}
              </h2>

              <p className="text-gray-500 mt-2">
                {item.title}
              </p>
            </div>
          ))}

        </div>

        {/* WEEKLY PROGRESS + MOTIVATION */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Weekly Progress */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6">
              Weekly Progress
            </h2>

            <div className="space-y-6">

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Workout Consistency</span>
                  <span className="font-semibold">90%</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: "90%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Nutrition Discipline</span>
                  <span className="font-semibold">76%</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: "76%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Goal Completion</span>
                  <span className="font-semibold">84%</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: "84%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Sleep Recovery</span>
                  <span className="font-semibold">71%</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: "71%" }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Motivation Zone */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6">
              Motivation Zone
            </h2>

            <div className="h-full flex flex-col justify-center">

              <p className="text-3xl font-black leading-relaxed text-gray-800">
                “Discipline is choosing
                what you want most
                over what you want now.”
              </p>

              <p className="text-emerald-600 font-semibold mt-6">
                — BeFit Mindset
              </p>

              <div className="mt-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                <p className="text-sm text-gray-700 font-medium">
                  Today’s Reminder:
                </p>

                <p className="text-lg font-bold text-gray-800 mt-2">
                  Small progress every single day creates massive transformation.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* RECENT ACTIVITY + AI INSIGHTS */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Recent Activity */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6">
              Recent Activity
            </h2>

            <div className="space-y-5">

              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl">
                    {activity.icon}
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800">
                      {activity.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* AI Insights */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6">
              AI Insights 🤖
            </h2>

            <div className="space-y-5">

              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                <h3 className="font-bold text-gray-800">
                  Recovery Suggestion
                </h3>

                <p className="text-gray-600 mt-2">
                  Your training intensity is high this week.
                  Consider adding 1 active recovery session.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100">
                <h3 className="font-bold text-gray-800">
                  Nutrition Alert
                </h3>

                <p className="text-gray-600 mt-2">
                  Protein intake is slightly below your target.
                  Add one more high-protein meal today.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                <h3 className="font-bold text-gray-800">
                  Goal Achievement
                </h3>

                <p className="text-gray-600 mt-2">
                  You are 84% on track for your monthly body transformation goal.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
}