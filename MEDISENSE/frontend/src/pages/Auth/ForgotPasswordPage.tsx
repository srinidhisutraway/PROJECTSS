import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import api from '../../services/api';

interface FormData {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', data);
    } finally {
      setLoading(false);
      setSent(true); // always show success to avoid leaking which emails exist
    }
  };

  return (
    <AuthLayout title="Reset your password" subtitle="We'll email you a secure link to reset it.">
      {sent ? (
        <div className="glass-card flex flex-col items-center gap-3 p-6 text-center">
          <CheckCircle2 size={36} className="text-teal-600" />
          <p className="text-sm text-ink/70 dark:text-canvas/70">
            If an account exists for that email, a reset link is on its way. Check your inbox (and spam folder).
          </p>
        </div>
      ) : (
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
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending…' : 'Send reset link'} <Mail size={16} />
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-ink/60 dark:text-canvas/60">
        Remembered your password?{' '}
        <Link to="/login" className="font-semibold text-teal-600 hover:underline dark:text-teal-300">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
