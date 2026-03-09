import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import PageHeader from '../components/PageHeader';

const inputClass = 'w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500';
const labelClass = 'block font-medium text-sm text-slate-700 mb-1.5';
const formGroup = 'mb-4';

function Badge({ status }) {
  const map = { active: 'bg-green-100 text-green-800', inactive: 'bg-amber-100 text-amber-800', discharged: 'bg-red-100 text-red-800' };
  return <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
}

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [viewPatient, setViewPatient] = useState(null);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', dateOfBirth: '', gender: '', address: '', bloodGroup: '', emergencyContact: '', status: 'active',
  });

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/patients', { params });
      setPatients(data);
    } catch (err) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search, statusFilter]);

  const openAdd = () => {
    setForm({ name: '', email: '', phone: '', dateOfBirth: '', gender: '', address: '', bloodGroup: '', emergencyContact: '', status: 'active' });
    setModal('add');
  };

  const openView = async (p) => {
    setViewPatient(p);
    setViewLoading(true);
    setPatientAppointments([]);
    setPatientRecords([]);
    try {
      const [aptRes, recRes] = await Promise.all([
        api.get('/appointments', { params: { patient: p._id } }),
        api.get('/medical-records', { params: { patient: p._id } }),
      ]);
      setPatientAppointments(aptRes.data);
      setPatientRecords(recRes.data);
    } catch (err) {
      toast.error('Failed to load patient details');
    } finally {
      setViewLoading(false);
    }
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      email: p.email,
      phone: p.phone,
      dateOfBirth: p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : '',
      gender: p.gender || '',
      address: p.address || '',
      bloodGroup: p.bloodGroup || '',
      emergencyContact: p.emergencyContact || '',
      status: p.status || 'active',
    });
    setModal({ type: 'edit', id: p._id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal === 'add') {
        await api.post('/patients', form);
        toast.success('Patient added');
      } else {
        await api.put(`/patients/${modal.id}`, form);
        toast.success('Patient updated');
      }
      setModal(null);
      fetchPatients();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient?')) return;
    try {
      await api.delete(`/patients/${id}`);
      toast.success('Patient removed');
      fetchPatients();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <>
      <PageHeader
        title="Patients"
        subtitle="Manage patient records and information"
        action={
          <button type="button" className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl font-semibold text-sm bg-teal-500 text-white hover:bg-teal-600 shadow-sm" onClick={openAdd}>+ Add Patient</button>
        }
      />
      <div className="bg-white rounded-2xl shadow-card border border-slate-200/80 p-6">
        <div className="flex gap-3 mb-4 flex-wrap">
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`flex-1 min-w-[200px] ${inputClass}`}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`w-[140px] ${inputClass}`}>
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="discharged">Discharged</option>
          </select>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          {loading ? (
            <p className="py-8 text-center text-teal-600">Loading...</p>
          ) : patients.length === 0 ? (
            <div className="text-center py-12 px-8 text-teal-700">
              <p>No patients found.</p>
              <button type="button" className="mt-4 py-2 px-4 rounded-lg font-semibold text-sm bg-teal-500 text-white hover:bg-teal-600" onClick={openAdd}>Add first patient</button>
            </div>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Name</th>
                  <th className="text-left px-4 py-3 font-semibold">Email</th>
                  <th className="text-left px-4 py-3 font-semibold">Phone</th>
                  <th className="text-left px-4 py-3 font-semibold">Gender</th>
                  <th className="text-left px-4 py-3 font-semibold">Blood</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 border-b border-slate-100">{p.name}</td>
                    <td className="px-4 py-3 border-b border-slate-100">{p.email}</td>
                    <td className="px-4 py-3 border-b border-slate-100">{p.phone}</td>
                    <td className="px-4 py-3 border-b border-slate-100">{p.gender || '-'}</td>
                    <td className="px-4 py-3 border-b border-slate-100">{p.bloodGroup || '-'}</td>
                    <td className="px-4 py-3 border-b border-slate-100"><Badge status={p.status} /></td>
                    <td className="px-4 py-3 border-b border-slate-100">
                      <button type="button" className="py-1.5 px-3 rounded-lg font-medium text-sm border border-teal-200 bg-teal-50 text-teal-900 hover:bg-teal-100 mr-2" onClick={() => openView(p)}>View</button>
                      <button type="button" className="py-1.5 px-3 rounded-lg font-medium text-sm border border-teal-200 bg-teal-50 text-teal-900 hover:bg-teal-100 mr-2" onClick={() => openEdit(p)}>Edit</button>
                      <button type="button" className="py-1.5 px-3 rounded-lg font-medium text-sm bg-red-600 text-white hover:bg-red-700" onClick={() => handleDelete(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl shadow-soft max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-teal-900">{modal === 'add' ? 'Add Patient' : 'Edit Patient'}</h2>
              <button type="button" className="text-2xl leading-none text-teal-900 hover:opacity-70" onClick={() => setModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-5">
                <div className={formGroup}>
                  <label className={labelClass}>Name *</label>
                  <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className={formGroup}>
                  <label className={labelClass}>Email *</label>
                  <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className={formGroup}>
                  <label className={labelClass}>Phone *</label>
                  <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={formGroup}>
                    <label className={labelClass}>Date of birth</label>
                    <input type="date" className={inputClass} value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
                  </div>
                  <div className={formGroup}>
                    <label className={labelClass}>Gender</label>
                    <select className={inputClass} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className={formGroup}>
                  <label className={labelClass}>Address</label>
                  <input className={inputClass} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={formGroup}>
                    <label className={labelClass}>Blood group</label>
                    <input className={inputClass} value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} placeholder="e.g. O+" />
                  </div>
                  <div className={formGroup}>
                    <label className={labelClass}>Emergency contact</label>
                    <input className={inputClass} value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />
                  </div>
                </div>
                {modal !== 'add' && (
                  <div className={formGroup}>
                    <label className={labelClass}>Status</label>
                    <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="discharged">Discharged</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-slate-200 flex gap-3 justify-end">
                <button type="button" className="py-2 px-4 rounded-lg font-semibold text-sm border border-teal-200 bg-teal-50 text-teal-900 hover:bg-teal-100" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="py-2 px-4 rounded-lg font-semibold text-sm bg-teal-500 text-white hover:bg-teal-600">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewPatient && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4" onClick={() => setViewPatient(null)}>
          <div className="bg-white rounded-2xl shadow-soft max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Patient details</h2>
              <button type="button" className="text-2xl leading-none text-slate-500 hover:text-slate-700" onClick={() => setViewPatient(null)}>&times;</button>
            </div>
            <div className="p-5">
              {viewLoading ? (
                <p className="text-center py-8 text-teal-600">Loading...</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-6">
                    <div><span className="text-teal-600 font-medium">Name</span><br />{viewPatient.name}</div>
                    <div><span className="text-teal-600 font-medium">Email</span><br />{viewPatient.email}</div>
                    <div><span className="text-teal-600 font-medium">Phone</span><br />{viewPatient.phone}</div>
                    <div><span className="text-teal-600 font-medium">Gender</span><br />{viewPatient.gender || '-'}</div>
                    <div><span className="text-teal-600 font-medium">Blood group</span><br />{viewPatient.bloodGroup || '-'}</div>
                    <div><span className="text-teal-600 font-medium">Status</span><br /><Badge status={viewPatient.status} /></div>
                    <div className="col-span-2"><span className="text-teal-600 font-medium">Address</span><br />{viewPatient.address || '-'}</div>
                    <div><span className="text-teal-600 font-medium">Emergency contact</span><br />{viewPatient.emergencyContact || '-'}</div>
                    <div><span className="text-teal-600 font-medium">Date of birth</span><br />{viewPatient.dateOfBirth ? new Date(viewPatient.dateOfBirth).toLocaleDateString() : '-'}</div>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-teal-900 mb-2">Appointments ({patientAppointments.length})</h3>
                    <div className="rounded-lg border border-teal-200 overflow-hidden text-sm">
                      {patientAppointments.length === 0 ? (
                        <p className="px-4 py-3 text-teal-600">No appointments</p>
                      ) : (
                        <table className="w-full">
                          <thead className="bg-teal-50">
                            <tr>
                              <th className="text-left px-3 py-2 font-medium">Date</th>
                              <th className="text-left px-3 py-2 font-medium">Time</th>
                              <th className="text-left px-3 py-2 font-medium">Doctor</th>
                              <th className="text-left px-3 py-2 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {patientAppointments.map((a) => (
                              <tr key={a._id} className="border-t border-teal-100">
                                <td className="px-3 py-2">{new Date(a.date).toLocaleDateString()}</td>
                                <td className="px-3 py-2">{a.timeSlot}</td>
                                <td className="px-3 py-2">{a.doctor?.name}</td>
                                <td className="px-3 py-2"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${a.status === 'scheduled' ? 'bg-cyan-100 text-cyan-800' : a.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{a.status}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-teal-900 mb-2">Medical records ({patientRecords.length})</h3>
                    <div className="rounded-lg border border-teal-200 overflow-hidden text-sm">
                      {patientRecords.length === 0 ? (
                        <p className="px-4 py-3 text-teal-600">No medical records</p>
                      ) : (
                        <table className="w-full">
                          <thead className="bg-teal-50">
                            <tr>
                              <th className="text-left px-3 py-2 font-medium">Date</th>
                              <th className="text-left px-3 py-2 font-medium">Doctor</th>
                              <th className="text-left px-3 py-2 font-medium">Diagnosis</th>
                            </tr>
                          </thead>
                          <tbody>
                            {patientRecords.map((r) => (
                              <tr key={r._id} className="border-t border-teal-100">
                                <td className="px-3 py-2">{new Date(r.createdAt).toLocaleDateString()}</td>
                                <td className="px-3 py-2">{r.doctor?.name}</td>
                                <td className="px-3 py-2 max-w-[200px] truncate" title={r.diagnosis}>{r.diagnosis}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
