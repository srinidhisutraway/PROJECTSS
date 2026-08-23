import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import api from '../../services/api';
import { setAccessToken } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface FormData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const { data: res } = await api.post(`/auth/reset-password/${token}`, { password: data.password });
      setAccessToken(res.accessToken);
      setUser(res.user);
      toast.success('Password reset successfully!');
      navigate(res.user.hasCompletedOnboarding ? '/dashboard' : '/onboarding', { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Reset link is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a strong password you haven't used before.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink dark:text-canvas">New password</label>
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
            placeholder="Re-enter your new password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-clay-600">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Resetting…' : 'Reset password'} <KeyRound size={16} />
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-ink/60 dark:text-canvas/60">
        <Link to="/login" className="font-semibold text-teal-600 hover:underline dark:text-teal-300">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
