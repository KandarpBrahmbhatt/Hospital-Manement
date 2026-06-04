import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-slate-100">
      <h2 className="text-lg font-semibold text-slate-800">Hospital Management System</h2>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-rose-50 text-rose-600 font-medium rounded-lg hover:bg-rose-100 active:bg-rose-200 transition-colors duration-200 cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;