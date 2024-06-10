import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Home from '../Home';
import Form from '../Form';

jest.mock('axios');

describe('Home Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] });
    axios.post.mockResolvedValue({});
    axios.put.mockResolvedValue({});
    axios.delete.mockResolvedValue({});
  });

  it('should render without crashing', async () => {
    await act(async () => {
      render(<Home />);
    });
    expect(screen.getByText('Please log in to view todos.')).toBeInTheDocument();
  });

  it('should display login message if not authenticated', async () => {
    await act(async () => {
      render(<Home />);
    });
    expect(screen.getByText('Please log in to view todos.')).toBeInTheDocument();
  });

  it('should fetch authentication status on mount', async () => {
    const response = { data: { authenticated: true } };
    axios.get.mockResolvedValueOnce(response);
    await act(async () => {
      render(<Home />);
    });
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/auth/status', { withCredentials: true }));
  });

  it('should update state when authentication check is successful', async () => {
    const response = { data: { authenticated: true } };
    axios.get.mockResolvedValueOnce(response);
    await act(async () => {
      render(<Home />);
    });
    await waitFor(() => expect(screen.getByText('Todo List')).toBeInTheDocument());
  });

  it('should fetch todos when authenticated', async () => {
    const response = { data: { authenticated: true } };
    axios.get.mockResolvedValueOnce(response);
    await act(async () => {
      render(<Home />);
    });
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/todo', { withCredentials: true }));
  });

  it('should update state with fetched todos', async () => {
    const todos = [
      { _id: 1, todo: 'Test todo 1', complete: false },
      { _id: 2, todo: 'Test todo 2', complete: true },
    ];
    axios.get.mockResolvedValueOnce({ data: { authenticated: true } });
    axios.get.mockResolvedValueOnce({ data: todos });
    await act(async () => {
      render(<Home />);
    });
    await waitFor(() => {
      expect(screen.getByText('Test todo 1')).toBeInTheDocument();
      expect(screen.getByText('Test todo 2')).toBeInTheDocument();
    });
  });

  it('should add a new todo', async () => {
    axios.get.mockResolvedValueOnce({ data: { authenticated: true } });
    axios.get.mockResolvedValueOnce({ data: [] });
    await act(async () => {
      render(<Home />);
    });
    await waitFor(() => {
      const todoInput = screen.getByLabelText(/Todo:/i);
      fireEvent.change(todoInput, { target: { value: 'New Todo' } });
      fireEvent.click(screen.getByText(/Add Todo/i));
    });
    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('http://localhost:4000/api/todo', { todo: 'New Todo' }, { withCredentials: true }));
  });

  it('should delete a todo', async () => {
    const todos = [{ _id: 1, todo: 'Test todo', complete: false }];
    axios.get.mockResolvedValueOnce({ data: { authenticated: true } });
    axios.get.mockResolvedValueOnce({ data: todos });
    await act(async () => {
      render(<Home />);
    });
    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[1]);
    });
    await waitFor(() => expect(axios.delete).toHaveBeenCalledWith('http://localhost:4000/api/todo/1'));
  });

  it('should start editing a todo', async () => {
    const todos = [{ _id: 1, todo: 'Test todo', complete: false }];
    axios.get.mockResolvedValueOnce({ data: { authenticated: true } });
    axios.get.mockResolvedValueOnce({ data: todos });
    await act(async () => {
      render(<Home />);
    });
    await waitFor(() => {
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[1]);
      const input = screen.getByDisplayValue('Test todo');
      expect(input).toBeInTheDocument();
    });
  });

  it('should cancel editing a todo', async () => {
    const todos = [{ _id: 1, todo: 'Test todo', complete: false }];
    axios.get.mockResolvedValueOnce({ data: { authenticated: true } });
    axios.get.mockResolvedValueOnce({ data: todos });
    await act(async () => {
      render(<Home />);
    });
    await waitFor(() => {
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[1]);
      fireEvent.click(screen.getByText('Cancel'));
      expect(screen.queryByDisplayValue('Test todo')).not.toBeInTheDocument();
    });
  });

  it('should save an edited todo', async () => {
    const todos = [{ _id: 1, todo: 'Test todo', complete: false }];
    axios.get.mockResolvedValueOnce({ data: { authenticated: true } });
    axios.get.mockResolvedValueOnce({ data: todos });
    await act(async () => {
      render(<Home />);
    });
    await waitFor(() => {
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[1]);
      const input = screen.getByDisplayValue('Test todo');
      fireEvent.change(input, { target: { value: 'Edited todo' } });
      fireEvent.click(screen.getByText('Save'));
    });
    await waitFor(() => expect(axios.put).toHaveBeenCalledWith('http://localhost:4000/api/todo/1', { todo: 'Edited todo' }));
  });

  it('should toggle completion status of a todo', async () => {
    const todo = { _id: 1, todo: 'Test todo', complete: false };
    axios.get.mockResolvedValueOnce({ data: { authenticated: true } });
    axios.get.mockResolvedValueOnce({ data: [todo] });
    await act(async () => {
      render(<Home />);
    });
    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
    });
    await waitFor(() => expect(axios.put).toHaveBeenCalledWith('http://localhost:4000/api/todo/1', { complete: true }));
  });

  it('should handle todo text change', async () => {
    const todos = [{ _id: 1, todo: 'Test todo', complete: false }];
    axios.get.mockResolvedValueOnce({ data: { authenticated: true } });
    axios.get.mockResolvedValueOnce({ data: todos });
    await act(async () => {
      render(<Home />);
    });
    await waitFor(() => {
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[1]);
      const input = screen.getByDisplayValue('Test todo');
      fireEvent.change(input, { target: { value: 'New text' } });
      expect(input.value).toBe('New text');
    });
  });

  it('should render the Form component', async () => {
    axios.get.mockResolvedValueOnce({ data: { authenticated: true } });
    await act(async () => {
      render(<Home />);
    });
    await waitFor(() => {
      expect(screen.getByText(/Add Todo/i)).toBeInTheDocument();
    });
  });
});