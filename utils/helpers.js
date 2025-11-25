const helpers = {
  // Format response consistency
  formatResponse: (success, message, data = null) => {
    return {
      success,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  },

  // Pagination helper
  getPagination: (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    return { limit: parseInt(limit), offset: parseInt(offset) };
  },

  // Generate random string
  generateRandomString: (length = 10) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Validate email
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Sanitize input
  sanitizeInput: (input) => {
    if (typeof input !== "string") return input;
    return input.trim().replace(/[<>]/g, "");
  },
};

module.exports = helpers;
