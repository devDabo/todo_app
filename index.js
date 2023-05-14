const express = require('express');
const port = 4000;
const app = express();
const mongoose = require('mongoose');
const createtodo = require('./routes/user');
//middleware
app.use(express.json());
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://rajchand99:rajchand99@todo.1e9gpvt.mongodb.net/?retryWrites=true&w=majority/todo";

//pass query string and route params
app.all('/test', (req,res) => {
    // console.log(req.query);
    // res.send(req.query);

    //get
    // console.log(req.params);
    // res.send(req.params);

    console.log(req.body);
    res.send(req.body);

});

//post request 

app.use('/createtodo', createtodo)

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
    //     dbname: 'todo',
    //     user:'rajchand99',
    //     pass:'rajchand99'
    // });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



// mongoose.connect('mongodb+srv://rajchand99:rajchand99@todo.1e9gpvt.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});



app.listen(port, () => console.log('App listening on port 4000'))
