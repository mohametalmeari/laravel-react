import { createContext, useContext, useState } from "react";

const StateContext = createContext({
  user: {},
  token: null,
  setUser: () => {},
  setToken: () => {},
});

export const StateProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(null);

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  return (
    <StateContext.Provider value={{ user, token, setUser, setToken }}>
      {children}
    </StateContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStateContext = () => useContext(StateContext);
