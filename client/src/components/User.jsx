import { useEffect, useState } from "react";
import { axiosClient } from "../lib/axios-client";
import { useStateContext } from "../contexts/StateProvider";

export const User = () => {
  const { user, setUser } = useStateContext();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    axiosClient("/me").then(({ data }) => {
      setUser(data);
    });
  }, [setUser]);

  return (
    <div
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className="relative text-sm font-semibold text-gray-600 bg-amber-400 w-10 aspect-square rounded-full flex justify-center items-center"
    >   
      {user?.name?.[0] || "N/A"}
      {user?.name && isVisible && (
        <div className="absolute bottom-0 translate-y-[100%] bg-white border border-gray-300 p-4 rounded-2xl">
          <ul>
            <li className="text-nowrap">
              <span>Name: </span>
              {user?.name}
            </li>
            <li className="text-nowrap">
              <span>Email: </span>
              {user?.email}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
