const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Todo = require('../schema/schema');
const todoRouter = require('../routes/todo');
const authMiddleware = require('../middleware/authMiddleware');
const { getCurrentUserId } = require('../routes/todo'); // Import the getCurrentUserId function

const app = express();
app.use(express.json());
app.use(require('cookie-parser')());
app.use('/api/todo', authMiddleware.verifyToken, todoRouter);

jest.mock('../schema/schema');
jest.mock('../middleware/authMiddleware');

describe('Todo API', () => {
  let token;
  let userId;

  beforeAll(() => {
    userId = new mongoose.Types.ObjectId().toString();
    token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    authMiddleware.verifyToken.mockImplementation((req, res, next) => {
      req.user = { _id: userId };
      next();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/todo', () => {
    it('should create a new todo', async () => {
      const todoData = { todo: 'Test todo', complete: false };
      Todo.prototype.save = jest.fn().mockResolvedValue({ ...todoData, user: userId });

      const res = await request(app)
        .post('/api/todo')
        .set('Cookie', `accessToken=${token}`)
        .send(todoData);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Todo added successfully');
      expect(Todo.prototype.save).toHaveBeenCalled();
    });

    it('should return 401 if user is not authorized', async () => {
      authMiddleware.verifyToken.mockImplementationOnce((req, res, next) => {
        res.status(401).json({ message: 'Unauthorized' });
      });

      const res = await request(app)
        .post('/api/todo')
        .send({ todo: 'Test todo', complete: false });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });

    it('should handle internal server error', async () => {
      Todo.prototype.save = jest.fn().mockRejectedValue(new Error('Internal Server Error'));

      const res = await request(app)
        .post('/api/todo')
        .set('Cookie', `accessToken=${token}`)
        .send({ todo: 'Test todo', complete: false });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('An error occurred');
    });
  });

  describe('DELETE /api/todo/:id', () => {
    it('should delete a todo', async () => {
      const todoId = new mongoose.Types.ObjectId().toString();
      Todo.findOneAndDelete = jest.fn().mockResolvedValue({ _id: todoId, user: userId });

      const res = await request(app)
        .delete(`/api/todo/${todoId}`)
        .set('Cookie', `accessToken=${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Todo deleted successfully');
      expect(Todo.findOneAndDelete).toHaveBeenCalledWith({ _id: todoId, user: userId });
    });

    it('should return 404 if todo not found or not owned by user', async () => {
      Todo.findOneAndDelete = jest.fn().mockResolvedValue(null);

      const res = await request(app)
        .delete(`/api/todo/invalidTodoId`)
        .set('Cookie', `accessToken=${token}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Todo not found or not yours');
    });

    it('should handle internal server error', async () => {
      Todo.findOneAndDelete = jest.fn().mockRejectedValue(new Error('Internal Server Error'));

      const res = await request(app)
        .delete(`/api/todo/invalidTodoId`)
        .set('Cookie', `accessToken=${token}`);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('An error occurred');
    });
  });

  describe('GET /api/todo', () => {
    it('should get all todos for the authenticated user', async () => {
      const todos = [{ todo: 'Test todo 1', complete: false, user: userId }];
      Todo.find = jest.fn().mockResolvedValue(todos);

      const res = await request(app)
        .get('/api/todo')
        .set('Cookie', `accessToken=${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(todos);
      expect(Todo.find).toHaveBeenCalledWith({ user: userId });
    });

    it('should handle internal server error', async () => {
      Todo.find = jest.fn().mockRejectedValue(new Error('Internal Server Error'));

      const res = await request(app)
        .get('/api/todo')
        .set('Cookie', `accessToken=${token}`);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('An error occurred');
    });
  });

  describe('PUT /api/todo/:id', () => {
    it('should update a todo', async () => {
      const todoId = new mongoose.Types.ObjectId().toString();
      const updatedData = { todo: 'Updated todo', complete: true };
      Todo.findOneAndUpdate = jest.fn().mockResolvedValue({ ...updatedData, user: userId });

      const res = await request(app)
        .put(`/api/todo/${todoId}`)
        .set('Cookie', `accessToken=${token}`)
        .send(updatedData);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Todo updated successfully');
      expect(res.body.todo).toEqual(expect.objectContaining(updatedData));
      expect(Todo.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: todoId, user: userId },
        updatedData,
        { new: true }
      );
    });

    it('should return 404 if todo not found or not owned by user', async () => {
      Todo.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      const res = await request(app)
        .put('/api/todo/invalidTodoId')
        .set('Cookie', `accessToken=${token}`)
        .send({ todo: 'Updated todo', complete: true });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Todo not found or not yours');
    });

    it('should handle internal server error', async () => {
      Todo.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('Internal Server Error'));

      const res = await request(app)
        .put('/api/todo/invalidTodoId')
        .set('Cookie', `accessToken=${token}`)
        .send({ todo: 'Updated todo', complete: true });
-
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('An error occurred');
    });
  });
});