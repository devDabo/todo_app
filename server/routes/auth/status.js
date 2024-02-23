const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/status', (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ authenticated: false });

    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated: true });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
});

module.exports = router;