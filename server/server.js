const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cors = require('cors');

// Import routers and middleware
const todoRouter = require('./routes/todo');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const dashboardRouter = require('./routes/dashboard');
const protectedRouter = require('./routes/protectedRoute');
const authenticateToken = require('./middleware/authenticateToken');

const app = express();
const port = 4000;

app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000' // update this to your frontend application's URL
}));

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Could not connect to MongoDB:', error));

app.use('/api/todo', todoRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/dashboard', authenticateToken, dashboardRouter);
app.use('/protected', authenticateToken, protectedRouter);

app.listen(port, () => console.log(`App listening on port ${port}`));
