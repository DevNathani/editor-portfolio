import User from '../models/User.js';

// Legacy syncUser removed. Handled by authController now.

import jwt from 'jsonwebtoken';

// Protect Routes Middleware via Role checking
export const requireAdmin = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing authentication token" });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only';
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden: Administrator permissions required." });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server auth error: " + error.message });
  }
};
