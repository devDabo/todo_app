const express = require('express');
const router = express.Router();
const Todo = require('../server/schema/schema');

router.delete('/:id', async (req, res) => {
  try {
    const todoId = req.params.id;

    // Find the Todo document by ID and delete the induvidual
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

module.exports = router;
