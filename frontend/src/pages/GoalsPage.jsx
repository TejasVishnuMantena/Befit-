// ============================================================
// pages/GoalsPage.jsx - Fitness Goal Setting & Progress
// ============================================================
import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import Layout from '../components/common/Layout';
import toast from 'react-hot-toast';

const FITNESS_GOALS = [
  { value: 'lose_weight',       label: 'Lose Weight',         icon: '📉' },
  { value: 'gain_muscle',       label: 'Gain Muscle',         icon: '💪' },
  { value: 'maintain',          label: 'Maintain Weight',     icon: '⚖️' },
  { value: 'improve_endurance', label: 'Improve Endurance',   icon: '🏃' },
];

export default function GoalsPage() {
  const [form, setForm] = useState({
    targetWeight: '', dailyCalories: 2000, dailyProtein: 50,
    dailyWater: 2.5, weeklyWorkouts: 3, fitnessGoal: 'maintain',
  });
  const [todayProgress, setTodayProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [hasGoal, setHasGoal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/goals');
        if (data.goal) {
          setHasGoal(true);
          setForm({
            targetWeight:   data.goal.targetWeight   || '',
            dailyCalories:  data.goal.dailyCalories  || 2000,
            dailyProtein:   data.goal.dailyProtein   || 50,
            dailyWater:     data.goal.dailyWater     || 2.5,
            weeklyWorkouts: data.goal.weeklyWorkouts || 3,
            fitnessGoal:    data.goal.fitnessGoal    || 'maintain',
          });
        }
        setTodayProgress(data.todayProgress || {});
      } catch { toast.error('Failed to load goals.'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/goals', {
        ...form,
        targetWeight:   form.targetWeight ? Number(form.targetWeight) : undefined,
        dailyCalories:  Number(form.dailyCalories),
        dailyProtein:   Number(form.dailyProtein),
        dailyWater:     Number(form.dailyWater),
        weeklyWorkouts: Number(form.weeklyWorkouts),
      });
      toast.success('Goals saved! You got this 🎯');
      setHasGoal(true);
    } catch { toast.error('Failed to save goals.'); }
    finally { setSaving(false); }
  };

  const progressPct = (current, goal) => goal ? Math.min(Math.round((current / goal) * 100), 100) : 0;
  const calPct  = progressPct(todayProgress.caloriesConsumed || 0, form.dailyCalories);
  const protPct = progressPct(todayProgress.proteinConsumed  || 0, form.dailyProtein);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Fitness Goals 🎯</h1>
        <p className="text-slate-400 mt-1">Set your targets and track daily progress</p>
      </div>

      {/* Today's Progress */}
      {hasGoal && (
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="glass-card p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-300 font-medium">🔥 Calories Today</span>
              <span className="text-green-400 font-bold">{calPct}%</span>
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-2xl font-bold text-white">{todayProgress.caloriesConsumed || 0}</span>
              <span className="text-slate-500 text-sm mb-0.5">/ {form.dailyCalories} kcal</span>
            </div>
            <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${calPct}%` }} /></div>
          </div>
          <div className="glass-card p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-300 font-medium">🥩 Protein Today</span>
              <span className="text-blue-400 font-bold">{protPct}%</span>
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-2xl font-bold text-white">{Math.round(todayProgress.proteinConsumed || 0)}</span>
              <span className="text-slate-500 text-sm mb-0.5">/ {form.dailyProtein} g</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${protPct}%`, background: 'linear-gradient(90deg,#2563eb,#3b82f6)' }} />
            </div>
          </div>
        </div>
      )}

      {/* Goal Setting Form */}
      <div className="glass-card p-8">
        <h2 className="text-white font-bold text-xl mb-6">
          {hasGoal ? 'Update Your Goals' : 'Set Your Goals'}
        </h2>

        {loading ? (
          <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fitness Goal Type */}
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-3">Primary Fitness Goal</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FITNESS_GOALS.map(g => (
                  <button key={g.value} type="button"
                    onClick={() => setForm({ ...form, fitnessGoal: g.value })}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      form.fitnessGoal === g.value
                        ? 'border-green-500 bg-green-500/15 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/30'
                    }`}>
                    <div className="text-2xl mb-1">{g.icon}</div>
                    <div className="text-sm font-medium">{g.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Numeric Goals */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">🎯 Target Weight (kg)</label>
                <input type="number" value={form.targetWeight}
                  onChange={e => setForm({ ...form, targetWeight: e.target.value })}
                  className="input-field" placeholder="e.g. 70" min="20" />
                <p className="text-slate-600 text-xs mt-1">Leave blank if no weight goal</p>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">🔥 Daily Calories (kcal)</label>
                <input type="number" value={form.dailyCalories}
                  onChange={e => setForm({ ...form, dailyCalories: e.target.value })}
                  className="input-field" placeholder="2000" min="500" max="10000" required />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">🥩 Daily Protein (g)</label>
                <input type="number" value={form.dailyProtein}
                  onChange={e => setForm({ ...form, dailyProtein: e.target.value })}
                  className="input-field" placeholder="50" min="10" required />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">💧 Daily Water (liters)</label>
                <input type="number" value={form.dailyWater} step="0.5"
                  onChange={e => setForm({ ...form, dailyWater: e.target.value })}
                  className="input-field" placeholder="2.5" min="0.5" max="10" />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">🏋️ Workouts per Week</label>
                <input type="number" value={form.weeklyWorkouts}
                  onChange={e => setForm({ ...form, weeklyWorkouts: e.target.value })}
                  className="input-field" placeholder="3" min="1" max="14" />
              </div>
            </div>

            <button type="submit" disabled={saving}
              className="btn-primary px-10 py-3 text-base flex items-center gap-2 disabled:opacity-60">
              {saving
                ? <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Saving...</>
                : '✓ Save Goals'}
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
}
