const express = require('express');
const router = express.Router();
const Todo = require('../server/schema/schema');

router.post('/', async (req, res) => {
  try {
    // Create a new instance of Todo model
    const addTodo = new Todo({
      todo: req.body.todo
    }
);

    const doc = await addTodo.save();
    res.status(200).json({ status: "post to mongo ok" });
    console.log(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
