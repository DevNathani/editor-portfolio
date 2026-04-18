import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String // Cloudinary URLs
  }]
}, { timestamps: true });

export default mongoose.model('Achievement', achievementSchema);
