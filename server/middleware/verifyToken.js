const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

// Protected route that requires authentication
router.get('/protected', verifyToken, (req, res) => {
  // Access user information from req.user
  const { username } = req.user;
  res.json({ message: `Hello, ${username}! This is a protected route.` });
});

module.exports = router;
