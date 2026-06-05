import { useEffect, useState } from "react";
import { 
  getMedicalRecordsApi, 
  createMedicalRecordApi, 
  deleteMedicalRecordApi, 
  getMedicalDashboardApi,
  downloadAndEmailMedicalPdfApi
} from "../../services/medicalRecordApi";
import { getPatientsApi } from "../../services/patientApi";
import { getDoctorsApi } from "../../services/doctorApi";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const MedicalRecordList = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalRecords: 0, commonDiseases: [] as any[] });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    diagnosis: "",
    symptomsInput: "",
    allergiesInput: "",
    treatmentNotes: "",
    prescription: [{ medicine: "", dosage: "", duration: "" }],
  });

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [recordsRes, statsRes, patientsRes, doctorsRes] = await Promise.all([
        getMedicalRecordsApi(),
        getMedicalDashboardApi(),
        getPatientsApi(1, 1000),
        getDoctorsApi()
      ]);

      if (recordsRes.data && Array.isArray(recordsRes.data.medicalRecord)) {
        setRecords(recordsRes.data.medicalRecord);
      } else {
        setRecords([]);
      }

      // Stats parser
      const facetData = statsRes.data?.data?.[0];
      if (facetData) {
        setStats({
          totalRecords: facetData.totalRecords?.[0]?.count || 0,
          commonDiseases: facetData.commonDiseases || [],
        });
      }

      setPatients(patientsRes.data?.patent || []);
      setDoctors(doctorsRes.data || []);
    } catch (err: any) {
      console.error("Failed to load medical records data:", err);
      setError("Failed to retrieve medical records. Verify permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddPrescriptionRow = () => {
    setFormData((prev) => ({
      ...prev,
      prescription: [...prev.prescription, { medicine: "", dosage: "", duration: "" }],
    }));
  };

  const handleRemovePrescriptionRow = (index: number) => {
    if (formData.prescription.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      prescription: prev.prescription.filter((_, idx) => idx !== index),
    }));
  };

  const handlePrescriptionChange = (index: number, field: string, value: string) => {
    const newPrescription = [...formData.prescription];
    newPrescription[index] = { ...newPrescription[index], [field]: value };
    setFormData((prev) => ({ ...prev, prescription: newPrescription }));
  };

  const handleDownloadAndEmailPdf = async (recordId: string, emailOnly = false) => {
    try {
      const res = await downloadAndEmailMedicalPdfApi(recordId);
      
      // Save PDF binary to file
      const blob = new Blob([res.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `medical-record-${recordId}.pdf`;
      link.click();
      
      alert(emailOnly 
        ? "PDF generated, sent to patient email, and downloaded locally successfully!"
        : "PDF downloaded successfully!"
      );
    } catch (err) {
      console.error("Failed to process PDF dispatch:", err);
      alert("Failed to compile or dispatch PDF.");
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!window.confirm("Are you sure you want to delete this medical record?")) return;
    try {
      await deleteMedicalRecordApi(recordId);
      setRecords((prev) => prev.filter((r) => r._id !== recordId));
      alert("Medical record deleted successfully.");
    } catch (err) {
      console.error("Failed to delete record:", err);
      alert("Failed to delete medical record.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const symptoms = formData.symptomsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const allergies = formData.allergiesInput
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

      const payload = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        diagnosis: formData.diagnosis,
        symptoms,
        prescription: formData.prescription,
        allergies,
        treatmentNotes: formData.treatmentNotes,
      };

      await createMedicalRecordApi(payload);
      setShowModal(false);
      setFormData({
        patientId: "",
        doctorId: "",
        diagnosis: "",
        symptomsInput: "",
        allergiesInput: "",
        treatmentNotes: "",
        prescription: [{ medicine: "", dosage: "", duration: "" }],
      });
      await fetchData();
    } catch (err: any) {
      console.error("Failed to create medical record:", err);
      setError(err.response?.data?.message || "Failed to create medical record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <div className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Medical Records</h1>
              <p className="text-slate-500 mt-1">Manage and view clinical diagnoses, symptom logs, and PDF files</p>
            </div>
            
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 active:bg-indigo-700 transition shadow-sm shadow-indigo-600/10 cursor-pointer self-start sm:self-auto"
            >
              + Create Medical Record
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
              <span className="font-medium text-slate-600">Retrieving clinical records...</span>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-sm font-medium text-slate-500">Total Medical Records</span>
                    <div className="text-3xl font-bold text-indigo-600 mt-2">{stats.totalRecords}</div>
                  </div>
                  <span className="text-xs text-slate-400 mt-4">Active clinical encounters logged</span>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm md:col-span-2">
                  <span className="text-sm font-medium text-slate-500">Top Diagnoses / Common Diseases</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3">
                    {stats.commonDiseases.length === 0 ? (
                      <span className="text-sm text-slate-400 italic">No statistical data available.</span>
                    ) : (
                      stats.commonDiseases.map((d, idx) => (
                        <div key={idx} className="bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-100">
                          <div className="text-xs text-slate-500 font-medium truncate">{d._id || "Unknown"}</div>
                          <div className="text-lg font-bold text-slate-800 mt-1">{d.count} cases</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Records Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-800">Encounter History</h3>
                  <p className="text-slate-500 text-sm mt-0.5">Chronological list of patient diagnoses and treatment prescriptions</p>
                </div>

                {records.length === 0 ? (
                  <div className="p-12 text-center">
                    <h3 className="text-base font-semibold text-slate-800">No Encounters Logged</h3>
                    <p className="text-slate-500 mt-1 text-sm">Add a new medical record to start auditing.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                          <th className="px-6 py-4">Patient ID</th>
                          <th className="px-6 py-4">Diagnosis</th>
                          <th className="px-6 py-4">Symptoms</th>
                          <th className="px-6 py-4">Prescriptions</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                        {records.map((rec) => (
                          <tr key={rec._id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-slate-400">
                              {rec.patientId?.substring(18) || "N/A"}
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-900">
                              {rec.diagnosis}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {(rec.symptoms || []).map((sym: string, i: number) => (
                                  <span key={i} className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                                    {sym}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500">
                              <ul className="list-disc pl-4 space-y-0.5">
                                {(rec.prescription || []).map((p: any, i: number) => (
                                  <li key={i}>
                                    {p.medicine} ({p.dosage} - {p.duration})
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-xs">
                              {new Date(rec.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right space-x-1.5 shrink-0">
                              <button
                                onClick={() => handleDownloadAndEmailPdf(rec._id, true)}
                                className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium rounded-lg text-xs transition cursor-pointer"
                              >
                                Email/PDF
                              </button>
                              <button
                                onClick={() => handleDeleteRecord(rec._id)}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium rounded-lg text-xs transition cursor-pointer"
                              >
                                Delete
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

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Add Clinical Medical Record</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Diagnosis</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Acute Viral Bronchitis, Type 2 Diabetes"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData((prev) => ({ ...prev, diagnosis: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Symptoms (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Fever, Cough, Congestion"
                    value={formData.symptomsInput}
                    onChange={(e) => setFormData((prev) => ({ ...prev, symptomsInput: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Allergies (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Penicillin, Peanuts"
                    value={formData.allergiesInput}
                    onChange={(e) => setFormData((prev) => ({ ...prev, allergiesInput: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Prescription Row Inputs */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prescriptions</label>
                  <button
                    type="button"
                    onClick={handleAddPrescriptionRow}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                  >
                    + Add Medicine
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {formData.prescription.map((pres, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        required
                        type="text"
                        placeholder="Medicine"
                        value={pres.medicine}
                        onChange={(e) => handlePrescriptionChange(idx, "medicine", e.target.value)}
                        className="flex-1 min-w-0 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                      />
                      <input
                        required
                        type="text"
                        placeholder="Dosage (e.g. 500mg)"
                        value={pres.dosage}
                        onChange={(e) => handlePrescriptionChange(idx, "dosage", e.target.value)}
                        className="w-28 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                      />
                      <input
                        required
                        type="text"
                        placeholder="Duration (e.g. 5 days)"
                        value={pres.duration}
                        onChange={(e) => handlePrescriptionChange(idx, "duration", e.target.value)}
                        className="w-28 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        disabled={formData.prescription.length === 1}
                        onClick={() => handleRemovePrescriptionRow(idx)}
                        className="w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 disabled:opacity-30 cursor-pointer text-sm font-bold shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Treatment / Consultation Notes</label>
                <textarea
                  placeholder="Clinical records notes regarding course of treatment"
                  rows={3}
                  value={formData.treatmentNotes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, treatmentNotes: e.target.value }))}
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
                  className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 active:bg-indigo-700 transition shadow-sm shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Generate Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordList;
