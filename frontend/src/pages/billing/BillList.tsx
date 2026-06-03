import { useEffect, useState } from "react";
import { getBillsApi, getBillingDashboardApi } from "../../services/billApi";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const BillList = () => {
  const [deptBills, setDeptBills] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    revenue: 0,
    billsCount: 0,
    avgAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBillingData = async () => {
      setLoading(true);
      setError("");
      try {
        const [billsRes, dashboardRes] = await Promise.all([
          getBillsApi(),
          getBillingDashboardApi(),
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
      } catch (err: any) {
        console.error("Failed to fetch billing data:", err);
        setError("Failed to fetch billing records. Make sure you are authorized.");
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <div className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Billing & Revenue</h1>
            <p className="text-slate-500 mt-1">Financial summaries, invoicing logs, and departmental earnings</p>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillList;