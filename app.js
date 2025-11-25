const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { testConnection } = require("./config/database");
const routes = require("./routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", routes);

// Database connection
testConnection();

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
🚀 EduCourse Server is running!
📍 Port: ${PORT}
🌐 Environment: ${process.env.NODE_ENV || "development"}
📧 Email Service: ${process.env.EMAIL_USER ? "Configured" : "Not configured"}
📊 Database: Connected
🔗 API Base URL: http://localhost:${PORT}/api
  `);
});

module.exports = app;
