
const Admin = require('../models/Admin.model');
const bcrypt = require('bcryptjs');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../config/jwt');

// Cookie configuration
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite:
    process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Admin Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (
      admin &&
      (await bcrypt.compare(password, admin.passwordHash))
    ) {
      const accessToken = generateAccessToken(
        admin._id,
        admin.username
      );

      const refreshToken = generateRefreshToken(admin._id);

      res.cookie('refreshToken', refreshToken, cookieOptions);

      res.json({
        accessToken,
        admin: {
          username: admin.username,
        },
      });
    } else {
      res.status(401).json({
        message: 'Invalid credentials',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Refresh Access Token
const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: 'Not authorized, no refresh token',
      });
    }

    const decoded = verifyRefreshToken(refreshToken);

    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        message: 'Not authorized, admin not found',
      });
    }

    const newAccessToken = generateAccessToken(
      admin._id,
      admin.username
    );

    const newRefreshToken = generateRefreshToken(admin._id);

    res.cookie('refreshToken', newRefreshToken, cookieOptions);

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(401).json({
      message: 'Not authorized, token failed',
    });
  }
};

// Admin Logout
const logout = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:
      process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  });

  res.status(200).json({
    message: 'Logged out',
  });
};

// Get Logged-in Admin
const getMe = async (req, res) => {
  res.json({
    username: req.admin.username,
  });
};

module.exports = {
  login,
  refresh,
  logout,
  getMe,
};
