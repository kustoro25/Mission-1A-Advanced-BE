const express = require("express");
const router = express.Router();

// Controllers
const authController = require("../controllers/authController");
const courseController = require("../controllers/courseController");
const uploadController = require("../controllers/uploadController");

// Middleware
const authMiddleware = require("../middleware/authMiddleware");
const {
  uploadImage,
  handleUploadError,
} = require("../middleware/uploadMiddleware");

// Auth Routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/verify-email", authController.verifyEmail);
router.get(
  "/auth/profile",
  authMiddleware.verifyToken,
  authController.getProfile
);

// Course Routes
router.get("/courses", courseController.getCourses);
router.get("/courses/categories", courseController.getCategories);
router.get("/courses/:id", courseController.getCourseById);

// Protected Course Routes (require authentication)
router.post(
  "/courses",
  authMiddleware.verifyToken,
  uploadImage.single("image"),
  courseController.createCourse
);
router.put(
  "/courses/:id",
  authMiddleware.verifyToken,
  uploadImage.single("image"),
  courseController.updateCourse
);
router.delete(
  "/courses/:id",
  authMiddleware.verifyToken,
  courseController.deleteCourse
);

// Upload Routes
router.post(
  "/upload",
  authMiddleware.verifyToken,
  uploadImage.single("file"),
  uploadController.uploadImage
);
router.post(
  "/upload/profile",
  authMiddleware.verifyToken,
  uploadImage.single("image"),
  uploadController.uploadProfileImage
);

// Health check route
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "EduCourse API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Handle upload errors
router.use(handleUploadError);

module.exports = router;
