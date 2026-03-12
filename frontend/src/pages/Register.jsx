import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const navigate              = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${BACKEND_URL}/api/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem('ag_token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="auth-card">
        <Link to="/" className="logo" style={{ marginBottom: '2rem', display: 'block' }}>
          Antigravity.
        </Link>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Join the cosmos 🌌</h1>
        <p style={{ color: '#636e72', marginBottom: '2rem' }}>Create your Antigravity account</p>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input name="name" placeholder="Cosmic Traveller" value={form.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input name="password_confirmation" type="password" placeholder="••••••••" value={form.password_confirmation} onChange={handleChange} required />
          </div>

          <button type="submit" className="cta-button full-width" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Creating account…' : 'Create Account 🚀'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
