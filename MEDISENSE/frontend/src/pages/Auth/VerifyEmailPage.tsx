import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import api from '../../services/api';

const VerifyEmailPage: React.FC = () => {
  const { token } = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        setStatus('success');
      } catch {
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <AuthLayout title="Email verification" subtitle="Confirming your email address…">
      <div className="glass-card flex flex-col items-center gap-4 p-8 text-center">
        {status === 'loading' && <Loader2 size={36} className="animate-spin text-teal-600" />}
        {status === 'success' && (
          <>
            <CheckCircle2 size={40} className="text-teal-600" />
            <p className="text-sm text-ink/70 dark:text-canvas/70">
              Your email has been verified. You're all set!
            </p>
            <Link to="/dashboard" className="btn-primary">Go to dashboard</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={40} className="text-clay-600" />
            <p className="text-sm text-ink/70 dark:text-canvas/70">
              This verification link is invalid or has expired.
            </p>
            <Link to="/login" className="btn-secondary">Back to login</Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
