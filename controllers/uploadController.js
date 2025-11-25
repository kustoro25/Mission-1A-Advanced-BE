const User = require("../models/userModel");

const uploadController = {
  uploadImage: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // Construct file URL
      const fileUrl = `/uploads/${req.file.filename}`;

      res.json({
        success: true,
        message: "File uploaded successfully",
        data: {
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          url: fileUrl,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "File upload failed",
      });
    }
  },

  uploadProfileImage: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const userId = req.user.userId;
      const fileUrl = `/uploads/${req.file.filename}`;

      // Update user profile image
      await User.updateProfileImage(userId, fileUrl);

      res.json({
        success: true,
        message: "Profile image updated successfully",
        data: {
          url: fileUrl,
        },
      });
    } catch (error) {
      console.error("Profile upload error:", error);
      res.status(500).json({
        success: false,
        message: "Profile image upload failed",
      });
    }
  },
};

module.exports = uploadController;
