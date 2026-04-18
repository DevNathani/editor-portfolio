import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { api } = useUser();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error("Failed fetching projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [api]);

  const createProject = async (formData) => {
    const res = await api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setProjects([...projects, res.data]);
    return res.data;
  };

  const updateProject = async (id, formData) => {
    const res = await api.put(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setProjects(projects.map(p => p._id === id ? res.data : p));
    return res.data;
  };

  const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`);
    setProjects(projects.filter(p => p._id !== id));
  };

  return (
    <ProjectContext.Provider value={{ projects, loading, createProject, updateProject, deleteProject, refreshProjects: fetchProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);
