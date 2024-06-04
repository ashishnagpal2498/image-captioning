import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const login = async (userData) => {
    setLoading(true);
    try {
      console.log("UserData", userData)
      const result = await axios.post("https://ym5vucaoxs5e3h6guymwn3w6hy0goxqn.lambda-url.us-east-1.on.aws/", {
        ...userData
      }, { "Content-Type": "application/json" });

      if (result.status === 200) {
        setSuccessMessage(true);

        setUser({ username: userData.email, token: result.data.token });
        localStorage.setItem(user, { username: userData.email, token: result.data.token })
        setTimeout(() => {
          setSuccessMessage(false);
        }, 3000);
      }
    } catch (error) {
      setError("Invalid Username or Password");
      setTimeout(() => setError(null), 5000);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const signUp = async (userData) => {
    setLoading(true);
    try {
      console.log("UserData -->", userData)
      const result = await axios.post("https://7aefcxazfpbzngdyldevdpblcm0mkegh.lambda-url.us-east-1.on.aws/", {
        ...userData
      }, { "Content-Type": "application/json" });
      console.log(result);
      if (result.status === 200) {
        setSuccessMessage(true);
        setTimeout(() => {
          setSuccessMessage(false);
        }, 3000);
      }
    } catch (error) {
      setError("Error registering user");
      setTimeout(() => setError(null), 5000);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(user)
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signUp, error, loading, successMessage }}>
      {children}
    </AuthContext.Provider>
  );
};
