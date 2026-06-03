import { Link } from "react-router-dom";

const PatientList = () => {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1>Patients</h1>

        <Link
          to="/patients/create"
          className="bg-green-500 text-white px-3 py-2"
        >
          Add Patient
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>John</td>
            <td>30</td>
            <td>Male</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;