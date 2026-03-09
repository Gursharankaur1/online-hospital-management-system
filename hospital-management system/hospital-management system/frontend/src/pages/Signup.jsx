import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { HOSPITAL_NAME, HOSPITAL_TAGLINE } from '../config/constants';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill all required fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, role);
      toast.success('Account created!');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-teal-600 to-teal-700 p-10 flex-col justify-center text-white">
        <div className="max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl mb-8 shadow-lg">
            🏥
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{HOSPITAL_NAME}</h1>
          <p className="text-teal-100 text-lg mt-3">{HOSPITAL_TAGLINE}</p>
          <p className="text-teal-200/80 text-sm mt-6">
            Create an account to join our staff, doctor, or patient portal.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-xl bg-teal-500 text-white items-center justify-center text-3xl mb-3">🏥</div>
            <h1 className="text-xl font-bold text-slate-800">{HOSPITAL_NAME}</h1>
            <p className="text-slate-500 text-sm mt-1">{HOSPITAL_TAGLINE}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-soft border border-slate-200/80 p-8">
            <h2 className="text-2xl font-bold text-slate-800">Create account</h2>
            <p className="text-slate-500 mt-1 text-sm">Join {HOSPITAL_NAME}</p>
            <form onSubmit={handleSubmit} className="mt-8">
              <div className="mb-5">
                <label className="block font-medium text-sm text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>
              <div className="mb-5">
                <label className="block font-medium text-sm text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>
              <div className="mb-5">
                <label className="block font-medium text-sm text-slate-700 mb-2">Password (min 6 characters)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>
              <div className="mb-6">
                <label className="block font-medium text-sm text-slate-700 mb-2">I am a</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-70 transition-colors shadow-sm"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </form>
            <p className="text-center mt-6 text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-teal-600 font-semibold hover:text-teal-700 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
