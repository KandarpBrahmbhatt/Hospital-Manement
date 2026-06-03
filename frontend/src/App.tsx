// import AppRoutes from "./routes/AppRoutes";

// function App() {
//   return <AppRoutes />;
// }

// export default App;


import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";

import PatientList from "./pages/patient/PatientList";
import CreatePatient from "./pages/patient/CreatePatient";

import DoctorList from "./pages/doctor/DoctorList";

import AppointmentList from "./pages/appointment/AppointmentList";

import BillList from "./pages/billing/BillList";

import InsuranceList from "./pages/insurance/InsuranceList";

import EmergencyList from "./pages/emergency/EmergencyList";

import TokenQueue from "./pages/token/TokenQueue";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/patients" element={<PatientList />} />
        <Route path="/patients/create" element={<CreatePatient />} />

        <Route path="/doctors" element={<DoctorList />} />

        <Route path="/appointments" element={<AppointmentList />} />

        <Route path="/bills" element={<BillList />} />

        <Route path="/insurance" element={<InsuranceList />} />

        <Route path="/emergency" element={<EmergencyList />} />

        <Route path="/token" element={<TokenQueue />} />
      </Route>
    </Routes>
  );
}

export default App;
