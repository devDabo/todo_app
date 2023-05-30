const express = require('express');
const port = 4000;
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const uri = "mongodb+srv://rajchand99:rajchand99@todo.1e9gpvt.mongodb.net/?retryWrites=true&w=majority/todo";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//schema will be added to separate js file later
const todoSchema = mongoose.Schema({
    todo: String
});

const Todo = mongoose.model('Todo',todoSchema)

app.post('/createtodo', async (req, res) => {
    try {
      // create new instance of todo
      const addTodo = new Todo({
        todo: "String3"
      });
  
      const doc = await addTodo.save();
      res.status(200).json(doc);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
app.listen(port, () => console.log('App listening on port 4000'))
