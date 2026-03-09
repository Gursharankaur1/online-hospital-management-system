import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { HOSPITAL_NAME } from '../config/constants';
import PageHeader from '../components/PageHeader';

export default function MyAppointments() {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const { data: patients } = await api.get('/patients', { params: { search: user.email } });
        const me = Array.isArray(patients) ? patients.find((p) => p.email?.toLowerCase() === user.email?.toLowerCase()) : null;
        setPatient(me);
        if (me?._id) {
          const { data } = await api.get('/appointments', { params: { patient: me._id } });
          setAppointments(Array.isArray(data) ? data.sort((a, b) => new Date(b.date) - new Date(a.date)) : []);
        } else {
          setAppointments([]);
        }
      } catch (_) {
        setPatient(null);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.email]);

  const statusClass = (status) => {
    const map = { scheduled: 'bg-cyan-100 text-cyan-800', completed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800', no_show: 'bg-amber-100 text-amber-800' };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <>
        <PageHeader title="My Appointments" subtitle={HOSPITAL_NAME} />
        <p className="py-12 text-center text-slate-500">Loading...</p>
      </>
    );
  }

  if (!patient) {
    return (
      <>
        <PageHeader title="My Appointments" subtitle={HOSPITAL_NAME} />
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
          <p className="text-amber-800 font-semibold">No patient profile linked</p>
          <p className="text-amber-700 text-sm mt-1">Your account is not linked to a patient record. Contact {HOSPITAL_NAME} to register.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="My Appointments" subtitle={`Your appointments at ${HOSPITAL_NAME}`} />
      <div className="mt-6 bg-white rounded-2xl shadow-card border border-slate-200/80 overflow-hidden">
        {appointments.length === 0 ? (
          <div className="p-8 text-center text-teal-600">No appointments yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Date</th>
                  <th className="text-left px-4 py-3 font-semibold">Time</th>
                  <th className="text-left px-4 py-3 font-semibold">Doctor</th>
                  <th className="text-left px-4 py-3 font-semibold">Type</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id} className="border-t border-teal-100 hover:bg-teal-50/50">
                    <td className="px-4 py-3">{new Date(a.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{a.timeSlot}</td>
                    <td className="px-4 py-3">{a.doctor?.name} ({a.doctor?.specialization})</td>
                    <td className="px-4 py-3 capitalize">{a.type}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass(a.status)}`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
