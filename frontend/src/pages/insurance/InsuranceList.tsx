import { useEffect, useState } from "react";
import { getPatientsApi } from "../../services/patientApi";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const InsuranceList = () => {
  const [insuredPatients, setInsuredPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    activePolicies: 0,
    cumulativeCoverage: 0,
  });

  useEffect(() => {
    const fetchInsuranceData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getPatientsApi(1, 1000);
        const allPatients = res.data?.patent || [];
        
        // Filter patients who have active insurance
        const filtered = allPatients.filter((p: any) => p.insurance?.hasInsurance);
        setInsuredPatients(filtered);

        // Calculate statistics
        const coverageSum = filtered.reduce(
          (sum: number, p: any) => sum + (parseFloat(p.insurance.coverageLimit) || 0),
          0
        );
        setStats({
          activePolicies: filtered.length,
          cumulativeCoverage: coverageSum,
        });
      } catch (err) {
        console.error("Failed to load insurance policies:", err);
        setError("Failed to retrieve insurance records.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsuranceData();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <div className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto animate-fadeIn">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Insurance Coverage</h1>
            <p className="text-slate-500 mt-1">Audit active health policies, coverage limits, and provider listings</p>
          </div>

          {error ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
              <p className="text-rose-500 font-medium">{error}</p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12 space-x-2 text-indigo-600">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="font-medium text-slate-600">Retrieving policy records...</span>
            </div>
          ) : (
            <>
              {/* Policy Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <span className="text-sm font-medium text-slate-500">Active Policies Filed</span>
                  <div className="text-3xl font-bold text-indigo-600 mt-2">{stats.activePolicies}</div>
                  <span className="text-xs text-slate-400 mt-4 block">Patients carrying health insurance cards</span>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <span className="text-sm font-medium text-slate-500">Cumulative Coverage Limit</span>
                  <div className="text-3xl font-bold text-slate-800 mt-2">₹{stats.cumulativeCoverage.toLocaleString()}</div>
                  <span className="text-xs text-slate-400 mt-4 block">Total sum of insured policy coverage</span>
                </div>
              </div>

              {/* Insured Patients Ledger */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-800">Coverage Registry</h3>
                  <p className="text-slate-500 text-sm mt-0.5">Summary of patient policies, limit parameters, and validity bounds</p>
                </div>

                {insuredPatients.length === 0 ? (
                  <div className="p-12 text-center">
                    <h3 className="text-base font-semibold text-slate-800">No Active Policies</h3>
                    <p className="text-slate-500 mt-1 text-sm">Insured patient records will populate this ledger.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                          <th className="px-6 py-4">Patient Name</th>
                          <th className="px-6 py-4">Insurance Provider</th>
                          <th className="px-6 py-4">Policy Number</th>
                          <th className="px-6 py-4">Coverage Limit</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Expiration Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                        {insuredPatients.map((p) => {
                          const isExpired = p.insurance.validTill && new Date(p.insurance.validTill) < new Date();
                          return (
                            <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-6 py-4 font-semibold text-slate-900">
                                {p.name}
                              </td>
                              <td className="px-6 py-4 text-slate-700">
                                {p.insurance.providerName || "N/A"}
                              </td>
                              <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                {p.insurance.policyNumber || "N/A"}
                              </td>
                              <td className="px-6 py-4 font-semibold text-slate-800">
                                ₹{(p.insurance.coverageLimit || 0).toLocaleString()}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    isExpired
                                      ? "bg-rose-50 text-rose-700"
                                      : "bg-emerald-50 text-emerald-700"
                                  }`}
                                >
                                  {isExpired ? "EXPIRED" : "ACTIVE"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-400 text-xs">
                                {p.insurance.validTill
                                  ? new Date(p.insurance.validTill).toLocaleDateString()
                                  : "N/A"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsuranceList;