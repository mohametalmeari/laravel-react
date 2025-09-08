import { Navigate, Outlet } from "react-router";
import { useStateContext } from "../contexts/StateProvider";

export const GuestLayout = () => {
  const { token } = useStateContext();

  if (token) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};
