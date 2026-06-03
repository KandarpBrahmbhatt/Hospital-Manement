import { useState } from "react";
import { signupApi } from "../../services/authApi";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
      confirm_password:
        "",
      roleId: "",
    });

  const submitHandler = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await signupApi(form);

      alert(
        "Account Created"
      );

      navigate(
        "/login"
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form
        onSubmit={
          submitHandler
        }
        className="bg-white p-6 shadow rounded w-96"
      >
        <h2 className="text-2xl mb-4">
          Signup
        </h2>

        <input
          placeholder="Name"
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Confirm Password"
          type="password"
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setForm({
              ...form,
              confirm_password:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Role Id"
          className="border p-2 w-full mb-4"
          onChange={(e) =>
            setForm({
              ...form,
              roleId:
                e.target.value,
            })
          }
        />

        <button className="bg-green-600 text-white p-2 rounded w-full">
          Signup
        </button>
      </form>
    </div>
  );
}