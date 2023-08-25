const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../schema/user');

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    // Create a new user
    const newUser = new User({
      email: email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
