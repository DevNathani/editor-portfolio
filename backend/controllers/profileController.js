import Profile from '../models/Profile.js';
import cloudinary from '../config/cloudinary.js';

const getPublicIdFromUrl = (url) => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1].split('.')[0];
  const folder = parts[parts.length - 2];
  return `${folder}/${filename}`;
};

// Always returns a single profile document (creates one if none exists)
export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the single profile record
export const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }

    const data = { ...req.body };

    // Handle taglines: sent as comma-separated string from form
    if (data.taglines && typeof data.taglines === 'string') {
      data.taglines = data.taglines.split(',').map(t => t.trim()).filter(Boolean);
    }

    // Handle hero image upload
    if (req.file) {
      // Delete old image from Cloudinary
      if (profile.heroImage && profile.heroImage.includes('cloudinary')) {
        const publicId = getPublicIdFromUrl(profile.heroImage);
        await cloudinary.uploader.destroy(publicId);
      }
      data.heroImage = req.file.path;
    }

    const updatedProfile = await Profile.findByIdAndUpdate(profile._id, data, { new: true });
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
