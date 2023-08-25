// routes/loginRouter.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Define your login routes
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if the user exists
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Validate the password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
