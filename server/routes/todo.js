const express = require('express');
const jwt = require('jsonwebtoken'); 
const Todo = require('../schema/schema'); // Ensure your schema file path is correct
require('dotenv').config();
const router = express.Router();

// JWT Token Verification Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['x-auth-token'] || req.query.token;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.user = decoded;
    next();
  });
};

// POST: Add a new TODO item
router.post('/', verifyToken, async (req, res) => {
  try {
    const { todo, complete } = req.body;
    const userId = req.user.userId;
    const addTodo = new Todo({
      todo,
      complete: complete || false,
      user: userId,
    });
    await addTodo.save();
    res.status(200).json({ status: 'Todo added successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while adding the Todo' });
  }
});

// DELETE: Remove a TODO item
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.userId;
    const deletedTodo = await Todo.findOneAndDelete({ _id: todoId, user: userId });

    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json({ status: 'Todo deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while deleting the Todo' });
  }
});

// GET: Retrieve all TODO items for the authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const todos = await Todo.find({ user: userId });
    res.status(200).json(todos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while fetching the Todos' });
  }
});

// PUT: Update a specific TODO item
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.userId;
    const { todo, complete } = req.body;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, user: userId },
      { todo, complete: complete || false },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json({ status: 'Todo updated successfully', data: updatedTodo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while updating the Todo' });
  }
});

// Handling Unauthorized Access
router.use((req, res) => {
  res.status(403).json({ error: 'Forbidden' });
});

module.exports = router;
