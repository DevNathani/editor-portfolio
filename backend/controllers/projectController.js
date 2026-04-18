import Project from '../models/Project.js';
import cloudinary from '../config/cloudinary.js';

// Helper to extract Cloudinary public_id
const getPublicIdFromUrl = (url) => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1].split('.')[0];
  const folder = parts[parts.length - 2];
  return `${folder}/${filename}`;
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('category');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('category');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = req.file.path;
    }
    const newProject = new Project(data);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) return res.status(404).json({ message: 'Project not found' });

    const data = { ...req.body };
    if (req.file) {
      data.image = req.file.path;
      // Delete old image from Cloudinary
      if (existingProject.image && existingProject.image.includes('cloudinary')) {
        const publicId = getPublicIdFromUrl(existingProject.image);
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) return res.status(404).json({ message: 'Project not found' });

    if (existingProject.image && existingProject.image.includes('cloudinary')) {
       const publicId = getPublicIdFromUrl(existingProject.image);
       await cloudinary.uploader.destroy(publicId);
    }
    await existingProject.deleteOne();
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
