const express = require('express');
const router = express.Router();
const Todo = require('../server/schema/schema');

router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
        console.log(todos);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;
