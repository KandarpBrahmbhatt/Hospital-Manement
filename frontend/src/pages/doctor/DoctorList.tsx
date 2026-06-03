import { useEffect, useState } from "react";
import { getDoctorsApi } from "../../services/doctorApi";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const DoctorList = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getDoctorsApi();
        if (Array.isArray(res.data)) {
          setDoctors(res.data);
        } else {
          setDoctors([]);
        }
      } catch (err: any) {
        console.error("Failed to fetch doctors:", err);
        setError("Failed to fetch doctors list from backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <div className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Medical Staff</h1>
            <p className="text-slate-500 mt-1">View specialized doctors and active clinicians</p>
          </div>

          {/* Doctors Grid */}
          {error ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
              <p className="text-rose-500 font-medium">{error}</p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12 space-x-2 text-indigo-600">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="font-medium text-slate-600">Loading clinicians...</span>
            </div>
          ) : doctors.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800">No Doctors Registered</h3>
              <p className="text-slate-500 mt-1 text-sm">Use database seeder to generate medical staff.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => {
                const name = doctor.doctorName || doctor.name || "Doctor";
                const initials = name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2);
                
                const specFallback = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology", "ENT", "Dermatology"][
                  Math.abs(name.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) % 7
                ];
                const specialization = doctor.specialization || specFallback;

                return (
                  <div
                    key={doctor._id}
                    className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100/60 text-indigo-600 flex items-center justify-center font-bold text-base shrink-0">
                        {initials}
                      </div>

                      {/* Clinician Details */}
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-slate-800 truncate">{name}</h3>
                        <p className="text-xs text-indigo-600 font-medium mt-0.5">{specialization}</p>
                        <p className="text-xs text-slate-400 mt-1">ID: {doctor._id.substring(18)}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="text-slate-500">
                        Total Appointments
                      </div>
                      <div className="font-semibold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-full">
                        {doctor.patientCount ?? 0} visits
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorList;