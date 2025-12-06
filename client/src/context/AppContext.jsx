import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  // Variables used in multiple components
  const backendUrl = import.meta.env.VITE_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getUserData = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error("Something went wrong. Please try again.", error.message);
    }
  };

  const getAuthStatus = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(
        `${backendUrl}/api/auth/is-authenticated`
      );

      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
      }
    } catch (error) {
      // User is not authenticated, no need to show error
    }
  };

  useEffect(() => {
    getAuthStatus();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
