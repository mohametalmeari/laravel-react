import { Navigate, Outlet } from "react-router";
import { useStateContext } from "../contexts/StateProvider";

export const ProtectedLayout = () => {
  const { token } = useStateContext();

  if (!token) {
    return <Navigate to={"/signin"} />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};
