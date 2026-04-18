import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const SkillsServicesContext = createContext();

export const SkillsServicesProvider = ({ children }) => {
  const { api } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/skills-services');
      setData(res.data);
    } catch (error) {
      console.error('Failed fetching skills/services', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [api]);

  const updateData = async (payload) => {
    const res = await api.put('/skills-services', payload);
    setData(res.data);
    return res.data;
  };

  return (
    <SkillsServicesContext.Provider value={{ data, loading, updateData, refresh: fetchData }}>
      {children}
    </SkillsServicesContext.Provider>
  );
};

export const useSkillsServices = () => useContext(SkillsServicesContext);
