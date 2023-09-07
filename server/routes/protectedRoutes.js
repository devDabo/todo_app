const express = require('express');
const router = express.Router();

// Protected route that requires authentication
router.get('/', (req, res) => {
  // Access user information from req.user
  const { username } = req.user;
  res.json({ message: `Hello, ${username}! This is a protected route.` });
});

module.exports = router;
