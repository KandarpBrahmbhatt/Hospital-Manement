import { Navigate } from "react-router-dom";

interface Props {
  role: string;
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function RoleRoute({
  role,
  allowedRoles,
  children,
}: Props) {
  if (
    !allowedRoles.includes(role)
  ) {
    return (
      <Navigate
        to="/dashboard"
      />
    );
  }

  return <>{children}</>;
}