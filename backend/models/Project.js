import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  image: {
    type: String,
    required: true // Cloudinary URL
  },
  description: {
    type: String,
    required: true // Markdown string
  },
  toolsUsed: [{
    type: String
  }],
  learned: {
    type: String,
    required: true // Markdown string
  },
  videoLink: {
    type: String // Optional Youtube/Vimeo embed URL
  }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
