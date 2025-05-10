// src/app/(auth)/login/page.tsx
'use client';
import Link from 'next/link';
import AuthForm from '@/app/components/AuthForm';

import { usePathname } from 'next/navigation';
import Header from '../components/newHeader';
import { getAccessToken } from '@/services/api';

const LoginPage = () => {
  const pathname = usePathname() || '/';
  return (
    <div className="auth-page">
    <Header currentPage={pathname} />
    <div className="authpagereal">
      <h1>Login</h1>
      <AuthForm type="login" />
      <p className="signup-link">
        Don't have an account? <Link href="/signup">Sign Up</Link>
      </p>
      </div>
    </div>
  );
};

export default LoginPage;
