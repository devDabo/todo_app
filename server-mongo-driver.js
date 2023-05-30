const express = require('express');
const port = 4000;
const app = express();
const mongoose = require('mongoose');
const user = require('./routes/user');
//middleware, so we can parse queries in terminal
app.use(express.json());
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://rajchand99:rajchand99@todo.1e9gpvt.mongodb.net/?retryWrites=true&w=majority/todo";


//create Schema for todo
const todoSchema = mongoose.Schema({
  todo: String
});

//add todo model
const Todo = mongoose.model('Todo', todoSchema)

//use postman to send JSON using sendtodo route
app.post('/sendtodo', (req, res) => {
  const addTodo = new Todo(req.body);

  save((err,doc)=>{
    if(err) return console.log(err)
    console.log(doc)
  })
})




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => console.log('App listening on port 4000'))
