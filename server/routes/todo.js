const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Todo = require('../schema/schema');

// Get the current user's ID from the JWT token
const getCurrentUserId = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId; 
  } catch (err) {
    console.error(err);
    return null;
  }
};

router.post('/', async (req, res) => {
  try {
    const { todo, complete } = req.body;

    const addTodo = new Todo({
      todo: todo,
      complete: complete || false,
      user: req.userId,
    });

    const doc = await addTodo.save();
    res.status(200).json({ status: 'Todo added successfully', todo: doc });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = getCurrentUserId(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const deletedTodo = await Todo.findOneAndDelete({ _id: todoId, user: userId });

    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found or not yours' });
    }

    res.status(200).json({ status: 'Todo deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/', async (req, res) => {
  try {
const userId = req.user._id; // Adjust according to how user information is stored in req.user

const todos = await Todo.find({ user: userId });
res.json(todos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const todoId = req.params.id;
    const { todo, complete } = req.body;
    const userId = getCurrentUserId(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updatedFields = {
      todo: todo,
      complete: complete || false,
    };

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, user: userId },
      updatedFields,
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found or not yours' });
    }

    res.status(200).json({ status: 'Todo updated successfully', todo: updatedTodo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
