import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HOSPITAL_NAME, HOSPITAL_TAGLINE } from '../config/constants';

const roleLabel = { admin: 'Admin', staff: 'Staff', doctor: 'Doctor', patient: 'Patient' };

export default function Homepage() {
  const { user } = useAuth();
  const isPatient = user?.role === 'patient';

  const staffQuickLinks = [
    { to: '/dashboard', label: 'Dashboard', desc: 'Overview & stats', icon: '📊', primary: true },
    { to: '/patients', label: 'Patients', desc: 'Manage patient records', icon: '👥' },
    { to: '/doctors', label: 'Doctors', desc: 'Manage doctors', icon: '🩺' },
    { to: '/appointments', label: 'Appointments', desc: 'Schedule & view', icon: '📅' },
    { to: '/departments', label: 'Departments', desc: 'Hospital departments', icon: '🏥' },
    { to: '/medical-records', label: 'Medical Records', desc: 'Diagnosis & prescriptions', icon: '📋' },
    { to: '/settings', label: 'Settings', desc: 'Profile & password', icon: '⚙️' },
  ];

  const patientQuickLinks = [
    { to: '/dashboard', label: 'My Dashboard', desc: 'Your overview', icon: '📊', primary: true },
    { to: '/my-appointments', label: 'My Appointments', desc: 'View & track appointments', icon: '📅' },
    { to: '/my-records', label: 'My Medical Records', desc: 'Diagnosis & prescriptions', icon: '📋' },
    { to: '/settings', label: 'Settings', desc: 'Profile & password', icon: '⚙️' },
  ];

  const links = isPatient ? patientQuickLinks : staffQuickLinks;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">{HOSPITAL_NAME}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
          Welcome back, {user?.name}
        </h1>
        <p className="text-slate-500 mt-2">{HOSPITAL_TAGLINE}</p>
        <span className="inline-block mt-4 px-4 py-1.5 rounded-full text-sm font-medium bg-teal-100 text-teal-800 capitalize">
          {roleLabel[user?.role] || user?.role}
        </span>
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Quick access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map(({ to, label, desc, icon, primary }) => (
            <Link
              key={to}
              to={to}
              className={`block no-underline rounded-2xl border p-5 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                primary
                  ? 'bg-teal-500 border-teal-500 text-white hover:bg-teal-600 hover:border-teal-600'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-teal-200 hover:bg-teal-50/30'
              }`}
            >
              <span className="text-3xl block mb-3">{icon}</span>
              <h3 className={`font-semibold ${primary ? 'text-white' : 'text-slate-800'}`}>{label}</h3>
              <p className={`text-sm mt-0.5 ${primary ? 'text-teal-100' : 'text-slate-500'}`}>{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Getting started</h2>
        <p className="text-slate-600 text-sm">
          {isPatient
            ? 'Use the cards above to view your dashboard, appointments, and medical records. Update your profile or password in Settings.'
            : 'Use the cards above to open the Dashboard for an overview, or jump directly to Patients, Appointments, or other modules. Manage your account in Settings.'}
        </p>
      </section>
    </div>
  );
}
