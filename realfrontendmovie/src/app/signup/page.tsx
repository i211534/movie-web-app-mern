// src/app/(auth)/signup/page.tsx
'use client';
import AuthForm from '@/app/components/AuthForm';
import Header from '../components/newHeader';
import { usePathname } from 'next/navigation';
const SignupPage = () => {
  const pathname = usePathname() || '/'; 
  return (
    <div className="auth-page">
    <Header currentPage={pathname} />
    <div className="authpagereal">
      <h1>Sign Up</h1>
      <AuthForm type="signup" />
      </div>
    </div>
  );
};

export default SignupPage;
