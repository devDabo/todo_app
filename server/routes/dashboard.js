const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../schema/user');

// Apply JWT middleware for all routes in this router
router.use(authenticateToken);

router.get('/:userId', async (req, res) => {
    try {
        // Extract user ID from route parameters
        const { userId } = req.params;

        // Check whether the userId from the token matches the userId in the URL
        if (req.user.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Fetch user-specific data from database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Construct dashboard data. This might involve fetching additional data based on user preferences, roles, etc.
        const dashboardData = {
            email: user.email,
            // ... other user-specific data to be displayed on the dashboard
        };

        // Send dashboard data to the client
        res.status(200).json(dashboardData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching dashboard data' });
    }
});

module.exports = router;
