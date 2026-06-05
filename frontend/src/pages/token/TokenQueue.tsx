import { useEffect, useState } from "react";
import { 
  createTokenApi, 
  getQueueByDoctorApi, 
  callNextPatientApi, 
  startConsultationApi, 
  completeConsultationApi, 
  getTokenDashboardApi 
} from "../../services/tokenApi";
import { getPatientsApi } from "../../services/patientApi";
import { getDoctorsApi } from "../../services/doctorApi";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const TokenQueue = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [queue, setQueue] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [queueLoading, setQueueLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    priority: "0",
  });

  const loadInitialData = async () => {
    setLoading(true);
    setError("");
    try {
      const [patientsRes, doctorsRes, dashboardRes] = await Promise.all([
        getPatientsApi(1, 1000),
        getDoctorsApi(),
        getTokenDashboardApi().catch(() => ({ data: null })), // handle rateLimit or placeholder errors gracefully
      ]);

      setPatients(patientsRes.data?.patent || []);
      setDoctors(doctorsRes.data || []);
      
      if (dashboardRes.data?.success) {
        setDashboardStats(dashboardRes.data.data);
      }
      
      // Auto-select first doctor if available
      if (doctorsRes.data && doctorsRes.data.length > 0) {
        setSelectedDoctorId(doctorsRes.data[0]._id);
      }
    } catch (err) {
      console.error("Failed to load token listings data:", err);
      setError("Failed to fetch initial doctor and patient databases.");
    } finally {
      setLoading(false);
    }
  };

  const loadDoctorQueue = async (doctorId: string) => {
    if (!doctorId) return;
    setQueueLoading(true);
    try {
      const res = await getQueueByDoctorApi(doctorId);
      if (res.data?.success && Array.isArray(res.data.data)) {
        setQueue(res.data.data);
      } else {
        setQueue([]);
      }
    } catch (err) {
      console.error("Failed to fetch queue for doctor:", err);
    } finally {
      setQueueLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedDoctorId) {
      loadDoctorQueue(selectedDoctorId);
    }
  }, [selectedDoctorId]);

  const handleCallNext = async () => {
    if (!selectedDoctorId) return;
    try {
      const res = await callNextPatientApi(selectedDoctorId);
      if (res.data?.success) {
        alert(res.data.message || "Next patient called.");
        await loadDoctorQueue(selectedDoctorId);
      } else {
        alert(res.data?.message || "No patients waiting in queue.");
      }
    } catch (err: any) {
      console.error("Failed to call next patient:", err);
      alert(err.response?.data?.message || "Failed to call next patient.");
    }
  };

  const handleStartConsultation = async (tokenId: string) => {
    try {
      await startConsultationApi(tokenId);
      await loadDoctorQueue(selectedDoctorId);
    } catch (err) {
      console.error("Failed to start consultation:", err);
      alert("Failed to start consultation.");
    }
  };

  const handleCompleteConsultation = async (tokenId: string) => {
    try {
      await completeConsultationApi(tokenId);
      await loadDoctorQueue(selectedDoctorId);
    } catch (err) {
      console.error("Failed to complete consultation:", err);
      alert("Failed to complete consultation.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createTokenApi({
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        priority: parseInt(formData.priority, 10),
      });

      setShowModal(false);
      setFormData((prev) => ({ ...prev, patientId: "", priority: "0" }));
      
      // Refresh active queue if doctor matches
      if (formData.doctorId === selectedDoctorId) {
        await loadDoctorQueue(selectedDoctorId);
      }
    } catch (err: any) {
      console.error("Failed to create token:", err);
      setError(err.response?.data?.message || "Failed to issue queue token.");
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
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Outpatient Queue</h1>
              <p className="text-slate-500 mt-1">Manage clinician consultation queues and patient intake tokens</p>
            </div>
            
            <button
              onClick={() => {
                setFormData((prev) => ({ ...prev, doctorId: selectedDoctorId }));
                setShowModal(true);
              }}
              className="px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 active:bg-indigo-700 transition shadow-sm shadow-indigo-600/10 cursor-pointer self-start sm:self-auto"
            >
              + Issue Token
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
              <span className="font-medium text-slate-600">Loading queue configurations...</span>
            </div>
          ) : (
            <>
              {/* Token Stats Dashboard */}
              {dashboardStats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Waiting</span>
                    <div className="text-3xl font-bold text-indigo-600 mt-2">{dashboardStats.totalWaiting || 0}</div>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Doctors</span>
                    <div className="text-3xl font-bold text-slate-800 mt-2">{dashboardStats.activeDoctors || 0}</div>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Consulted Today</span>
                    <div className="text-3xl font-bold text-emerald-600 mt-2">{dashboardStats.completedToday || 0}</div>
                  </div>
                </div>
              )}

              {/* Doctor Selector & Queue Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <span className="text-sm font-medium text-slate-500 shrink-0">Clinician:</span>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full sm:w-64 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select Doctor...</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.doctorName || d.name} ({d.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  disabled={!selectedDoctorId || queueLoading}
                  onClick={handleCallNext}
                  className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-xl transition shadow-sm disabled:opacity-40 cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <span>📢</span>
                  <span>Call Next Patient</span>
                </button>
              </div>

              {/* Queue List Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-800">Queue Schedule</h3>
                  <p className="text-slate-500 text-sm mt-0.5">Live outpatient waiting line for selected physician</p>
                </div>

                {queueLoading ? (
                  <div className="p-12 text-center flex items-center justify-center space-x-2 text-indigo-600">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-slate-500">Querying waiting list...</span>
                  </div>
                ) : queue.length === 0 ? (
                  <div className="p-12 text-center">
                    <h3 className="text-base font-semibold text-slate-800">Queue is Clear</h3>
                    <p className="text-slate-500 mt-1 text-sm">No patients are currently waiting for this doctor.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                          <th className="px-6 py-4">Token #</th>
                          <th className="px-6 py-4">Patient Name</th>
                          <th className="px-6 py-4">Priority Level</th>
                          <th className="px-6 py-4">Queue Status</th>
                          <th className="px-6 py-4 text-right">Consultation Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                        {queue.map((token) => (
                          <tr key={token._id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">
                              #{token.tokenNumber}
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-900">
                              {token.patientId?.name || "Unknown Patient"}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${
                                  token.priority > 1
                                    ? "bg-rose-50 text-rose-600"
                                    : token.priority === 1
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {token.priority > 1 ? "HIGH" : token.priority === 1 ? "MEDIUM" : "NORMAL"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  token.status === "COMPLETED"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : token.status === "IN_PROGRESS"
                                    ? "bg-indigo-50 text-indigo-700 animate-pulse"
                                    : token.status === "CALLED"
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {token.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-1.5">
                              {token.status === "CALLED" && (
                                <button
                                  onClick={() => handleStartConsultation(token._id)}
                                  className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold rounded-lg text-xs transition cursor-pointer"
                                >
                                  Start Consultation
                                </button>
                              )}
                              {token.status === "IN_PROGRESS" && (
                                <button
                                  onClick={() => handleCompleteConsultation(token._id)}
                                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg text-xs transition cursor-pointer"
                                >
                                  Complete Session
                                </button>
                              )}
                              {token.status === "WAITING" && (
                                <span className="text-xs text-slate-400 italic">Awaiting call...</span>
                              )}
                              {token.status === "COMPLETED" && (
                                <span className="text-xs text-emerald-600 font-medium">✓ Closed</span>
                              )}
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

      {/* Issue Token Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Issue Queue Token</h2>
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Consulting Doctor</label>
                <select
                  required
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, doctorId: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                >
                  <option value="">Choose Doctor...</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>{d.doctorName || d.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority Level</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                >
                  <option value="0">Normal (0)</option>
                  <option value="1">Medium (1)</option>
                  <option value="2">Urgent (2)</option>
                </select>
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
                  className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 active:bg-indigo-700 transition shadow-sm shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Issuing..." : "Issue Token"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenQueue;