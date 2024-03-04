const express = require('express');
const port = 4000;
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const todoRouter = require('./routes/todo');
const registerRouter = require('./routes/register')
const loginRoute = require('./routes/auth/login')
const logoutRoute = require('./routes/auth/logout')
const statusRoute = require('./routes/auth/status')
const uri = process.env.MONGO_URL
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');

app.use(bodyParser.json());

app.use(cookieParser("wL2daqY4vK3fAYf3LLpaxgtqT9EAXYZ"));

// Enable CORS for frontend
app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true,
}));

//connect to mongodb
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//app routes
app.use('/api/todo', authMiddleware.verifyToken, todoRouter);
app.use('/register', registerRouter);
app.use('/login', loginRoute);
app.use('/api/auth', logoutRoute);
app.use('/api/auth', statusRoute);
app.use(cookieParser());

//start server
app.listen(port, () => console.log(`App listening on port ${port}`))
