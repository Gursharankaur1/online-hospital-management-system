import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HOSPITAL_NAME } from '../config/constants';

const staffNavItems = [
  { to: '/home', label: 'Home', icon: '🏠' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/patients', label: 'Patients', icon: '👥' },
  { to: '/doctors', label: 'Doctors', icon: '🩺' },
  { to: '/appointments', label: 'Appointments', icon: '📅' },
  { to: '/departments', label: 'Departments', icon: '🏥' },
  { to: '/medical-records', label: 'Medical Records', icon: '📋' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

const patientNavItems = [
  { to: '/home', label: 'Home', icon: '🏠' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/my-appointments', label: 'My Appointments', icon: '📅' },
  { to: '/my-records', label: 'My Medical Records', icon: '📋' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

const roleLabel = { admin: 'Admin', staff: 'Staff', doctor: 'Doctor', patient: 'Patient' };

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isPatient = user?.role === 'patient';
  const navItems = isPatient ? patientNavItems : staffNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-[280px] flex-shrink-0 bg-gradient-to-b from-teal-600 via-teal-600 to-teal-700 text-white flex flex-col shadow-card">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              🏥
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-tight">{HOSPITAL_NAME}</h1>
              <p className="text-xs text-teal-100 mt-0.5">
                {isPatient ? 'Patient Portal' : 'Management System'}
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/home'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-white no-underline transition-all duration-200 ${
                  isActive ? 'bg-white/25 shadow-sm font-semibold' : 'font-medium hover:bg-white/10'
                }`
              }
            >
              <span className="text-xl w-8 text-center">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/20">
          <div className="rounded-xl bg-white/10 px-4 py-3">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-teal-100 truncate mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/20 capitalize">
              {roleLabel[user?.role] || user?.role}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 w-full py-2.5 px-4 rounded-xl font-semibold text-sm border border-white/30 bg-white/5 text-white hover:bg-white/15 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex-shrink-0 h-16 px-6 bg-white border-b border-slate-200 flex items-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">{HOSPITAL_NAME}</h2>
          <span className="ml-3 text-slate-400 font-normal text-sm">|</span>
          <span className="ml-3 text-slate-500 text-sm">{isPatient ? 'Patient Portal' : 'Staff Dashboard'}</span>
        </header>
        <main className="flex-1 p-6 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
