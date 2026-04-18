import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { api } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/profile');
      setProfile(res.data);
    } catch (error) {
      console.error('Failed fetching profile', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [api]);

  const updateProfile = async (formData) => {
    const res = await api.put('/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setProfile(res.data);
    return res.data;
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, updateProfile, refreshProfile: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
