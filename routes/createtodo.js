const express = require('express');
const router = express.Router();
const Todo = require('../server/schema/schema');

router.post('/', async (req, res) => {
  try {
    // Create a new instance of Todo model
    const addTodo = new Todo({
      todo: "String4"
    });

    const doc = await addTodo.save();
    res.status(200).json({ status: "ok" });
    console.log({ status: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
