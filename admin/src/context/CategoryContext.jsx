import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const { api } = useUser();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error("Failed fetching categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, [api]);

  const createCategory = async (data) => {
    const res = await api.post('/categories', data);
    setCategories([...categories, res.data]);
    return res.data;
  };

  const updateCategory = async (id, data) => {
    const res = await api.put(`/categories/${id}`, data);
    setCategories(categories.map(c => c._id === id ? res.data : c));
    return res.data;
  };

  const deleteCategory = async (id) => {
    await api.delete(`/categories/${id}`);
    setCategories(categories.filter(c => c._id !== id));
  };

  return (
    <CategoryContext.Provider value={{ categories, loading, createCategory, updateCategory, deleteCategory, refreshCategories: fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => useContext(CategoryContext);
