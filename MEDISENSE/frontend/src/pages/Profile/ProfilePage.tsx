import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Camera, Save, KeyRound, Trash2, Edit3 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useUpdateProfile, useChangePassword, useUploadAvatar, useDeleteAccount } from '../../hooks/useUser';

const ProfilePage: React.FC = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const uploadAvatar = useUploadAvatar();
  const deleteAccount = useDeleteAccount();

  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveName = async () => {
    try {
      const updated = await updateProfile.mutateAsync({ name });
      setUser(updated);
      toast.success('Profile updated.');
    } catch {
      toast.error('Failed to update profile.');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const updated = await uploadAvatar.mutateAsync(file);
      setUser(updated);
      toast.success('Avatar updated.');
    } catch {
      toast.error('Failed to upload avatar.');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) return;
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      toast.success('Password changed.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to change password.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('This will permanently delete your account and all data. Continue?')) return;
    try {
      await deleteAccount.mutateAsync();
      await logout();
      navigate('/');
      toast.success('Account deleted.');
    } catch {
      toast.error('Failed to delete account.');
    }
  };

  return (
    <DashboardLayout title="Profile & Settings">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Avatar + basic info */}
        <div className="glass-card p-6 text-center lg:col-span-1">
          <div className="relative mx-auto w-fit">
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt={user.name} className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-100 font-display text-3xl font-semibold text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">
                {user?.name?.charAt(0)}
              </div>
            )}
            <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-clay-500 text-white shadow-soft">
              <Camera size={14} />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-ink dark:text-canvas">{user?.name}</h3>
          <p className="text-sm text-ink/50 dark:text-canvas/50">{user?.email}</p>
          <Link to="/onboarding" className="btn-secondary mt-4 w-full !py-2 text-sm">
            <Edit3 size={14} /> Edit skin profile
          </Link>
        </div>

        {/* Editable fields */}
        <div className="space-y-6 lg:col-span-2">
          <div className="glass-card p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-ink dark:text-canvas">Basic information</h3>
            <label className="mb-1.5 block text-sm font-medium text-ink dark:text-canvas">Full name</label>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={handleSaveName} disabled={updateProfile.isPending} className="btn-primary mt-4">
              <Save size={15} /> {updateProfile.isPending ? 'Saving…' : 'Save changes'}
            </button>
          </div>

          {user?.authProvider === 'local' && (
            <div className="glass-card p-6">
              <h3 className="mb-4 font-display text-lg font-semibold text-ink dark:text-canvas">Change password</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input type="password" placeholder="Current password" className="input-field" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                <input type="password" placeholder="New password" className="input-field" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <button onClick={handleChangePassword} disabled={changePassword.isPending} className="btn-teal mt-4">
                <KeyRound size={15} /> {changePassword.isPending ? 'Updating…' : 'Update password'}
              </button>
            </div>
          )}

          <div className="glass-card border border-clay-300/30 p-6">
            <h3 className="mb-2 font-display text-lg font-semibold text-clay-700 dark:text-clay-300">Danger zone</h3>
            <p className="mb-4 text-sm text-ink/60 dark:text-canvas/60">
              Deleting your account permanently removes your profile, analyses, and reports. This cannot be undone.
            </p>
            <button onClick={handleDeleteAccount} disabled={deleteAccount.isPending} className="btn-secondary !border-clay-500 !text-clay-600">
              <Trash2 size={15} /> Delete my account
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
