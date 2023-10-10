const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// All routes in this router are protected by the JWT middleware
router.use(authenticateToken);

// Example protected route
router.get('/', (req, res) => {
    // req.user contains the payload from the decoded token
    const { email } = req.user;

    res.status(200).json({
        message: `Hello, ${email}! This is a protected route.`,
    });
});

module.exports = router;
