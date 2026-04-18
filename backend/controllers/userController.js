import User from '../models/User.js';

// Get or Create user on login
export const syncUser = async (req, res) => {
  try {
    const { clerkUserId, email } = req.body;
    
    let user = await User.findOne({ clerkUserId });
    
    if (!user) {
      user = new User({ clerkUserId, email, role: 'admin' });
      await user.save();
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Protect Routes Middleware via Role checking
export const requireAdmin = async (req, res, next) => {
  try {
    // In production, you would parse the Bearer token using Clerk SDK here. 
    // For quick start, we'll check a custom header 'Clerk-User-Id' that the frontend sets during API calls.
    const clerkUserId = req.headers['clerk-user-id']; 
    if (!clerkUserId) return res.status(401).json({ message: "Unauthorized: Missing identity header" });

    const user = await User.findOne({ clerkUserId });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Administrator permissions required to upload/modify." });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
