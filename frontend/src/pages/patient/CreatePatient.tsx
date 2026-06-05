import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPatientApi } from "../../services/patientApi";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const CreatePatient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    email: "",
    phone: "",
    insurance: {
      hasInsurance: false,
      providerName: "",
      policyNumber: "",
      coverageLimit: "",
      validTill: "",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInsuranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      insurance: {
        ...prev.insurance,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10),
        insurance: {
          ...formData.insurance,
          coverageLimit: formData.insurance.hasInsurance 
            ? parseFloat(formData.insurance.coverageLimit) || 0 
            : 0,
          validTill: formData.insurance.hasInsurance && formData.insurance.validTill
            ? new Date(formData.insurance.validTill).toISOString()
            : undefined,
        },
      };

      await createPatientApi(payload);
      navigate("/patients");
    } catch (err: any) {
      console.error("Failed to create patient:", err);
      setError(err.response?.data?.message || "Failed to create patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <div className="p-6 sm:p-8 space-y-6 max-w-3xl w-full mx-auto">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Register New Patient</h1>
            <p className="text-slate-500 mt-1">Initialize a new patient clinical file and insurance policy</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Primary Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Age (Years)</label>
                  <input
                    required
                    type="number"
                    name="age"
                    min="0"
                    max="150"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="35"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Insurance */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasInsurance"
                    name="hasInsurance"
                    checked={formData.insurance.hasInsurance}
                    onChange={handleInsuranceChange}
                    className="w-4.5 h-4.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="hasInsurance" className="text-sm font-medium text-slate-700 select-none cursor-pointer">
                    This patient carries active health insurance policy
                  </label>
                </div>

                {formData.insurance.hasInsurance && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 bg-slate-50/50 border border-slate-100 rounded-2xl animate-fadeIn">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Provider Name</label>
                      <input
                        required
                        type="text"
                        name="providerName"
                        value={formData.insurance.providerName}
                        onChange={handleInsuranceChange}
                        placeholder="Star Health / LIC / HDFC"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:border-indigo-500 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Policy Number</label>
                      <input
                        required
                        type="text"
                        name="policyNumber"
                        value={formData.insurance.policyNumber}
                        onChange={handleInsuranceChange}
                        placeholder="POL-12345"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:border-indigo-500 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Coverage Limit (₹)</label>
                      <input
                        required
                        type="number"
                        name="coverageLimit"
                        value={formData.insurance.coverageLimit}
                        onChange={handleInsuranceChange}
                        placeholder="500000"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:border-indigo-500 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiration Date</label>
                      <input
                        required
                        type="date"
                        name="validTill"
                        value={formData.insurance.validTill}
                        onChange={handleInsuranceChange}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:border-indigo-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate("/patients")}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 active:bg-indigo-700 transition shadow-sm shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Save Patient File"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePatient;