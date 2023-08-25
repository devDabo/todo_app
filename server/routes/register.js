// routes/registerRouter.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Define your register routes
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input and create a new user
    const newUser = new User({
      email: email,
      password: password, // Remember to hash the password before saving it
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
