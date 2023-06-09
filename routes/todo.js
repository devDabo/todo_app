const express = require('express');
const router = express.Router();
const Todo = require('../server/schema/schema');

router.post('/', async (req, res) => {
  try {
    const addTodo = new Todo({
      todo: req.body.todo
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

//list all of the objects in the database
router.get('/:todoId', async (req, res) => {
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
