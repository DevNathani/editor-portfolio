import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Alex' },
  taglines: { type: [String], default: ['Video Editor.', 'Graphic Designer.', 'Visual Storyteller.', 'Motion Artist.'] },
  about: { type: String, default: 'I help modern creators and visionary brands build high-end visual identities, cinematic cuts, and dynamic motion graphics. Let my work speak for itself.' },
  heroImage: { type: String, default: '' },
  instagramUrl: { type: String, default: 'https://instagram.com' },
  youtubeUrl: { type: String, default: 'https://youtube.com' },
  availableForFreelance: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
