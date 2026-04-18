import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  iconName: { type: String, default: 'Film' }, // Lucide icon name string
  title: { type: String, required: true },
  desc: { type: String, required: true },
  order: { type: Number, default: 0 },
});

const skillsServicesSchema = new mongoose.Schema({
  skills: { type: [String], default: [] },
  services: { type: [serviceSchema], default: [] },
}, { timestamps: true });

export default mongoose.model('SkillsServices', skillsServicesSchema);
