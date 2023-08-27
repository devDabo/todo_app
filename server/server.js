const express = require('express');
const port = 4000;
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const todoRouter = require('./routes/todo');
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const uri = process.env.MONGO_URL
const cors = require('cors');

app.use(bodyParser.json());

// Enable CORS for frontend
app.use(cors({
    origin: 'http://localhost:3000'
}));

//connect to mongodb
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//app routes
app.use('/api/todo', todoRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);


//start server
app.listen(port, () => console.log(`App listening on port ${port}`))
