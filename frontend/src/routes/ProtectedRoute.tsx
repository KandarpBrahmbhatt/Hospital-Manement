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
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const user = useSelector((state: any) => state.auth.user);

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;