// import {
//   Navigate,
//   Outlet,
// } from "react-router-dom";

// import { useSelector } from "react-redux";

// export default function ProtectedRoute() {
//   const user = useSelector(
//     (state: any) =>
//       state.auth.user
//   );

//   return user ? (
//     <Outlet />
//   ) : (
//     <Navigate to="/login" />
//   );
// }
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;