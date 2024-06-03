// authMiddleware.test.js
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../schema/user');

jest.mock('jsonwebtoken');
jest.mock('../schema/user');

describe('verifyToken middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no token is provided', () => {
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
  });

  it('should return 401 if token is invalid', () => {
    req.cookies.accessToken = 'invalidToken';
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
  });

  it('should return 404 if user is not found', async () => {
    const decoded = { userId: '123' };
    req.cookies.accessToken = 'validToken';
    jwt.verify.mockReturnValue(decoded);

    User.findById.mockResolvedValue(null);

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should return 500 if database query fails', async () => {
    const decoded = { userId: '123' };
    req.cookies.accessToken = 'validToken';
    jwt.verify.mockReturnValue(decoded);

    User.findById.mockImplementation(() => Promise.reject(new Error('Database error')));

    await verifyToken(req, res, next);

    // Ensure async operations are completed
    await new Promise(process.nextTick);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error due to database query failure' });
  });

  it('should call next if token is valid and user is found', async () => {
    const decoded = { userId: '123' };
    req.cookies.accessToken = 'validToken';
    jwt.verify.mockReturnValue(decoded);

    const user = { _id: '123', name: 'Test User' };
    User.findById.mockResolvedValue(user);

    await verifyToken(req, res, next);

    expect(req.user).toBe(user);
    expect(next).toHaveBeenCalled();
  });
});