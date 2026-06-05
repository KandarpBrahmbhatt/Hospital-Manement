import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBillApi } from "../../services/billApi";
import { getPatientsApi } from "../../services/patientApi";
import { getDoctorsApi } from "../../services/doctorApi";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const CreateBill = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    amount: "",
  });

  useEffect(() => {
    const loadSelectionLists = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          getPatientsApi(1, 1000),
          getDoctorsApi(),
        ]);
        setPatients(patientsRes.data?.patent || []);
        setDoctors(doctorsRes.data || []);
      } catch (err) {
        console.error("Failed to load options:", err);
        setError("Failed to load patients or doctors selection options.");
      } finally {
        setFetching(false);
      }
    };
    loadSelectionLists();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        amount: parseFloat(formData.amount),
      };

      await createBillApi(payload);
      navigate("/bills");
    } catch (err: any) {
      console.error("Failed to generate bill:", err);
      setError(err.response?.data?.message || "Failed to generate patient invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <div className="p-6 sm:p-8 space-y-6 max-w-2xl w-full mx-auto">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Generate Invoice</h1>
            <p className="text-slate-500 mt-1">Create a new bill record for medical services rendered</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium">
                {error}
              </div>
            )}

            {fetching ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium text-slate-500">Loading form selections...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Patient</label>
                  <select
                    required
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                  >
                    <option value="">Choose Patient...</option>
                    {patients.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Physician</label>
                  <select
                    required
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                  >
                    <option value="">Choose Physician...</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.doctorName || d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Amount (₹)</label>
                  <input
                    required
                    type="number"
                    name="amount"
                    min="1"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="2500"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => navigate("/bills")}
                    className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 active:bg-indigo-700 transition shadow-sm shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Generating..." : "Generate & Post Invoice"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBill;
