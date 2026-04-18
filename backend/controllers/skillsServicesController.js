import SkillsServices from '../models/SkillsServices.js';

const DEFAULTS = {
  skills: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Final Cut', 'Photoshop', 'Illustrator', 'Figma', 'Cinema 4D', 'Blender'],
  services: [
    { iconName: 'Film', title: 'Video Editing', desc: 'Cinematic cuts, color grading, and audio syncing for YouTube, commercials, and short films.', order: 0 },
    { iconName: 'Layers', title: 'Motion Graphics', desc: 'Dynamic text animations, lower thirds, and impactful intros built in After Effects.', order: 1 },
    { iconName: 'PenTool', title: 'Brand Identity', desc: 'Logo design, typography sets, and modern brand guidelines crafted for the digital era.', order: 2 },
    { iconName: 'MonitorPlay', title: 'Web Graphics', desc: 'High-converting thumbnails, social media kits, and UI marketing assets.', order: 3 },
  ],
};

export const getSkillsServices = async (req, res) => {
  try {
    let data = await SkillsServices.findOne();
    if (!data) {
      data = await SkillsServices.create(DEFAULTS);
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSkillsServices = async (req, res) => {
  try {
    let data = await SkillsServices.findOne();
    if (!data) {
      data = await SkillsServices.create(DEFAULTS);
    }

    const payload = { ...req.body };

    // If skills sent as comma-separated string from a form input
    if (payload.skills && typeof payload.skills === 'string') {
      payload.skills = payload.skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    // If services sent as JSON string (from FormData)
    if (payload.services && typeof payload.services === 'string') {
      payload.services = JSON.parse(payload.services);
    }

    const updated = await SkillsServices.findByIdAndUpdate(data._id, payload, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
