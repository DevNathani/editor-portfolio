import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';

import crypto from 'crypto';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_for_development_only', {
    expiresIn: '30d',
  });
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Request Access (replaces register)
export const requestAccess = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const approvalToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      username,
      email,
      password,
      status: 'pending',
      approvalToken
    });

    if (user) {
      // Send approval email to Super Admin
      const adminEmail = process.env.CONTACT_TO_EMAIL;
      const adminUrl = process.env.ADMIN_URL || 'http://localhost:5174';
      const approvalLink = `${adminUrl}/api/auth/approve/${approvalToken}`; // We'll handle this on backend or frontend

      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || '"Portfolio Admin" <no-reply@portfolio.com>',
          to: adminEmail,
          subject: 'New Admin Access Request',
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>New Access Request</h2>
              <p>User <strong>${username}</strong> (${email}) has requested admin access.</p>
              <p>Click the link below to approve them:</p>
              <a href="${process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace('5173', '5000') : 'http://localhost:5000'}/api/auth/approve/${approvalToken}" style="padding: 10px 20px; background: #06b6d4; color: black; text-decoration: none; border-radius: 5px;">Approve User</a>
            </div>
          `
        });
      } catch (err) {
        console.error('Failed to send approval email:', err);
      }

      res.status(201).json({ message: 'Access requested. Waiting for Super Admin approval.' });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve User (GET request clicked from email)
export const approveUser = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ approvalToken: token });

    if (!user) {
      return res.status(400).send('<h1>Invalid or expired approval token</h1>');
    }

    user.status = 'approved';
    user.approvalToken = undefined;
    user.isVerified = true; // Auto-verify upon approval
    await user.save();

    res.status(200).send('<h1>User Approved Successfully! They can now log in.</h1>');
  } catch (error) {
    res.status(500).send('<h1>Server Error</h1>');
  }
};

// Login (Step 1: Check Password, Send OTP)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.status !== 'approved') {
        return res.status(403).json({ message: 'Account pending Super Admin approval.' });
      }

      // Generate OTP for 2FA
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
      await user.save();

      // Send OTP
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || '"Portfolio Admin" <no-reply@portfolio.com>',
          to: user.email,
          subject: 'Your Login Verification Code',
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>Login Verification</h2>
              <p>Your 6-digit login code is:</p>
              <h1 style="color: #06b6d4; font-size: 32px; letter-spacing: 4px;">${otp}</h1>
              <p>This code expires in 10 minutes.</p>
            </div>
          `
        });
      } catch (err) {
        console.error('Failed to send login OTP email:', err);
      }

      res.status(200).json({ message: 'OTP sent to email', pending_otp: true });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Login OTP (Step 2)
export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.status !== 'approved') return res.status(403).json({ message: 'Account pending approval' });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

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

// Forgot Password (Request OTP)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.status !== 'approved') return res.status(403).json({ message: 'Account pending approval' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Portfolio Admin" <no-reply@portfolio.com>',
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Password Reset</h2>
            <p>Your 6-digit reset code is:</p>
            <h1 style="color: #06b6d4; font-size: 32px; letter-spacing: 4px;">${otp}</h1>
            <p>This code expires in 15 minutes.</p>
          </div>
        `
      });
    } catch (err) {
      console.error('Failed to send reset OTP email:', err);
    }

    res.status(200).json({ message: 'Password reset OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
