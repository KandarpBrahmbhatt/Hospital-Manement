import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { setUser } from "../../redux/authSlice";
import { loginApi } from "../../services/authApi";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await loginApi({
                email,
                password,
            });

            // Save user to LocalStorage for session hydration
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", "authenticated");

            dispatch(setUser(res.data.user));
            navigate("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Invalid Credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-slate-100 font-sans">
            {/* Decorative Branding Section */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-cover bg-center relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black border-r border-white/5">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <span className="text-xl font-bold text-white">H</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        CareFlow HMS
                    </span>
                </div>

                <div className="relative z-10 max-w-md">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                        Streamlining healthcare management with modern technology.
                    </h1>
                    <p className="text-lg text-slate-400">
                        A comprehensive, real-time clinical platform ensuring high efficiency, patient safety, and seamless hospital operations.
                    </p>
                </div>

                <div className="relative z-10 text-sm text-slate-500">
                    &copy; 2026 CareFlow Health Inc. All rights reserved.
                </div>
            </div>

            {/* Login Form Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/40">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                            Welcome back
                        </h2>
                        <p className="text-slate-400 mt-2 font-light">Sign in to your HMS staff account</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="doctor@hospital.com"
                                value={email}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all duration-250 cursor-pointer shadow-lg shadow-indigo-600/20 flex justify-center items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Sign in</span>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-400">
                        Don't have an account yet?{" "}
                        <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
