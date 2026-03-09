import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Departments from './pages/Departments';
import MedicalRecords from './pages/MedicalRecords';
import MyAppointments from './pages/MyAppointments';
import MyRecords from './pages/MyRecords';
import Settings from './pages/Settings';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-teal-600">Loading...</p></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-teal-600">Loading...</p></div>;
  if (user) return <Navigate to="/home" replace />;
  return children;
}

function StaffOnlyRoute({ children }) {
  const { user } = useAuth();
  if (user?.role === 'patient') return <Navigate to="/home" replace />;
  return children;
}

function PatientOnlyRoute({ children }) {
  const { user } = useAuth();
  if (user?.role !== 'patient') return <Navigate to="/home" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Homepage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patients" element={<StaffOnlyRoute><Patients /></StaffOnlyRoute>} />
        <Route path="doctors" element={<StaffOnlyRoute><Doctors /></StaffOnlyRoute>} />
        <Route path="appointments" element={<StaffOnlyRoute><Appointments /></StaffOnlyRoute>} />
        <Route path="departments" element={<StaffOnlyRoute><Departments /></StaffOnlyRoute>} />
        <Route path="medical-records" element={<StaffOnlyRoute><MedicalRecords /></StaffOnlyRoute>} />
        <Route path="my-appointments" element={<PatientOnlyRoute><MyAppointments /></PatientOnlyRoute>} />
        <Route path="my-records" element={<PatientOnlyRoute><MyRecords /></PatientOnlyRoute>} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
