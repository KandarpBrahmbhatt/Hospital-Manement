// import AppRoutes from "./routes/AppRoutes";

// function App() {
//   return <AppRoutes />;
// }

// export default App;


import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";

import PatientList from "./pages/patient/PatientList";
import CreatePatient from "./pages/patient/CreatePatient";
import EditPatient from "./pages/patient/EditPatient";

import DoctorList from "./pages/doctor/DoctorList";

import MedicalRecordList from "./pages/medical-records/MedicalRecordList";

import AppointmentList from "./pages/appointment/AppointmentList";

import BillList from "./pages/billing/BillList";
import CreateBill from "./pages/billing/CreateBill";

import InsuranceList from "./pages/insurance/InsuranceList";

import EmergencyList from "./pages/emergency/EmergencyList";

import TokenQueue from "./pages/token/TokenQueue";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/patients" element={<PatientList />} />
        <Route path="/patients/create" element={<CreatePatient />} />
        <Route path="/patients/edit/:id" element={<EditPatient />} />

        <Route path="/doctors" element={<DoctorList />} />

        <Route path="/medical-records" element={<MedicalRecordList />} />

        <Route path="/appointments" element={<AppointmentList />} />

        <Route path="/bills" element={<BillList />} />
        <Route path="/bills/create" element={<CreateBill />} />

        <Route path="/insurance" element={<InsuranceList />} />

        <Route path="/emergency" element={<EmergencyList />} />

        <Route path="/token" element={<TokenQueue />} />
      </Route>
    </Routes>
  );
}

export default App;
