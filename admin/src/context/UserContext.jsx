import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { useAuth, useUser as useClerkUser } from '@clerk/clerk-react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useClerkUser();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL
    });

    instance.interceptors.request.use(async (config) => {
      if (isSignedIn && userId) {
        config.headers['clerk-user-id'] = userId;
      }
      return config;
    });

    return instance;
  }, [isSignedIn, userId]);

  // Sync user to MongoDB on first login so requireAdmin can find them
  useEffect(() => {
    if (isSignedIn && userId && user) {
      const email = user.primaryEmailAddress?.emailAddress;
      api.post('/users/sync', { clerkUserId: userId, email })
        .catch(err => console.error('User sync failed:', err));
    }
  }, [isSignedIn, userId, user, api]);

  return (
    <UserContext.Provider value={{ api, isLoaded, isSignedIn, userId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
