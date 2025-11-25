const Course = require("../models/courseModel");

const courseController = {
  getCourses: async (req, res) => {
    try {
      const {
        category,
        level,
        search,
        minPrice,
        maxPrice,
        sortBy = "created_at",
        sortOrder = "DESC",
        limit = 10,
        offset = 0,
      } = req.query;

      const filters = {
        category,
        level,
        search,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
        limit: parseInt(limit),
        offset: parseInt(offset),
      };

      const courses = await Course.getAll(filters);

      res.json({
        success: true,
        data: courses,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: courses.length,
        },
      });
    } catch (error) {
      console.error("Get courses error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  getCourseById: async (req, res) => {
    try {
      const { id } = req.params;

      const course = await Course.getById(id);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      res.json({
        success: true,
        data: course,
      });
    } catch (error) {
      console.error("Get course error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  createCourse: async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        level,
        price,
        duration,
        instructor,
      } = req.body;

      // Validasi input
      if (!title || !description || !category) {
        return res.status(400).json({
          success: false,
          message: "Title, description, and category are required",
        });
      }

      const courseData = {
        title,
        description,
        category,
        level: level || "beginner",
        price: price ? parseFloat(price) : 0,
        duration: duration ? parseInt(duration) : 0,
        instructor: instructor || "Unknown Instructor",
        image_url: req.file ? `/uploads/${req.file.filename}` : null,
      };

      const result = await Course.create(courseData);

      res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: {
          id: result.insertId,
          ...courseData,
        },
      });
    } catch (error) {
      console.error("Create course error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  updateCourse: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Cek jika course exists
      const existingCourse = await Course.getById(id);
      if (!existingCourse) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      // Jika ada file upload, tambahkan image_url
      if (req.file) {
        updateData.image_url = `/uploads/${req.file.filename}`;
      }

      await Course.update(id, updateData);

      res.json({
        success: true,
        message: "Course updated successfully",
      });
    } catch (error) {
      console.error("Update course error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  deleteCourse: async (req, res) => {
    try {
      const { id } = req.params;

      // Cek jika course exists
      const existingCourse = await Course.getById(id);
      if (!existingCourse) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      await Course.delete(id);

      res.json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error) {
      console.error("Delete course error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  getCategories: async (req, res) => {
    try {
      const categories = await Course.getCategories();

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};

module.exports = courseController;
