import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { HOSPITAL_NAME } from '../config/constants';
import PageHeader from '../components/PageHeader';

function StaffDashboard() {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, departments: 0, records: 0 });

  useEffect(() => {
    const fetch = async () => {
      try {
        const [p, d, a, dep, r] = await Promise.all([
          api.get('/patients').then((res) => res.data.length),
          api.get('/doctors').then((res) => res.data.length),
          api.get('/appointments').then((res) => res.data.length),
          api.get('/departments').then((res) => res.data.length),
          api.get('/medical-records').then((res) => res.data.length),
        ]);
        setStats({ patients: p, doctors: d, appointments: a, departments: dep, records: r });
      } catch (_) {
        setStats({ patients: 0, doctors: 0, appointments: 0, departments: 0, records: 0 });
      }
    };
    fetch();
  }, []);

  const cards = [
    { label: 'Patients', value: stats.patients, to: '/patients', icon: '👥', accent: 'teal' },
    { label: 'Doctors', value: stats.doctors, to: '/doctors', icon: '🩺', accent: 'cyan' },
    { label: 'Appointments', value: stats.appointments, to: '/appointments', icon: '📅', accent: 'sky' },
    { label: 'Departments', value: stats.departments, to: '/departments', icon: '🏥', accent: 'teal' },
    { label: 'Medical Records', value: stats.records, to: '/medical-records', icon: '📋', accent: 'slate' },
  ];

  const accentClass = {
    teal: 'border-l-teal-500 bg-teal-50/50 hover:bg-teal-50 text-teal-700',
    cyan: 'border-l-cyan-500 bg-cyan-50/50 hover:bg-cyan-50 text-cyan-800',
    sky: 'border-l-sky-500 bg-sky-50/50 hover:bg-sky-50 text-sky-800',
    slate: 'border-l-slate-500 bg-slate-50 hover:bg-slate-100 text-slate-700',
  };

  const valueClass = {
    teal: 'text-teal-600',
    cyan: 'text-cyan-600',
    sky: 'text-sky-600',
    slate: 'text-slate-700',
  };

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`Overview of ${HOSPITAL_NAME} management`}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {cards.map(({ label, value, to, icon, accent }) => (
          <Link key={to} to={to} className="no-underline group">
            <div className={`bg-white rounded-2xl shadow-card border border-slate-200/80 border-l-4 p-6 card-hover ${accentClass[accent]}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className={`text-3xl font-bold mt-1 ${valueClass[accent]}`}>{value}</p>
                </div>
                <span className="text-4xl opacity-90 group-hover:scale-110 transition-transform">{icon}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

function PatientDashboard() {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [recordsCount, setRecordsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const { data: patients } = await api.get('/patients', { params: { search: user.email } });
        const me = Array.isArray(patients) ? patients.find((p) => p.email?.toLowerCase() === user.email?.toLowerCase()) : null;
        setPatient(me || null);
        if (me?._id) {
          const [aptRes, recRes] = await Promise.all([
            api.get('/appointments', { params: { patient: me._id } }),
            api.get('/medical-records', { params: { patient: me._id } }),
          ]);
          setAppointments(aptRes.data || []);
          setRecordsCount((recRes.data || []).length);
        } else {
          setAppointments([]);
          setRecordsCount(0);
        }
      } catch (_) {
        setPatient(null);
        setAppointments([]);
        setRecordsCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.email]);

  const nextAppointment = appointments
    .filter((a) => a.status === 'scheduled' && new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  if (loading) {
    return (
      <>
        <PageHeader title={`Welcome, ${user?.name}`} subtitle={HOSPITAL_NAME} />
        <p className="py-12 text-center text-slate-500">Loading your dashboard...</p>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`Welcome, ${user?.name}`}
        subtitle={`Your care at ${HOSPITAL_NAME}`}
      />
      {!patient && (
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <p className="text-amber-800 font-semibold">No patient profile linked</p>
          <p className="text-amber-700 text-sm mt-1">Your account email is not linked to a patient record. Contact the hospital to register as a patient.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link to="/my-appointments" className="no-underline group">
          <div className="bg-white rounded-2xl shadow-card border border-slate-200/80 p-6 card-hover hover:border-teal-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">My Appointments</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{appointments.length}</p>
              </div>
              <span className="text-4xl group-hover:scale-110 transition-transform">📅</span>
            </div>
          </div>
        </Link>
        <Link to="/my-records" className="no-underline group">
          <div className="bg-white rounded-2xl shadow-card border border-slate-200/80 p-6 card-hover hover:border-teal-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">My Medical Records</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{recordsCount}</p>
              </div>
              <span className="text-4xl group-hover:scale-110 transition-transform">📋</span>
            </div>
          </div>
        </Link>
      </div>
      {nextAppointment && (
        <div className="mt-8 bg-white rounded-2xl shadow-card border border-slate-200/80 p-6">
          <h2 className="font-semibold text-slate-800 mb-3">Next appointment</h2>
          <p className="text-slate-600">
            <span className="font-medium text-slate-800">{new Date(nextAppointment.date).toLocaleDateString()}</span> at {nextAppointment.timeSlot} with Dr. {nextAppointment.doctor?.name} ({nextAppointment.doctor?.specialization})
          </p>
          <Link to="/my-appointments" className="inline-block mt-3 text-teal-600 font-semibold text-sm hover:text-teal-700 hover:underline">View all appointments →</Link>
        </div>
      )}
    </>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  return user?.role === 'patient' ? <PatientDashboard /> : <StaffDashboard />;
}
