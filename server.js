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

//schema

const todoSchema = mongoose.Schema({
    todo: String
});

const Todo = mongoose.model('Todo',todoSchema)

//create logic
app.post('/createtodo', (req,res) => {
    try {
            //create new instance of todo
    const addTodo = new Todo(req.body)

    addTodo.save((err,doc)=>{
        if(err) return console.log(err)
        console.log(doc)
    })

    } catch (err) {
        console.log(err);
    }


});

app.listen(port, () => console.log('App listening on port 4000'))
