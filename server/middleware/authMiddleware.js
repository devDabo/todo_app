const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from a .env file

const verifyToken = (req, res, next) => {
  const token = req.headers['x-auth-token'] || req.query.token;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { verifyToken };