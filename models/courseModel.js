const { pool } = require("../config/database");

const Course = {
  getAll: async (filters = {}) => {
    let sql = `
      SELECT 
        id, title, description, category, level, price, 
        duration, instructor, rating, image_url, created_at
      FROM courses 
      WHERE 1=1
    `;
    const params = [];

    // Filter by category
    if (filters.category) {
      sql += " AND category = ?";
      params.push(filters.category);
    }

    // Filter by level
    if (filters.level) {
      sql += " AND level = ?";
      params.push(filters.level);
    }

    // Filter by price range
    if (filters.minPrice) {
      sql += " AND price >= ?";
      params.push(parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      sql += " AND price <= ?";
      params.push(parseFloat(filters.maxPrice));
    }

    // Search by title, description, or instructor
    if (filters.search) {
      sql += " AND (title LIKE ? OR description LIKE ? OR instructor LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Sorting
    if (filters.sortBy) {
      const validSortColumns = [
        "title",
        "price",
        "created_at",
        "rating",
        "duration",
      ];
      const sortOrder =
        filters.sortOrder && filters.sortOrder.toUpperCase() === "DESC"
          ? "DESC"
          : "ASC";

      if (validSortColumns.includes(filters.sortBy)) {
        sql += ` ORDER BY ${filters.sortBy} ${sortOrder}`;
      }
    } else {
      // Default sorting
      sql += " ORDER BY created_at DESC";
    }

    // Pagination
    if (filters.limit) {
      sql += " LIMIT ?";
      params.push(parseInt(filters.limit));
    }

    if (filters.offset) {
      sql += " OFFSET ?";
      params.push(parseInt(filters.offset));
    }

    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  getById: async (courseId) => {
    const sql = "SELECT * FROM courses WHERE id = ?";
    const [rows] = await pool.execute(sql, [courseId]);
    return rows[0];
  },

  create: async (courseData) => {
    const sql = `
      INSERT INTO courses (title, description, category, level, price, duration, instructor, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      courseData.title,
      courseData.description,
      courseData.category,
      courseData.level,
      courseData.price,
      courseData.duration,
      courseData.instructor,
      courseData.image_url,
    ]);
    return result;
  },

  update: async (courseId, courseData) => {
    const sql = `
      UPDATE courses 
      SET title = ?, description = ?, category = ?, level = ?, price = ?, 
          duration = ?, instructor = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const [result] = await pool.execute(sql, [
      courseData.title,
      courseData.description,
      courseData.category,
      courseData.level,
      courseData.price,
      courseData.duration,
      courseData.instructor,
      courseData.image_url,
      courseId,
    ]);
    return result;
  },

  delete: async (courseId) => {
    const sql = "DELETE FROM courses WHERE id = ?";
    const [result] = await pool.execute(sql, [courseId]);
    return result;
  },

  getCategories: async () => {
    const sql =
      "SELECT DISTINCT category FROM courses WHERE category IS NOT NULL";
    const [rows] = await pool.execute(sql);
    return rows;
  },
};

module.exports = Course;
