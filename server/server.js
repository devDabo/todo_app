const express = require('express');
const port = 4000;
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const createtodoRouter = require('../routes/createtodo');
const uri = process.env.MONGO_URL

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use('/createtodo', createtodoRouter);
  
app.listen(port, () => console.log('App listening on port 4000'))
