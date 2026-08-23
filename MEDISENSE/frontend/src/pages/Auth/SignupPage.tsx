import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { toast } from 'react-toastify';
import AuthLayout from '../../components/layout/AuthLayout';
import { useAuth } from '../../contexts/AuthContext';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupPage: React.FC = () => {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>();

  const password = watch('password');

  const onSubmit = async (formData: SignupForm) => {
    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      toast.success('Account created! Check your email to verify your address.');
      navigate('/onboarding', { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    setLoading(true);
    try {
      const user = await loginWithGoogle(credentialResponse.credential);
      navigate(user.hasCompletedOnboarding ? '/dashboard' : '/onboarding', { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Google signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start your personalized skin health journey today.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink dark:text-canvas">Full name</label>
          <input
            className="input-field"
            placeholder="Jane Doe"
            {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
          />
          {errors.name && <p className="mt-1 text-xs text-clay-600">{errors.name.message}</p>}
        </div>

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
          <label className="mb-1.5 block text-sm font-medium text-ink dark:text-canvas">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field pr-11"
              placeholder="At least 8 characters"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Must be at least 8 characters' },
                pattern: { value: /\d/, message: 'Must contain at least one number' },
              })}
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink dark:text-canvas">Confirm password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="input-field"
            placeholder="Re-enter your password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-clay-600">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account…' : 'Create account'} <UserPlus size={16} />
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink/10 dark:bg-white/10" />
        <span className="text-xs text-ink/40">or</span>
        <div className="h-px flex-1 bg-ink/10 dark:bg-white/10" />
      </div>

      <div className="flex justify-center">
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error('Google signup failed.')} theme="outline" shape="pill" width="320" />
      </div>

      <p className="mt-8 text-center text-sm text-ink/60 dark:text-canvas/60">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-teal-600 hover:underline dark:text-teal-300">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;
