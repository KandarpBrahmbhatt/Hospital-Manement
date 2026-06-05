import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  getBillsApi, 
  getBillingDashboardApi, 
  getAllBillsApi, 
  getBillPdfApi, 
  createPaymentIntentApi 
} from "../../services/billApi";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const BillList = () => {
  const [deptBills, setDeptBills] = useState<any[]>([]);
  const [individualBills, setIndividualBills] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    revenue: 0,
    billsCount: 0,
    avgAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBillingData = async () => {
    setLoading(true);
    setError("");
    try {
      const [billsRes, dashboardRes, individualRes] = await Promise.all([
        getBillsApi(),
        getBillingDashboardApi(),
        getAllBillsApi(),
      ]);

      if (Array.isArray(billsRes.data)) {
        setDeptBills(billsRes.data);
      }

      const dashData = dashboardRes.data?.[0];
      if (dashData) {
        setStats({
          revenue: dashData.totalRevenue?.[0]?.revenue || 0,
          billsCount: dashData.totalBills?.[0]?.count || 0,
          avgAmount: dashData.averageBill?.[0]?.avgBill || 0,
        });
      }

      if (individualRes.data) {
        setIndividualBills(individualRes.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch billing data:", err);
      setError("Failed to fetch billing records. Verify authorization credentials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const handleDownloadPdf = async (billId: string) => {
    try {
      const res = await getBillPdfApi(billId);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `bill-${billId}.pdf`;
      link.click();
    } catch (err) {
      console.error("Failed to download bill PDF:", err);
      alert("Failed to retrieve bill PDF.");
    }
  };

  const handlePayOnline = async (billId: string) => {
    try {
      const res = await createPaymentIntentApi(billId);
      if (res.data?.url) {
        // Redirect browser to Stripe Checkout Session URL
        window.location.href = res.data.url;
      } else {
        alert("Payment gateway session could not be established.");
      }
    } catch (err) {
      console.error("Payment session error:", err);
      alert("Failed to initialize payment check.");
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
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Billing & Revenue</h1>
              <p className="text-slate-500 mt-1">Financial summaries, invoicing logs, and departmental earnings</p>
            </div>
            
            <Link
              to="/bills/create"
              className="px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 active:bg-indigo-700 transition shadow-sm shadow-indigo-600/10 cursor-pointer self-start sm:self-auto text-center"
            >
              + Generate Bill
            </Link>
          </div>

          {error ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
              <p className="text-rose-500 font-medium">{error}</p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12 space-x-2 text-indigo-600">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="font-medium text-slate-600">Calculating financial reports...</span>
            </div>
          ) : (
            <>
              {/* Financial Dashboard Summary Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue Card */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <div className="text-sm font-medium text-slate-500">Total Revenue</div>
                  <div className="text-3xl font-bold text-indigo-600 mt-2">
                    ₹{stats.revenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Across all departments</div>
                </div>

                {/* Bills Count Card */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <div className="text-sm font-medium text-slate-500">Invoices Generated</div>
                  <div className="text-3xl font-bold text-slate-800 mt-2">
                    {stats.billsCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Total active billing entries</div>
                </div>

                {/* Average Bill Card */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <div className="text-sm font-medium text-slate-500">Average Transaction</div>
                  <div className="text-3xl font-bold text-slate-800 mt-2">
                    ₹{Math.round(stats.avgAmount).toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Average invoice value</div>
                </div>
              </div>

              {/* Department breakdown card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-800">Departmental Earnings Breakdown</h3>
                  <p className="text-slate-500 text-sm mt-0.5">Earnings grouped by consulting departments</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                        <th className="px-6 py-4">Department</th>
                        <th className="px-6 py-4">Total Revenue</th>
                        <th className="px-6 py-4">Total Invoices</th>
                        <th className="px-6 py-4">Revenue Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                      {deptBills.map((row, idx) => {
                        const share = stats.revenue > 0 ? (row.totalRevenue / stats.revenue) * 100 : 0;
                        return (
                          <tr key={row._id || idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 font-semibold text-slate-900">{row._id || "General Consultation"}</td>
                            <td className="px-6 py-4 font-medium text-slate-700">₹{row.totalRevenue.toLocaleString()}</td>
                            <td className="px-6 py-4 text-slate-500">{row.totalBills} invoices</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden shrink-0">
                                  <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ width: `${Math.min(share, 100)}%` }}
                                  />
                                </div>
                                <span className="text-xs font-semibold text-slate-600">{share.toFixed(1)}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Individual Bills List */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-800">Generated Invoices Ledger</h3>
                  <p className="text-slate-500 text-sm mt-0.5">Chronological log of generated bills, PDF documents, and online payments</p>
                </div>

                {individualBills.length === 0 ? (
                  <div className="p-12 text-center">
                    <h3 className="text-base font-semibold text-slate-800">No Invoices Found</h3>
                    <p className="text-slate-500 mt-1 text-sm">Create a new bill above to populate the ledger.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                          <th className="px-6 py-4">Invoice ID</th>
                          <th className="px-6 py-4">Patient Name</th>
                          <th className="px-6 py-4">Clinician</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                        {individualBills.map((bill) => (
                          <tr key={bill._id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-slate-400">
                              {bill._id?.substring(18) || "N/A"}
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-900">
                              {bill.patientId?.name || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {bill.doctorId?.doctorName || bill.doctorId?.name || "N/A"}
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-900">
                              ₹{bill.amount?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-xs">
                              {new Date(bill.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right space-x-1.5">
                              <button
                                onClick={() => handleDownloadPdf(bill._id)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition cursor-pointer"
                              >
                                PDF
                              </button>
                              <button
                                onClick={() => handlePayOnline(bill._id)}
                                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg text-xs transition cursor-pointer"
                              >
                                Pay Online
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
    </div>
  );
};

export default BillList;