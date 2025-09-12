import { useContext, createContext, useState, useEffect } from "react";

const UserContext = createContext();

// context + localStorage so that data remain save after refresh page
export const UserProvider = ({ children }) => {
  const [userProfileData, setUserProfileData] = useState(() => {
    const storedProfile = localStorage.getItem("userProfile");
    return storedProfile ? JSON.parse(storedProfile) : null;
  });

  useEffect(() => {
    if (userProfileData) {
      localStorage.setItem("userProfile", JSON.stringify(userProfileData));
    }
  }, [userProfileData]); // update the localStorage with fresh data

  return (
    <UserContext.Provider value={{ userProfileData, setUserProfileData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
