const express = require('express');
const router = express.Router();
const Todo = require('../schema/schema');
const { verifyToken } = require('../middleware/authMiddleware'); // Import the JWT verification middleware

router.post('/', verifyToken, async (req, res) => {
  try {
    const { todo, complete } = req.body;
    const userId = req.user.userId; // Get the user ID from the token

    const addTodo = new Todo({
      todo: todo,
      complete: complete || false,
      user: userId, // Associate the todo with the user
    });

    const doc = await addTodo.save();
    res.status(200).json({ status: 'Todo added successfully' });
    console.log(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.userId; // Get the user ID from the token

    console.log(todoId);

    // Delete the todo only if it belongs to the authenticated user
    const deletedTodo = await Todo.findOneAndDelete({ _id: todoId, user: userId });

    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json({ status: 'Todo deleted successfully' });
    console.log('Deleted todo:', deletedTodo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Get the user ID from the token

    const todos = await Todo.find({ user: userId }); // Fetch todos that belong to the authenticated user
    res.json(todos);
    console.log(todos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.userId; // Get the user ID from the token
    const { todo, complete } = req.body;

    const updatedFields = {
      todo: todo,
      complete: complete || false,
    };

    // Update the todo only if it belongs to the authenticated user
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, user: userId },
      updatedFields,
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json({ status: 'Todo updated successfully' });
    console.log('Updated todo:', updatedTodo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Handle 403 Forbidden error
router.use((req, res) => {
  res.status(403).json({ error: 'Forbidden' });
});

module.exports = router;
