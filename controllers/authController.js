const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const emailService = require("../services/emailService");

const authController = {
  register: async (req, res) => {
    try {
      const { fullname, username, password, email } = req.body;

      // Validasi input
      if (!fullname || !username || !password || !email) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      // Validasi email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      // Validasi password
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }

      // Cek jika user sudah ada
      const existingEmail = await User.findByEmail(email);
      if (existingEmail.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }

      const existingUsername = await User.findByUsername(username);
      if (existingUsername.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Generate verification token
      const verificationToken = uuidv4();

      // Simpan user ke database
      const userData = {
        fullname,
        username,
        password: hashedPassword,
        email,
        verification_token: verificationToken,
      };

      const result = await User.create(userData);

      // Kirim email verifikasi
      await emailService.sendVerificationEmail(email, verificationToken);

      res.status(201).json({
        success: true,
        message:
          "Registration successful. Please check your email for verification.",
        data: {
          id: result.insertId,
          fullname,
          username,
          email,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validasi input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Cari user berdasarkan email
      const users = await User.findByEmail(email);
      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const user = users[0];

      // Verifikasi password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Cek verifikasi email
      if (!user.is_verified) {
        return res.status(401).json({
          success: false,
          message: "Please verify your email first",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
      );

      res.json({
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            profile_image: user.profile_image,
          },
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Verification token is required",
        });
      }

      // Cari user berdasarkan token
      const users = await User.findByToken(token);
      if (users.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid verification token",
        });
      }

      const user = users[0];

      // Verifikasi user
      await User.verifyUser(user.id);

      res.json({
        success: true,
        message:
          "Email verified successfully. You can now login to your account.",
      });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};

module.exports = authController;
