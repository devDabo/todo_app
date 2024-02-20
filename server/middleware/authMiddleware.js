const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from a .env file
const User = require('../schema/user');

const verifyToken = (req, res, next) => {
  const token = req.signedCookies.accessToken; // Using signedCookies to get the accessToken
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch the user from the database using the decoded userId
    User.findById(decoded.userId).then(user => {
      if (!user) {
        // If no user is found in the database with the ID from the token
        return res.status(404).json({ message: 'User not found' });
      }
      req.user = user; // Attach the full user object to the request
      next(); // Proceed to the next middleware or request handler
    }).catch(err => {
      // Handle possible errors from the database query
      console.error('Database query failed:', err);
      res.status(500).json({ message: 'Internal server error due to database query failure' });
    });
  } catch (err) {
    // Handle errors from token verification (e.g., token is expired or invalid)
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { verifyToken };