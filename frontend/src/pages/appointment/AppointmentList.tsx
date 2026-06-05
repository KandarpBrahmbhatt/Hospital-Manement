import { useEffect, useState } from "react";
import { 
  getAppointmentsApi, 
  createAppointmentApi, 
  cancelAppointmentApi, 
  rescheduleAppointmentApi, 
  getDailyAppointmentStatsApi 
} from "../../services/appointmentApi";
import { getPatientsApi } from "../../services/patientApi";
import { getDoctorsApi } from "../../services/doctorApi";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Reschedule state
  const [rescheduleTarget, setRescheduleTarget] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    status: "Pending",
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [apptsRes, statsRes, patientsRes, doctorsRes] = await Promise.all([
        getAppointmentsApi(),
        getDailyAppointmentStatsApi(),
        getPatientsApi(1, 1000),
        getDoctorsApi(),
      ]);

      if (apptsRes.data?.success && Array.isArray(apptsRes.data.data)) {
        setAppointments(apptsRes.data.data);
      } else {
        setAppointments([]);
      }

      if (Array.isArray(statsRes.data)) {
        setDailyStats(statsRes.data.slice(-5)); // show last 5 days
      }

      setPatients(patientsRes.data?.patent || []);
      setDoctors(doctorsRes.data || []);
    } catch (err) {
      console.error("Failed to load appointments data:", err);
      setError("Failed to fetch appointment registry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await cancelAppointmentApi(id);
      alert("Appointment cancelled successfully.");
      await loadData();
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
      alert("Failed to cancel appointment.");
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTarget || !newDate) return;
    try {
      await rescheduleAppointmentApi(rescheduleTarget, new Date(newDate).toISOString());
      alert("Appointment rescheduled successfully.");
      setRescheduleTarget(null);
      setNewDate("");
      await loadData();
    } catch (err) {
      console.error("Failed to reschedule appointment:", err);
      alert("Failed to reschedule appointment.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createAppointmentApi({
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        appointmentDate: new Date(formData.appointmentDate).toISOString(),
        status: formData.status,
      });

      setShowModal(false);
      setFormData({
        patientId: "",
        doctorId: "",
        appointmentDate: "",
        status: "Pending",
      });
      await loadData();
    } catch (err: any) {
      console.error("Failed to book appointment:", err);
      setError(err.response?.data?.message || "Failed to schedule appointment.");
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
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Appointment Booking</h1>
              <p className="text-slate-500 mt-1">Schedule patient consultations, assign clinicians, and track scheduling</p>
            </div>
            
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 active:bg-indigo-700 transition shadow-sm shadow-indigo-600/10 cursor-pointer self-start sm:self-auto"
            >
              + Book Appointment
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
              <span className="font-medium text-slate-600">Loading appointments data...</span>
            </div>
          ) : (
            <>
              {/* Daily Stats Grid */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <span className="text-sm font-medium text-slate-500">Daily Consultation Traffic</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-3">
                  {dailyStats.length === 0 ? (
                    <span className="text-sm text-slate-400 italic">No scheduled consultation logs found.</span>
                  ) : (
                    dailyStats.map((s, idx) => (
                      <div key={idx} className="bg-indigo-50/40 px-3.5 py-2.5 rounded-xl border border-indigo-100/30">
                        <div className="text-xs text-indigo-600 font-semibold">{s._id}</div>
                        <div className="text-xl font-bold text-slate-800 mt-1">{s.totalAppointments} visits</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Active Bookings list */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-800">Booking Manifest</h3>
                  <p className="text-slate-500 text-sm mt-0.5">Audit log of pending and finalized patient encounters</p>
                </div>

                {appointments.length === 0 ? (
                  <div className="p-12 text-center">
                    <h3 className="text-base font-semibold text-slate-800">No Appointments Booked</h3>
                    <p className="text-slate-500 mt-1 text-sm">Schedule an appointment to populate the manifest.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                          <th className="px-6 py-4">Patient Name</th>
                          <th className="px-6 py-4">Assigned Doctor</th>
                          <th className="px-6 py-4">Schedule Date & Time</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                        {appointments.map((appt) => (
                          <tr key={appt._id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 font-semibold text-slate-900">
                              {appt.patientId?.name || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {appt.doctorId?.doctorName || appt.doctorId?.name || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                              {new Date(appt.appointmentDate).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  appt.status === "Completed"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : appt.status === "Pending"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-rose-50 text-rose-700"
                                }`}
                              >
                                {appt.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-1.5">
                              {appt.status === "Pending" && (
                                <>
                                  <button
                                    onClick={() => setRescheduleTarget(appt._id)}
                                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition cursor-pointer"
                                  >
                                    Reschedule
                                  </button>
                                  <button
                                    onClick={() => handleCancel(appt._id)}
                                    className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium rounded-lg text-xs transition cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </>
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

      {/* Book Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Schedule Patient Consultation</h2>
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
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Physician</label>
                <select
                  required
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, doctorId: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                >
                  <option value="">Choose Physician...</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>{d.doctorName || d.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Appointment Date & Time</label>
                <input
                  required
                  type="datetime-local"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, appointmentDate: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
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
                  {submitting ? "Booking..." : "Schedule Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-5">
            <h3 className="text-lg font-bold text-slate-800">Reschedule Consultation</h3>
            
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Date & Time</label>
                <input
                  required
                  type="datetime-local"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleTarget(null)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium text-sm hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-500 active:bg-indigo-700 transition text-sm cursor-pointer"
                >
                  Confirm Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;