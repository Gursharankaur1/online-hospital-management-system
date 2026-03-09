import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { HOSPITAL_NAME } from '../config/constants';
import PageHeader from '../components/PageHeader';

const roleLabel = { admin: 'Admin', staff: 'Staff', doctor: 'Doctor', patient: 'Patient' };

export default function Settings() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Settings" subtitle={`Manage your ${HOSPITAL_NAME} account`} />

      <div className="max-w-2xl space-y-8">
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Profile</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-500 font-medium">Name</dt>
              <dd className="text-slate-800 font-medium mt-0.5">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Email</dt>
              <dd className="text-slate-800 font-medium mt-0.5">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Role</dt>
              <dd className="mt-0.5">
                <span className="inline-block px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 font-medium capitalize">
                  {roleLabel[user?.role] || user?.role}
                </span>
              </dd>
            </div>
          </dl>
          <p className="text-slate-500 text-xs mt-4">Contact an administrator to change your name or email.</p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Change password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block font-medium text-sm text-slate-700 mb-1.5">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-sm text-slate-700 mb-1.5">New password (min 6 characters)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block font-medium text-sm text-slate-700 mb-1.5">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-5 rounded-xl font-semibold text-sm bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-70"
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
