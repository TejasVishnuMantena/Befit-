// ============================================================
// pages/NutritionPage.jsx - Meal / Nutrition Tracker
// ============================================================
import React, { useState, useEffect, useCallback } from 'react';
import API from '../utils/api';
import Layout from '../components/common/Layout';
import toast from 'react-hot-toast';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

const initialForm = {
  mealName: '', mealType: 'breakfast', calories: '',
  protein: '', carbs: '', fats: '', fiber: '',
  date: new Date().toISOString().split('T')[0],
};

const mealTypeColors = {
  breakfast: 'bg-yellow-500/20 text-yellow-400',
  lunch: 'bg-green-500/20 text-green-400',
  dinner: 'bg-blue-500/20 text-blue-400',
  snack: 'bg-orange-500/20 text-orange-400',
};

const mealTypeIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };

export default function NutritionPage() {
  const [meals, setMeals] = useState([]);
  const [dailyTotals, setDailyTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchMeals = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 8 });
      if (filterType !== 'all') params.append('mealType', filterType);

      const { data } = await API.get(`/meals?${params}`);
      setMeals(data.meals);
      setDailyTotals(data.dailyTotals || {});
      setPagination(data.pagination);
    } catch (err) {
      toast.error('Failed to load meals.');
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => { fetchMeals(1); }, [fetchMeals]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.mealName || !form.calories) {
      return toast.error('Meal name and calories are required.');
    }
    setSubmitting(true);
    try {
      await API.post('/meals', {
        ...form,
        calories: Number(form.calories),
        protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0,
        fats: Number(form.fats) || 0,
        fiber: Number(form.fiber) || 0,
      });
      toast.success('Meal logged! 🥗');
      setForm(initialForm);
      setShowForm(false);
      fetchMeals(1);
    } catch (err) {
      toast.error('Failed to log meal.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this meal?')) return;
    try {
      await API.delete(`/meals/${id}`);
      toast.success('Meal deleted.');
      fetchMeals(pagination.page);
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Nutrition Tracker 🥗</h1>
          <p className="text-slate-400 mt-1">Log meals and track your daily macros</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary px-6 py-2.5">
          {showForm ? '✕ Cancel' : '+ Log Meal'}
        </button>
      </div>

      {/* Today's Totals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Calories', value: Math.round(dailyTotals.totalCalories || 0), unit: 'kcal', icon: '🔥', color: 'text-orange-400' },
          { label: 'Protein', value: Math.round(dailyTotals.totalProtein || 0), unit: 'g', icon: '🥩', color: 'text-red-400' },
          { label: 'Carbs', value: Math.round(dailyTotals.totalCarbs || 0), unit: 'g', icon: '🌾', color: 'text-yellow-400' },
          { label: 'Fats', value: Math.round(dailyTotals.totalFats || 0), unit: 'g', icon: '🫙', color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className={`text-xl font-bold ${s.color}`}>{s.value}<span className="text-xs text-slate-500 ml-1">{s.unit}</span></div>
            <div className="text-slate-500 text-xs">Today's {s.label}</div>
          </div>
        ))}
      </div>

      {/* Add Meal Form */}
      {showForm && (
        <div className="glass-card p-6 mb-8 animate-fade-in">
          <h2 className="text-white font-bold text-lg mb-5">Log a Meal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Meal Name *</label>
                <input type="text" name="mealName" value={form.mealName}
                  onChange={e => setForm({ ...form, mealName: e.target.value })}
                  className="input-field" placeholder="e.g. Oatmeal with banana" required />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Meal Type</label>
                <select name="mealType" value={form.mealType}
                  onChange={e => setForm({ ...form, mealType: e.target.value })}
                  className="input-field">
                  {MEAL_TYPES.map(t => <option key={t} value={t} className="bg-slate-800 capitalize">{t}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Calories *</label>
                <input type="number" name="calories" value={form.calories}
                  onChange={e => setForm({ ...form, calories: e.target.value })}
                  className="input-field" placeholder="350" min="0" required />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Protein (g)</label>
                <input type="number" name="protein" value={form.protein}
                  onChange={e => setForm({ ...form, protein: e.target.value })}
                  className="input-field" placeholder="20" min="0" />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Carbs (g)</label>
                <input type="number" name="carbs" value={form.carbs}
                  onChange={e => setForm({ ...form, carbs: e.target.value })}
                  className="input-field" placeholder="45" min="0" />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Fats (g)</label>
                <input type="number" name="fats" value={form.fats}
                  onChange={e => setForm({ ...form, fats: e.target.value })}
                  className="input-field" placeholder="10" min="0" />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Fiber (g)</label>
                <input type="number" name="fiber" value={form.fiber}
                  onChange={e => setForm({ ...form, fiber: e.target.value })}
                  className="input-field" placeholder="5" min="0" />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="btn-primary px-8 py-2.5 disabled:opacity-60 flex items-center gap-2">
                {submitting ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</> : '✓ Save Meal'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-xl border border-white/20 text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', ...MEAL_TYPES].map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              filterType === t ? 'bg-green-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}>
            {t === 'all' ? '🍽️ All' : `${mealTypeIcons[t]} ${t}`}
          </button>
        ))}
      </div>

      {/* Meals List */}
      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : meals.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-5xl mb-4">🥗</div>
          <h3 className="text-white font-bold text-xl mb-2">No meals logged yet</h3>
          <p className="text-slate-400">Start logging your meals to track nutrition.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-5 px-8 py-2.5">+ Log First Meal</button>
        </div>
      ) : (
        <div className="space-y-3">
          {meals.map(meal => (
            <div key={meal._id} className="glass-card p-5 flex items-center justify-between hover:border-green-500/30 transition-colors">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {mealTypeIcons[meal.mealType] || '🍽️'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{meal.mealName}</h3>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${mealTypeColors[meal.mealType] || ''}`}>
                      {meal.mealType}
                    </span>
                    <span className="text-orange-400 text-xs">🔥 {meal.calories} kcal</span>
                    <span className="text-red-400 text-xs">P: {meal.protein}g</span>
                    <span className="text-yellow-400 text-xs">C: {meal.carbs}g</span>
                    <span className="text-blue-400 text-xs">F: {meal.fats}g</span>
                    <span className="text-slate-600 text-xs">{new Date(meal.date).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => handleDelete(meal._id)}
                className="text-slate-600 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10 ml-2 flex-shrink-0">
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(pagination.pages)].map((_, i) => (
            <button key={i} onClick={() => fetchMeals(i + 1)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                pagination.page === i + 1 ? 'bg-green-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </Layout>
  );
}
