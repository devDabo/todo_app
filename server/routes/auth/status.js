const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/status', (req, res) => {
  // Attempt to retrieve the token from the Authorization header
  let token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  
  // If no token found in Authorization header, try getting it from cookies
  token = token || req.cookies.accessToken;
  
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated: true });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
});

module.exports = router;