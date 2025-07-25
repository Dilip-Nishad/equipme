import React, { createContext, useState, useContext, useEffect } from 'react';

const SessionContext = createContext();

export const UserSessionContext = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/check_session`, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Not authenticated - clear user data
          setCurrentUser(null);
          setRole('');
          return null;
        }
        throw new Error(`Session check failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.role === 'user' || data.role === 'owner') {
        setCurrentUser(data.details);
        setRole(data.role);
        return data.details;
      } else {
        throw new Error('No valid user role found');
      }
    } catch (error) {
      console.error('Error during session check:', error);
      setError(error.message);
      setCurrentUser(null);
      setRole('');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Run session check on mount
  useEffect(() => {
    checkSession();
  }, []);

  const value = {
    currentUser,
    role,
    setCurrentUser,
    setRole,
    checkSession,
    loading,
    error
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;