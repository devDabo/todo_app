const request = require('supertest');
const express = require('express');
const router = require('../routes/register');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../schema/user');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../schema/user');

const app = express();
app.use(express.json());
app.use('/register', router);

describe('POST /register', () => {
  let mockUserSave;
  let mockUserFindOne;

  beforeEach(() => {
    mockUserSave = jest.fn();
    mockUserFindOne = jest.fn();

    User.mockImplementation(() => ({
      save: mockUserSave,
    }));

    User.findOne = mockUserFindOne;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if user already exists', async () => {
    mockUserFindOne.mockResolvedValue({ email: 'test@example.com' });

    const res = await request(app)
      .post('/register')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'User already exists' });
  });

  it('should return 201 if user is created successfully', async () => {
    mockUserFindOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword');
    mockUserSave.mockResolvedValue({});

    const res = await request(app)
      .post('/register')
      .send({ email: 'newuser@example.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'User registered successfully' });
  });

  it('should return 500 if an error occurs during user creation', async () => {
    mockUserFindOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword');
    mockUserSave.mockRejectedValue(new Error('Save error'));

    const res = await request(app)
      .post('/register')
      .send({ email: 'newuser@example.com', password: 'password123' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'An error occurred' });
  });
});