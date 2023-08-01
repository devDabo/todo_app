const express = require('express');
const router = express.Router();
const Todo = require('../schema/schema');

router.post('/', async (req, res) => {
  try {
    const { todo, complete } = req.body;
    const addTodo = new Todo({
      todo: todo,
      complete: complete || false, // Set the complete field to false by default if not provided in the request
    });

    const doc = await addTodo.save();
    res.status(200).json({ status: 'Todo added successfully' });
    console.log(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const todoId = req.params.id;
    console.log(todoId);

    const deletedTodo = await Todo.findByIdAndDelete(todoId);

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

router.put('/:id', async (req, res) => {
  try {
    const todoId = req.params.id;
    const { todo, complete } = req.body;

    const updatedFields = {
      todo: todo,
      complete: complete || false, // Set the complete field to false by default if not provided in the request
    };

    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
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

module.exports = router;
