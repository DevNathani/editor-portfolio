import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_for_development_only', {
    expiresIn: '30d',
  });
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Role defaults to 'admin' per user request in User model
    const user = await User.create({
      username,
      email,
      password,
      otp,
      otpExpires
    });

    if (user) {
      // Send OTP via Resend
      const { CONTACT_TO_EMAIL } = process.env;
      
      // If we are testing locally without verified domains, we might only be able to send TO the verified email.
      // But we'll try to send it to the registered email. 
      // Note: Resend Free tier only allows sending to the verified email address.
      const toEmail = process.env.NODE_ENV === 'production' ? email : (CONTACT_TO_EMAIL || email);

      try {
        await resend.emails.send({
          from: 'Portfolio Security <onboarding@resend.dev>', 
          to: toEmail,
          subject: 'Your Portfolio Verification Code',
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>Welcome to the Portfolio CMS, ${username}!</h2>
              <p>Your 6-digit verification code is:</p>
              <h1 style="color: #06b6d4; font-size: 32px; letter-spacing: 4px;">${otp}</h1>
              <p>This code expires in 15 minutes.</p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error('Failed to send OTP email:', emailErr);
        // Continue anyway in development, they can check server logs or mongo
        console.log(`[DEV MODE] OTP for ${email} is ${otp}`);
      }

      res.status(201).json({
        message: 'User registered. Please check email for OTP.',
        userId: user._id,
        email: user.email
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(403).json({ message: 'Please verify your email first', isVerified: false });
      }

      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
