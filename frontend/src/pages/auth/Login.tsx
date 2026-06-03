import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setUser } from "../../redux/authSlice";
import { loginApi } from "../../services/authApi";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const res = await loginApi({
        email,
        password,
      });

      dispatch(setUser(res.data.user));
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <form
        onSubmit={submitHandler}
        className="w-96 rounded bg-white p-6 shadow"
      >
        <h2 className="mb-5 text-2xl font-bold">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          className="mb-3 w-full border p-2"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          className="mb-4 w-full border p-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full rounded bg-blue-600 p-2 text-white">
          Login
        </button>
      </form>
    </div>
  );
}
