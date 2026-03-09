import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { HOSPITAL_NAME, HOSPITAL_TAGLINE } from '../config/constants';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
            Sign in to access the hospital management system or your patient portal.
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
            <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
            <p className="text-slate-500 mt-1 text-sm">Sign in to your account</p>
            <form onSubmit={handleSubmit} className="mt-8">
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
              <div className="mb-6">
                <label className="block font-medium text-sm text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-70 transition-colors shadow-sm"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            <p className="text-center mt-6 text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-teal-600 font-semibold hover:text-teal-700 hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
