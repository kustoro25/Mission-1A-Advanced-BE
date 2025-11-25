const { pool } = require("../config/database");

const User = {
  create: async (userData) => {
    const sql = `
      INSERT INTO users (fullname, username, password, email, verification_token) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      userData.fullname,
      userData.username,
      userData.password,
      userData.email,
      userData.verification_token,
    ]);
    return result;
  },

  findByEmail: async (email) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await pool.execute(sql, [email]);
    return rows;
  },

  findByUsername: async (username) => {
    const sql = "SELECT * FROM users WHERE username = ?";
    const [rows] = await pool.execute(sql, [username]);
    return rows;
  },

  findByToken: async (token) => {
    const sql = "SELECT * FROM users WHERE verification_token = ?";
    const [rows] = await pool.execute(sql, [token]);
    return rows;
  },

  verifyUser: async (userId) => {
    const sql =
      "UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = ?";
    const [result] = await pool.execute(sql, [userId]);
    return result;
  },

  updateProfileImage: async (userId, imagePath) => {
    const sql = "UPDATE users SET profile_image = ? WHERE id = ?";
    const [result] = await pool.execute(sql, [imagePath, userId]);
    return result;
  },

  findById: async (userId) => {
    const sql =
      "SELECT id, fullname, username, email, profile_image, created_at FROM users WHERE id = ?";
    const [rows] = await pool.execute(sql, [userId]);
    return rows[0];
  },
};

module.exports = User;
