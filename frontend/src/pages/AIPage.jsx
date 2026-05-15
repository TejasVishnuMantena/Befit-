// ============================================================
// pages/AIPage.jsx - AI-Powered Fitness Suggestions
// ============================================================
import React, { useState } from 'react';
import API from '../utils/api';
import Layout from '../components/common/Layout';
import toast from 'react-hot-toast';

const priorityColors = {
  high:   'border-red-500/40 bg-red-500/5',
  medium: 'border-yellow-500/40 bg-yellow-500/5',
  low:    'border-green-500/40 bg-green-500/5',
};
const priorityBadge = {
  high:   'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low:    'bg-green-500/20 text-green-400',
};

export default function AIPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [summary, setSummary]         = useState(null);
  const [loading, setLoading]         = useState(false);
  const [generated, setGenerated]     = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/ai/suggestions');
      setSuggestions(data.suggestions || []);
      setSummary(data.summary || null);
      setGenerated(true);
      toast.success('AI insights generated! 🤖');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate suggestions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">AI Health Insights 🤖</h1>
        <p className="text-slate-400 mt-1">Personalized recommendations based on your fitness data</p>
      </div>

      {/* Hero / Generate Button */}
      {!generated && (
        <div className="glass-card p-12 text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-purple-500/20">
            🤖
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Get Your AI Analysis</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
            Our AI analyzes your last 7 days of workouts, meals, and goals to generate
            personalized fitness recommendations just for you.
          </p>
          <button onClick={generate} disabled={loading}
            className="btn-primary px-10 py-3.5 text-base shadow-xl shadow-green-500/20 flex items-center gap-3 mx-auto disabled:opacity-60">
            {loading
              ? <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Analyzing your data...</>
              : <><span>✨</span> Generate AI Insights</>}
          </button>
        </div>
      )}

      {/* Data Summary */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 animate-fade-in">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{summary.avgDailyCalories}</div>
            <div className="text-slate-400 text-xs mt-1">Avg Daily Calories</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{summary.avgDailyProtein}g</div>
            <div className="text-slate-400 text-xs mt-1">Avg Daily Protein</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{summary.workoutsPerWeek}</div>
            <div className="text-slate-400 text-xs mt-1">Workouts This Week</div>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">
              {suggestions.length} Personalized Recommendations
            </h2>
            <button onClick={generate} disabled={loading}
              className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center gap-1.5 disabled:opacity-50">
              <span>↻</span> Refresh
            </button>
          </div>

          {suggestions.map((s, i) => (
            <div key={i}
              className={`glass-card p-6 border ${priorityColors[s.priority]} animate-fade-in`}
              style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {s.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-white font-bold">{s.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${priorityBadge[s.priority]}`}>
                      {s.priority} priority
                    </span>
                    <span className="text-slate-600 text-xs">{s.category}</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{s.message}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="glass-card p-4 text-center mt-6">
            <p className="text-slate-500 text-xs">
              💡 AI insights are based on your logged data from the last 7 days.
              The more you log, the better the recommendations!
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
}
