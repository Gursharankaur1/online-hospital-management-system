import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const inputClass = 'w-full px-3 py-2.5 border border-teal-200 rounded-lg text-teal-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500';
const labelClass = 'block font-medium text-sm text-teal-900 mb-1.5';
const formGroup = 'mb-4';

function Badge({ status }) {
  const map = { scheduled: 'bg-cyan-100 text-cyan-800', completed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800', no_show: 'bg-amber-100 text-amber-800' };
  return <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    patient: '', doctor: '', department: '', date: '', timeSlot: '', type: 'consultation', status: 'scheduled', notes: '',
  });

  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dateFilter) params.date = dateFilter;
      if (statusFilter) params.status = statusFilter;
      const [aptRes, pRes, dRes, depRes] = await Promise.all([
        api.get('/appointments', { params }),
        api.get('/patients'),
        api.get('/doctors'),
        api.get('/departments'),
      ]);
      setAppointments(aptRes.data);
      setPatients(pRes.data);
      setDoctors(dRes.data);
      setDepartments(depRes.data);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [dateFilter, statusFilter]);

  const openAdd = () => {
    const today = new Date().toISOString().slice(0, 10);
    setForm({ patient: '', doctor: '', department: '', date: today, timeSlot: '09:00', type: 'consultation', status: 'scheduled', notes: '' });
    setModal('add');
  };

  const openEdit = (a) => {
    setForm({
      patient: a.patient?._id || a.patient,
      doctor: a.doctor?._id || a.doctor,
      department: a.department?._id || a.department || '',
      date: a.date ? new Date(a.date).toISOString().slice(0, 10) : '',
      timeSlot: a.timeSlot || '09:00',
      type: a.type || 'consultation',
      status: a.status || 'scheduled',
      notes: a.notes || '',
    });
    setModal({ type: 'edit', id: a._id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, department: form.department || undefined };
    try {
      if (modal === 'add') {
        await api.post('/appointments', payload);
        toast.success('Appointment created');
      } else {
        await api.put(`/appointments/${modal.id}`, payload);
        toast.success('Appointment updated');
      }
      setModal(null);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel/delete this appointment?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success('Appointment removed');
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-teal-900">Appointments</h1>
          <p className="text-teal-700 text-sm mt-1">Schedule and manage patient appointments</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm bg-teal-500 text-white hover:bg-teal-600" onClick={openAdd}>+ New Appointment</button>
      </div>
      <div className="bg-white rounded-xl shadow border border-teal-200 p-5">
        <div className="flex gap-3 mb-4 flex-wrap">
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={inputClass} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`w-[160px] ${inputClass}`}>
            <option value="">All status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No show</option>
          </select>
        </div>
        <div className="overflow-x-auto rounded-lg border border-teal-200">
          {loading ? (
            <p className="py-8 text-center text-teal-600">Loading...</p>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 px-8 text-teal-700">
              <p>No appointments found.</p>
              <button type="button" className="mt-4 py-2 px-4 rounded-lg font-semibold text-sm bg-teal-500 text-white hover:bg-teal-600" onClick={openAdd}>Create first appointment</button>
            </div>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Date</th>
                  <th className="text-left px-4 py-3 font-semibold">Time</th>
                  <th className="text-left px-4 py-3 font-semibold">Patient</th>
                  <th className="text-left px-4 py-3 font-semibold">Doctor</th>
                  <th className="text-left px-4 py-3 font-semibold">Type</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id} className="hover:bg-teal-50/50">
                    <td className="px-4 py-3 border-b border-teal-100">{new Date(a.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 border-b border-teal-100">{a.timeSlot}</td>
                    <td className="px-4 py-3 border-b border-teal-100">{a.patient?.name} ({a.patient?.phone})</td>
                    <td className="px-4 py-3 border-b border-teal-100">{a.doctor?.name} ({a.doctor?.specialization})</td>
                    <td className="px-4 py-3 border-b border-teal-100">{a.type}</td>
                    <td className="px-4 py-3 border-b border-teal-100"><Badge status={a.status} /></td>
                    <td className="px-4 py-3 border-b border-teal-100">
                      <button type="button" className="py-1.5 px-3 rounded-lg font-medium text-sm border border-teal-200 bg-teal-50 text-teal-900 hover:bg-teal-100 mr-2" onClick={() => openEdit(a)}>Edit</button>
                      <button type="button" className="py-1.5 px-3 rounded-lg font-medium text-sm bg-red-600 text-white hover:bg-red-700" onClick={() => handleDelete(a._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-teal-900/40 flex items-center justify-center z-50 p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-teal-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-teal-900">{modal === 'add' ? 'New Appointment' : 'Edit Appointment'}</h2>
              <button type="button" className="text-2xl leading-none text-teal-900 hover:opacity-70" onClick={() => setModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-5">
                <div className={formGroup}>
                  <label className={labelClass}>Patient *</label>
                  <select className={inputClass} value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} required>
                    <option value="">Select patient</option>
                    {patients.map((p) => (
                      <option key={p._id} value={p._id}>{p.name} - {p.phone}</option>
                    ))}
                  </select>
                </div>
                <div className={formGroup}>
                  <label className={labelClass}>Doctor *</label>
                  <select className={inputClass} value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} required>
                    <option value="">Select doctor</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d._id}>{d.name} - {d.specialization}</option>
                    ))}
                  </select>
                </div>
                <div className={formGroup}>
                  <label className={labelClass}>Department</label>
                  <select className={inputClass} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                    <option value="">None</option>
                    {departments.map((dep) => (
                      <option key={dep._id} value={dep._id}>{dep.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={formGroup}>
                    <label className={labelClass}>Date *</label>
                    <input type="date" className={inputClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                  </div>
                  <div className={formGroup}>
                    <label className={labelClass}>Time *</label>
                    <select className={inputClass} value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} required>
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={formGroup}>
                    <label className={labelClass}>Type</label>
                    <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                      <option value="consultation">Consultation</option>
                      <option value="followup">Follow-up</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                  <div className={formGroup}>
                    <label className={labelClass}>Status</label>
                    <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no_show">No show</option>
                    </select>
                  </div>
                </div>
                <div className={formGroup}>
                  <label className={labelClass}>Notes</label>
                  <textarea className={inputClass} rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
              <div className="p-4 border-t border-teal-200 flex gap-3 justify-end">
                <button type="button" className="py-2 px-4 rounded-lg font-semibold text-sm border border-teal-200 bg-teal-50 text-teal-900 hover:bg-teal-100" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="py-2 px-4 rounded-lg font-semibold text-sm bg-teal-500 text-white hover:bg-teal-600">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
