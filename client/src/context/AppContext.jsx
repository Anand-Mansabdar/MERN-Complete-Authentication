import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  // Variables used in multiple components
  const backendUrl = import.meta.env.VITE_URL;
  const [isLoggedIn, setIsLoggedIn] = props.useState(false);
  const [userData, setUserData] = useState(false);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
