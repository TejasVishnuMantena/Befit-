import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    weight: '',
    height: ''
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill required fields');
      return false;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const { data } = await API.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        age: form.age ? Number(form.age) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        height: form.height ? Number(form.height) : undefined
      });

      login(data.user, data.token);
      toast.success('Welcome to BeFit!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg glass-card p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black">BeFit</h1>
          <p className="text-gray-500 mt-2">
            Your Effort. Your Result.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="input-field"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="input-field"
            value={form.email}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input-field"
              value={form.password}
              onChange={handleChange}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="input-field"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              name="age"
              placeholder="Age"
              className="input-field"
              value={form.age}
              onChange={handleChange}
            />

            <input
              type="number"
              name="weight"
              placeholder="Weight"
              className="input-field"
              value={form.weight}
              onChange={handleChange}
            />

            <input
              type="number"
              name="height"
              placeholder="Height"
              className="input-field"
              value={form.height}
              onChange={handleChange}
            />
          </div>

          <button className="w-full btn-primary">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-600 font-semibold">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}