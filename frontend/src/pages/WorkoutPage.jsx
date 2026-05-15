// ============================================================
// pages/WorkoutPage.jsx - Premium Workout Tracker (Light Theme)
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import API from '../utils/api';
import Layout from '../components/common/Layout';
import toast from 'react-hot-toast';

const EXERCISE_TYPES = [
  'cardio',
  'strength',
  'flexibility',
  'hiit',
  'sports',
  'other'
];

const initialForm = {
  exercise: '',
  exerciseType: 'cardio',
  duration: '',
  caloriesBurned: '',
  sets: '',
  reps: '',
  notes: '',
  date: new Date().toISOString().split('T')[0],
};

export default function WorkoutPage() {
  const [workouts, setWorkouts] = useState([]);
  const [, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  const fetchWorkouts = useCallback(async (page = 1) => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page,
        limit: 8
      });

      if (search) params.append('search', search);
      if (filterType !== 'all') params.append('type', filterType);

      const { data } = await API.get(`/workouts?${params}`);

      setWorkouts(data.workouts);
      setPagination(data.pagination);

    } catch {
      toast.error('Failed to load workouts.');
    } finally {
      setLoading(false);
    }
  }, [search, filterType]);

  useEffect(() => {
    fetchWorkouts(1);
  }, [fetchWorkouts]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.exercise || !form.duration || !form.caloriesBurned) {
      return toast.error('Exercise, duration and calories are required.');
    }

    setSubmitting(true);

    try {
      await API.post('/workouts', {
        ...form,
        duration: Number(form.duration),
        caloriesBurned: Number(form.caloriesBurned)
      });

      toast.success('Workout logged successfully 🔥');

      setForm(initialForm);
      setShowForm(false);
      fetchWorkouts(1);

    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to save workout.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workout?')) return;

    try {
      await API.delete(`/workouts/${id}`);
      toast.success('Workout deleted');
      fetchWorkouts(pagination.page);

    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <Layout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4">

          <div>
            <h1 className="text-4xl font-black text-gray-800">
              Workout Tracker
            </h1>

            <p className="text-gray-500 mt-2">
              Track every set. Every rep. Every result.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary px-6"
          >
            {showForm ? 'Cancel' : '+ Log Workout'}
          </button>

        </div>

        {/* Form */}
        {showForm && (
          <div className="glass-card p-8">

            <h2 className="text-2xl font-bold mb-6">
              Add New Workout
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              <input
                type="text"
                name="exercise"
                value={form.exercise}
                onChange={handleChange}
                className="input-field"
                placeholder="Exercise Name"
                required
              />

              <div className="grid md:grid-cols-2 gap-4">

                <select
                  name="exerciseType"
                  value={form.exerciseType}
                  onChange={handleChange}
                  className="input-field"
                >
                  {EXERCISE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="input-field"
                />

              </div>

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  type="number"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Duration (minutes)"
                  required
                />

                <input
                  type="number"
                  name="caloriesBurned"
                  value={form.caloriesBurned}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Calories Burned"
                  required
                />

              </div>

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  type="number"
                  name="sets"
                  value={form.sets}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Sets"
                />

                <input
                  type="number"
                  name="reps"
                  value={form.reps}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Reps"
                />

              </div>

              <button className="btn-primary">
                {submitting ? 'Saving...' : 'Save Workout'}
              </button>

            </form>
          </div>
        )}

        {/* Search */}
        <div className="flex gap-4 flex-col md:flex-row">

          <input
            type="text"
            placeholder="Search workouts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field"
          >
            <option value="all">All Types</option>
            {EXERCISE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

        </div>

        {/* Workout List */}
        <div className="space-y-4">

          {workouts.map((w) => (
            <div
              key={w._id}
              className="glass-card p-6 flex justify-between items-center"
            >

              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {w.exercise}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  {w.exerciseType} • {w.duration} mins • 🔥 {w.caloriesBurned} kcal
                </p>
              </div>

              <button
                onClick={() => handleDelete(w._id)}
                className="text-red-500"
              >
                Delete
              </button>

            </div>
          ))}

        </div>

      </div>
    </Layout>
  );
}