import { useState } from "react";
import { useStateContext } from "../contexts/StateProvider";
import { axiosClient } from "../lib/axios-client";

export const SignOutButton = () => {
  const [disabled, setDisabled] = useState(false);

  const { setToken, setUser } = useStateContext();

  const handleSignOut = () => {
    setDisabled(true);
    axiosClient
      .post("/logout")
      .then(() => {
        setToken(null);
        setUser({});
      })
      .finally(() => {
        setDisabled(false);
      });
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-600 text-white p-2 px-4 rounded hover:bg-red-400 disabled:bg-gray-400"
      disabled={disabled}
    >
      Sign Out
    </button>
  );
};
