const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../schema/user');
const loginRoute = require('../routes/auth/login');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../schema/user.js');

const app = express();
app.use(express.json());
app.use('/login', loginRoute);

describe('POST /login', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if email is not found', async () => {
    User.findOne.mockResolvedValue(null);

    await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({ message: 'Invalid email or password' });
      });
  });

  it('should return 401 if password is invalid', async () => {
    const mockUser = { email: 'test@example.com', password: 'hashedPassword' };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({ message: 'Invalid email or password' });
      });
  });

  it('should return 200 and set a cookie if login is successful', async () => {
    const mockUser = { _id: 'userId', email: 'test@example.com', password: 'hashedPassword' };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token');

    await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(200)
      .expect('set-cookie', /accessToken=token/)
      .expect(res => {
        expect(res.body).toEqual({ message: 'Login successful' });
      });
  });

  it('should return 500 if an error occurs', async () => {
    User.findOne.mockRejectedValue(new Error('Database error'));

    await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(500)
      .expect(res => {
        expect(res.body).toEqual({ error: 'An error occurred' });
      });
  });
});