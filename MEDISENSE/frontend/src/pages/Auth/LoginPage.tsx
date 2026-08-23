import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { toast } from 'react-toastify';
import AuthLayout from '../../components/layout/AuthLayout';
import { useAuth } from '../../contexts/AuthContext';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const redirectAfterAuth = (hasCompletedOnboarding: boolean) => {
    const from = (location.state as any)?.from?.pathname;
    if (from) return navigate(from, { replace: true });
    navigate(hasCompletedOnboarding ? '/dashboard' : '/onboarding', { replace: true });
  };

  const onSubmit = async (formData: LoginForm) => {
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      redirectAfterAuth(user.hasCompletedOnboarding);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Google login did not return a credential.');
      return;
    }
    setLoading(true);
    try {
      const user = await loginWithGoogle(credentialResponse.credential);
      toast.success(`Welcome, ${user.name.split(' ')[0]}!`);
      redirectAfterAuth(user.hasCompletedOnboarding);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue your skin health journey.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink dark:text-canvas">Email</label>
          <input
            type="email"
            className="input-field"
            placeholder="you@example.com"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <p className="mt-1 text-xs text-clay-600">{errors.email.message}</p>}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-sm font-medium text-ink dark:text-canvas">Password</label>
            <Link to="/forgot-password" className="text-xs font-medium text-teal-600 hover:underline dark:text-teal-300">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field pr-11"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-clay-600">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Logging in…' : 'Log in'} <LogIn size={16} />
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink/10 dark:bg-white/10" />
        <span className="text-xs text-ink/40">or</span>
        <div className="h-px flex-1 bg-ink/10 dark:bg-white/10" />
      </div>

      <div className="flex justify-center">
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error('Google login failed.')} theme="outline" shape="pill" width="320" />
      </div>

      <p className="mt-8 text-center text-sm text-ink/60 dark:text-canvas/60">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-teal-600 hover:underline dark:text-teal-300">
          Sign up free
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
