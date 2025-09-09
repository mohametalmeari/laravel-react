import { Navigate, Outlet } from "react-router";
import { useStateContext } from "../contexts/StateProvider";
import { Navbar } from "../components/Navbar";

export const ProtectedLayout = () => {
  const { token } = useStateContext();

  if (!token) {
    return <Navigate to={"/signin"} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        className={
          "flex gap-2.5 items-center p-2 border-b-2 border-blue-300 shadow px-4 sm:px-20 md:px-32 lg:px-40"
        }
      />
      <main className="flex-1 flex flex-col *:flex-1 py-4 md:py-10 px-4 sm:px-20 md:px-32 lg:px-40">
        <Outlet />
      </main>
    </div>
  );
};
