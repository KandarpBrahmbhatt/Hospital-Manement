import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-slate-800 text-white p-4">
      <h2 className="text-xl font-bold mb-5">
        Hospital HMS
      </h2>

      <ul className="space-y-3">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>

        <li>
          <Link to="/patients">Patients</Link>
        </li>

        <li>
          <Link to="/doctors">Doctors</Link>
        </li>

        <li>
          <Link to="/appointments">Appointments</Link>
        </li>

        <li>
          <Link to="/bills">Billing</Link>
        </li>

        <li>
          <Link to="/insurance">Insurance</Link>
        </li>

        <li>
          <Link to="/emergency">Emergency</Link>
        </li>

        <li>
          <Link to="/token">Token Queue</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;