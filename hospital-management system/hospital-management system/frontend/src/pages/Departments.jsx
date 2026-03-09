import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const inputClass = 'w-full px-3 py-2.5 border border-teal-200 rounded-lg text-teal-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500';
const labelClass = 'block font-medium text-sm text-teal-900 mb-1.5';
const formGroup = 'mb-4';

function Badge({ status }) {
  const map = { active: 'bg-green-100 text-green-800', inactive: 'bg-red-100 text-red-800' };
  return <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
}

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', headOfDepartment: '', floor: '', contactExtension: '', status: 'active',
  });

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const [depRes, docRes] = await Promise.all([api.get('/departments', { params }), api.get('/doctors')]);
      setDepartments(depRes.data);
      setDoctors(docRes.data);
    } catch (err) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [search, statusFilter]);

  const openAdd = () => {
    setForm({ name: '', description: '', headOfDepartment: '', floor: '', contactExtension: '', status: 'active' });
    setModal('add');
  };

  const openEdit = (d) => {
    setForm({
      name: d.name,
      description: d.description || '',
      headOfDepartment: d.headOfDepartment?._id || d.headOfDepartment || '',
      floor: d.floor || '',
      contactExtension: d.contactExtension || '',
      status: d.status || 'active',
    });
    setModal({ type: 'edit', id: d._id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, headOfDepartment: form.headOfDepartment || undefined };
    try {
      if (modal === 'add') {
        await api.post('/departments', payload);
        toast.success('Department added');
      } else {
        await api.put(`/departments/${modal.id}`, payload);
        toast.success('Department updated');
      }
      setModal(null);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await api.delete(`/departments/${id}`);
      toast.success('Department removed');
      fetchDepartments();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-teal-900">Departments</h1>
          <p className="text-teal-700 text-sm mt-1">Manage hospital departments and wards</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm bg-teal-500 text-white hover:bg-teal-600" onClick={openAdd}>+ Add Department</button>
      </div>
      <div className="bg-white rounded-xl shadow border border-teal-200 p-5">
        <div className="flex gap-3 mb-4 flex-wrap">
          <input type="text" placeholder="Search departments..." value={search} onChange={(e) => setSearch(e.target.value)} className={`flex-1 min-w-[200px] ${inputClass}`} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`w-[140px] ${inputClass}`}>
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="overflow-x-auto rounded-lg border border-teal-200">
          {loading ? (
            <p className="py-8 text-center text-teal-600">Loading...</p>
          ) : departments.length === 0 ? (
            <div className="text-center py-12 px-8 text-teal-700">
              <p>No departments found.</p>
              <button type="button" className="mt-4 py-2 px-4 rounded-lg font-semibold text-sm bg-teal-500 text-white hover:bg-teal-600" onClick={openAdd}>Add first department</button>
            </div>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Name</th>
                  <th className="text-left px-4 py-3 font-semibold">Description</th>
                  <th className="text-left px-4 py-3 font-semibold">Head</th>
                  <th className="text-left px-4 py-3 font-semibold">Floor</th>
                  <th className="text-left px-4 py-3 font-semibold">Extension</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d._id} className="hover:bg-teal-50/50">
                    <td className="px-4 py-3 border-b border-teal-100 font-semibold">{d.name}</td>
                    <td className="px-4 py-3 border-b border-teal-100 max-w-[200px]">{d.description ? (d.description.length > 50 ? d.description.slice(0, 50) + '…' : d.description) : '-'}</td>
                    <td className="px-4 py-3 border-b border-teal-100">{d.headOfDepartment?.name ? `${d.headOfDepartment.name} (${d.headOfDepartment.specialization})` : '-'}</td>
                    <td className="px-4 py-3 border-b border-teal-100">{d.floor || '-'}</td>
                    <td className="px-4 py-3 border-b border-teal-100">{d.contactExtension || '-'}</td>
                    <td className="px-4 py-3 border-b border-teal-100"><Badge status={d.status} /></td>
                    <td className="px-4 py-3 border-b border-teal-100">
                      <button type="button" className="py-1.5 px-3 rounded-lg font-medium text-sm border border-teal-200 bg-teal-50 text-teal-900 hover:bg-teal-100 mr-2" onClick={() => openEdit(d)}>Edit</button>
                      <button type="button" className="py-1.5 px-3 rounded-lg font-medium text-sm bg-red-600 text-white hover:bg-red-700" onClick={() => handleDelete(d._id)}>Delete</button>
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
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-teal-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-teal-900">{modal === 'add' ? 'Add Department' : 'Edit Department'}</h2>
              <button type="button" className="text-2xl leading-none text-teal-900 hover:opacity-70" onClick={() => setModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-5">
                <div className={formGroup}>
                  <label className={labelClass}>Name *</label>
                  <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Cardiology" required />
                </div>
                <div className={formGroup}>
                  <label className={labelClass}>Description</label>
                  <textarea className={inputClass} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" />
                </div>
                <div className={formGroup}>
                  <label className={labelClass}>Head of department</label>
                  <select className={inputClass} value={form.headOfDepartment} onChange={(e) => setForm({ ...form, headOfDepartment: e.target.value })}>
                    <option value="">None</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>{doc.name} - {doc.specialization}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={formGroup}>
                    <label className={labelClass}>Floor</label>
                    <input className={inputClass} value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} placeholder="e.g. 2nd" />
                  </div>
                  <div className={formGroup}>
                    <label className={labelClass}>Contact extension</label>
                    <input className={inputClass} value={form.contactExtension} onChange={(e) => setForm({ ...form, contactExtension: e.target.value })} placeholder="e.g. 234" />
                  </div>
                </div>
                {modal !== 'add' && (
                  <div className={formGroup}>
                    <label className={labelClass}>Status</label>
                    <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                )}
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
