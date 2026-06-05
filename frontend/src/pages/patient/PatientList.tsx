import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPatientsApi } from "../../services/patientApi";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const PatientList = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getPatientsApi(page, limit);
        if (res.data) {
          setPatients(res.data.patent || []);
          setTotalPages(res.data.totalPages || 1);
          setTotal(res.data.total || 0);
        }
      } catch (err: any) {
        console.error("Failed to fetch patients:", err);
        setError("Access Denied or Failed to fetch patient list.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [page]);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <div className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Patient Directory</h1>
              <p className="text-slate-500 mt-1">Manage and view registered patient clinical files ({total} total)</p>
            </div>
            
            <Link
              to="/patients/create"
              className="px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 active:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/10 cursor-pointer self-start sm:self-auto text-center"
            >
              + Add Patient
            </Link>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {error ? (
              <div className="p-8 text-center">
                <div className="inline-flex p-3 rounded-full bg-rose-50 border border-rose-100 text-rose-500 mb-3">
                  <span className="w-6 h-6 flex items-center justify-center font-bold">!</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Error Loading Patients</h3>
                <p className="text-slate-500 mt-1 max-w-md mx-auto text-sm">{error}</p>
              </div>
            ) : loading ? (
              <div className="p-12 space-y-4">
                <div className="flex items-center justify-center space-x-2 text-indigo-600">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <span className="font-medium text-slate-600">Retrieving patients...</span>
                </div>
              </div>
            ) : patients.length === 0 ? (
              <div className="p-12 text-center">
                <h3 className="text-lg font-semibold text-slate-800">No Patients Found</h3>
                <p className="text-slate-500 mt-1 text-sm">Create a patient file to begin management.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Age</th>
                      <th className="px-6 py-4">Gender</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                    {patients.map((patient) => (
                      <tr key={patient._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{patient.name}</td>
                        <td className="px-6 py-4">{patient.age} years</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                              patient.gender === "Male"
                                ? "bg-blue-50 text-blue-700"
                                : patient.gender === "Female"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-slate-50 text-slate-700"
                            }`}
                          >
                            {patient.gender}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{patient.email || "N/A"}</td>
                        <td className="px-6 py-4 text-slate-500">{patient.phone || "N/A"}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Link
                            to={`/patients/edit/${patient._id}`}
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition text-xs cursor-pointer inline-block"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Panel */}
            {!loading && !error && patients.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-sm text-slate-500 font-light">
                  Showing page <span className="font-semibold text-slate-800">{page}</span> of{" "}
                  <span className="font-semibold text-slate-800">{totalPages}</span>
                </span>
                
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className="px-3.5 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium text-sm hover:bg-white active:bg-slate-100 disabled:opacity-40 transition shadow-sm cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    className="px-3.5 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium text-sm hover:bg-white active:bg-slate-100 disabled:opacity-40 transition shadow-sm cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientList;