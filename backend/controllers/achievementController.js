import Achievement from '../models/Achievement.js';
import cloudinary from '../config/cloudinary.js';

// Helper to extract Cloudinary public_id
const getPublicIdFromUrl = (url) => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1].split('.')[0];
  const folder = parts[parts.length - 2];
  return `${folder}/${filename}`;
};

export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ year: -1 });
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAchievement = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files && req.files.length > 0) {
      data.images = req.files.map(file => file.path);
    }
    const newAchievement = new Achievement(data);
    const savedAchievement = await newAchievement.save();
    res.status(201).json(savedAchievement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAchievement = async (req, res) => {
  try {
    const existingAchievement = await Achievement.findById(req.params.id);
    if (!existingAchievement) return res.status(404).json({ message: 'Achievement not found' });

    const data = { ...req.body };
    
    if (req.files && req.files.length > 0) {
      const newImagesUrls = req.files.map(file => file.path);
      // Replacing entirely
      if (existingAchievement.images && existingAchievement.images.length > 0) {
         for (const existingUrl of existingAchievement.images) {
            if (existingUrl.includes('cloudinary')) {
              await cloudinary.uploader.destroy(getPublicIdFromUrl(existingUrl));
            }
         }
      }
      data.images = newImagesUrls;
    }

    const updatedAchievement = await Achievement.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json(updatedAchievement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAchievement = async (req, res) => {
  try {
    const existingAchievement = await Achievement.findById(req.params.id);
    if (!existingAchievement) return res.status(404).json({ message: 'Achievement not found' });

    if (existingAchievement.images && existingAchievement.images.length > 0) {
       for (const existingUrl of existingAchievement.images) {
          if (existingUrl.includes('cloudinary')) {
            await cloudinary.uploader.destroy(getPublicIdFromUrl(existingUrl));
          }
       }
    }
    await existingAchievement.deleteOne();
    
    res.status(200).json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
