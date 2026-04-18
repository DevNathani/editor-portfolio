import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const AchievementContext = createContext();

export const AchievementProvider = ({ children }) => {
  const { api } = useUser();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/achievements');
      setAchievements(res.data);
    } catch (error) {
      console.error("Failed fetching achievements", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
    // eslint-disable-next-line
  }, [api]);

  const createAchievement = async (formData) => {
    const res = await api.post('/achievements', formData, {
      headers: { 'Content-Type': 'multipart/form-data' } // Supports Array of images
    });
    setAchievements([...achievements, res.data]);
    return res.data;
  };

  const updateAchievement = async (id, formData) => {
    const res = await api.put(`/achievements/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setAchievements(achievements.map(a => a._id === id ? res.data : a));
    return res.data;
  };

  const deleteAchievement = async (id) => {
    await api.delete(`/achievements/${id}`);
    setAchievements(achievements.filter(a => a._id !== id));
  };

  return (
    <AchievementContext.Provider value={{ achievements, loading, createAchievement, updateAchievement, deleteAchievement, refreshAchievements: fetchAchievements }}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => useContext(AchievementContext);
