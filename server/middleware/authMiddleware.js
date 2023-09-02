const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from a .env file

// Middleware function to verify JWT tokens
const verifyToken = (req, res, next) => {
  // Get the token from the request headers or query parameters
  const token = req.headers['x-auth-token'] || req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify the token using your secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.user = decoded; // Store user information in the request object
    next();
  });
};

module.exports = { verifyToken };