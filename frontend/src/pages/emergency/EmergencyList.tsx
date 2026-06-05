import { useEffect, useState } from "react";
import { 
  getEmergencyListApi, 
  getEmergencyStatsApi, 
  createEmergencyApi, 
  updateEmergencyApi, 
  deleteEmergencyApi 
} from "../../services/emergencyApi";
import { getPatientsApi } from "../../services/patientApi";
import { getDoctorsApi } from "../../services/doctorApi";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const EmergencyList = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    patientId: "",
    severity: "HIGH",
    status: "WAITING",
    assignedDoctor: "",
    reason: "",
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [listRes, statsRes, patientsRes, doctorsRes] = await Promise.all([
        getEmergencyListApi(),
        getEmergencyStatsApi(),
        getPatientsApi(1, 1000),
        getDoctorsApi(),
      ]);

      if (Array.isArray(listRes.data)) {
        setCases(listRes.data);
      } else {
        setCases([]);
      }

      if (Array.isArray(statsRes.data)) {
        setStats(statsRes.data);
      }

      setPatients(patientsRes.data?.patent || []);
      setDoctors(doctorsRes.data || []);
    } catch (err) {
      console.error("Failed to load emergency data:", err);
      setError("Failed to fetch emergency triage records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateEmergencyApi(id, { status: newStatus });
      await loadData();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update case status.");
    }
  };

  const handleSeverityChange = async (id: string, newSeverity: string) => {
    try {
      await updateEmergencyApi(id, { severity: newSeverity });
      await loadData();
    } catch (err) {
      console.error("Failed to update severity:", err);
      alert("Failed to update case severity.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to dismiss this emergency record?")) return;
    try {
      await deleteEmergencyApi(id);
      alert("Emergency case dismissed successfully.");
      await loadData();
    } catch (err) {
      console.error("Failed to delete emergency case:", err);
      alert("Failed to delete case.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createEmergencyApi(formData as any);
      setShowModal(false);
      setFormData({
        patientId: "",
        severity: "HIGH",
        status: "WAITING",
        assignedDoctor: "",
        reason: "",
      });
      await loadData();
    } catch (err: any) {
      console.error("Failed to create emergency entry:", err);
      setError(err.response?.data?.message || "Failed to create emergency log.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <div className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Emergency Triage Board</h1>
              <p className="text-slate-500 mt-1">Real-time status tracking, clinician assignments, and severity levels</p>
            </div>
            
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-medium rounded-xl transition shadow-sm shadow-rose-600/10 cursor-pointer self-start sm:self-auto"
            >
              🚨 Log Emergency Case
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12 space-x-2 text-indigo-600">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="font-medium text-slate-600">Retrieving triage board data...</span>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.length === 0 ? (
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm col-span-4 text-center">
                    <span className="text-sm text-slate-400 italic">No triage statistics available.</span>
                  </div>
                ) : (
                  stats.map((s, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s._id || "Active"}</div>
                      <div className="text-3xl font-bold text-rose-600 mt-2">{s.count}</div>
                      <div className="text-xs text-slate-400 mt-1">Cases in this category</div>
                    </div>
                  ))
                )}
              </div>

              {/* Emergency Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-800">Active Emergency Cases</h3>
                  <p className="text-slate-500 text-sm mt-0.5">Patients currently under emergency care and supervision</p>
                </div>

                {cases.length === 0 ? (
                  <div className="p-12 text-center">
                    <h3 className="text-base font-semibold text-slate-800">Triage Board Clear</h3>
                    <p className="text-slate-500 mt-1 text-sm">No active emergency logs recorded.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                          <th className="px-6 py-4">Patient Name</th>
                          <th className="px-6 py-4">Severity</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Assigned Doctor</th>
                          <th className="px-6 py-4">Reason / Injury</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                        {cases.map((c) => (
                          <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 font-semibold text-slate-900">
                              {c.patientId?.name || "Unknown Patient"}
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={c.severity}
                                onChange={(e) => handleSeverityChange(c._id, e.target.value)}
                                className={`px-2.5 py-1 rounded-full text-xs font-bold border-0 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer ${
                                  c.severity === "CRITICAL"
                                    ? "bg-red-100 text-red-800"
                                    : c.severity === "HIGH"
                                    ? "bg-orange-100 text-orange-800"
                                    : c.severity === "MEDIUM"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                <option value="LOW">LOW</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="HIGH">HIGH</option>
                                <option value="CRITICAL">CRITICAL</option>
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={c.status}
                                onChange={(e) => handleStatusChange(c._id, e.target.value)}
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer ${
                                  c.status === "WAITING"
                                    ? "bg-rose-50 text-rose-700"
                                    : c.status === "IN_TREATMENT"
                                    ? "bg-indigo-50 text-indigo-700"
                                    : c.status === "STABILIZED"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-blue-50 text-blue-700"
                                }`}
                              >
                                <option value="WAITING">WAITING</option>
                                <option value="IN_TREATMENT">IN TREATMENT</option>
                                <option value="STABILIZED">STABILIZED</option>
                                <option value="ADMITTED">ADMITTED</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {c.assignedDoctor?.doctorName || c.assignedDoctor?.name || "Unassigned"}
                            </td>
                            <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                              {c.reason}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleDelete(c._id)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition cursor-pointer"
                              >
                                Dismiss
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Emergency Log Intake Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Emergency Intake Form</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Patient</label>
                <select
                  required
                  name="patientId"
                  value={formData.patientId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, patientId: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                >
                  <option value="">Choose Patient...</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>{p.name} ({p.phone})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Severity</label>
                  <select
                    name="severity"
                    value={formData.severity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, severity: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Triage Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                  >
                    <option value="WAITING">WAITING</option>
                    <option value="IN_TREATMENT">IN TREATMENT</option>
                    <option value="STABILIZED">STABILIZED</option>
                    <option value="ADMITTED">ADMITTED</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assign Physician</label>
                <select
                  name="assignedDoctor"
                  value={formData.assignedDoctor}
                  onChange={(e) => setFormData((prev) => ({ ...prev, assignedDoctor: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                >
                  <option value="">Choose Physician (Optional)...</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>{d.doctorName || d.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason / Symptoms / Diagnosis</label>
                <textarea
                  required
                  placeholder="Describe emergency reason (e.g. compound fracture, severe anaphylaxis)"
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-rose-600 text-white font-medium rounded-xl hover:bg-rose-500 active:bg-rose-700 transition shadow-sm shadow-rose-600/10 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Admitting..." : "Log Emergency Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyList;