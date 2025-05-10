"use client";

import { login, signup } from '@/services/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const AuthForm = ({ type }: { type: 'login' | 'signup' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (type === 'signup') {
        await signup({ email, password });
      } else {
        await login({ email, password });
      }
      router.push('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failed. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-groupauth">
        <label htmlFor="email">Email</label>
        <div>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        </div>
      </div>
      <div className="form-groupauth">
        <label htmlFor="password">Password</label>
        <div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        </div>
      </div>
      <button type="submit" className="submit-button">
        {type === 'signup' ? 'Sign Up' : 'Log In'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default AuthForm;
