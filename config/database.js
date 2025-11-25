const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "educourse_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

// Test connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();

    // Create tables if not exist
    await createTables();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

const createTables = async () => {
  try {
    // Users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullname VARCHAR(255) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        verification_token VARCHAR(255),
        is_verified BOOLEAN DEFAULT FALSE,
        profile_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Courses table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
        price DECIMAL(10,2) DEFAULT 0,
        duration INT DEFAULT 0,
        instructor VARCHAR(255),
        rating DECIMAL(3,2) DEFAULT 0,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Tables created successfully");
  } catch (error) {
    console.error("❌ Table creation failed:", error.message);
  }
};

module.exports = {
  pool,
  testConnection,
};
