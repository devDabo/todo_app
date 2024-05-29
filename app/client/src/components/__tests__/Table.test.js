import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Table from '../Table';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: mockTodos })),
  delete: jest.fn(() => Promise.resolve()),
  put: jest.fn(() => Promise.resolve()),
}));

beforeEach(() => {
  axios.get.mockResolvedValue({ data: mockTodos });
  axios.put.mockResolvedValue({});
  axios.delete.mockResolvedValue({});
});

const mockTodos = [
  { _id: '1', todo: 'Test todo 1', complete: false },
  { _id: '2', todo: 'Test todo 2', complete: true },
];

describe('Table Component', () => {
  test('fetches todos on component mount and displays them', async () => {
    render(<Table />);

    await waitFor(() => {
      expect(screen.getByText('Test todo 1')).toBeInTheDocument();
      expect(screen.getByText('Test todo 2')).toBeInTheDocument();
    });
  });

  test('toggles the completion status of a todo', async () => {
    render(<Table />);
  
    const toggleCheckbox = await screen.findByRole('checkbox', { name: 'Toggle Test todo 1' });
    fireEvent.click(toggleCheckbox);
    expect(toggleCheckbox).toBeChecked();
  });

  test('deletes a todo', async () => {
    render(<Table />);
    await waitFor(() => expect(screen.getByText('Test todo 1')).toBeInTheDocument());
    const deleteButton = await screen.findByRole('button', { name: `Delete Test todo 1` });
    fireEvent.click(deleteButton);
    // Wait for the axios.delete call to complete
    await waitFor(() => expect(axios.delete).toHaveBeenCalledWith('http://localhost:4000/api/todo/1'));
    // Wait for the todo item to be removed from the DOM
    await waitFor(() => {
      expect(screen.queryByText('Test todo 1')).not.toBeInTheDocument();
    });
  });

  test('starts editing a todo', async () => {
    render(<Table />);
    await waitFor(() => expect(screen.getByText('Test todo 1')).toBeInTheDocument());
    const editButton = screen.getByRole('button', { name: 'Edit Test todo 1' });
    fireEvent.click(editButton);
    const input = screen.getByLabelText('Edit input Test todo 1');
    expect(input).toBeInTheDocument();
  });

  test('cancels editing a todo', async () => {
    render(<Table />);
    await waitFor(() => expect(screen.getByText('Test todo 1')).toBeInTheDocument());
    const editButton = screen.getByRole('button', { name: 'Edit Test todo 1' });
    fireEvent.click(editButton);
    const cancelButton = screen.getByRole('button', { name: 'Cancel Test todo 1' });
    fireEvent.click(cancelButton);
    expect(screen.queryByLabelText('Edit input Test todo 1')).not.toBeInTheDocument();
  });

  test('saves an edited todo', async () => {
    render(<Table />);
    await waitFor(() => expect(screen.getByText('Test todo 1')).toBeInTheDocument());
    const editButton = screen.getByRole('button', { name: 'Edit Test todo 1' });
    fireEvent.click(editButton);
    const input = screen.getByLabelText('Edit input Test todo 1');
    fireEvent.change(input, { target: { value: 'Updated Test todo 1' } });
    const saveButton = screen.getByRole('button', { name: 'Save Test todo 1' });
    fireEvent.click(saveButton);
    await waitFor(() => expect(axios.put).toHaveBeenCalledWith('http://localhost:4000/api/todo/1', { todo: 'Updated Test todo 1' }));
    await waitFor(() => expect(screen.queryByLabelText('Edit input Test todo 1')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Updated Test todo 1')).toBeInTheDocument());
  });

  test('handles empty edited todo text', async () => {
    render(<Table />);
    await waitFor(() => expect(screen.getByText('Test todo 1')).toBeInTheDocument());
    const editButton = screen.getByRole('button', { name: 'Edit Test todo 1' });
    fireEvent.click(editButton);
    const input = screen.getByLabelText('Edit input Test todo 1');
    fireEvent.change(input, { target: { value: '' } });
    const saveButton = screen.getByRole('button', { name: 'Save Test todo 1' });
    fireEvent.click(saveButton);
    expect(screen.queryByLabelText('Edit input Test todo 1')).toBeInTheDocument(); // Input should still be there
    expect(axios.put).not.toHaveBeenCalled();
  });

  test('displays invalid response data format message', async () => {
    axios.get.mockResolvedValueOnce({ data: {} });
    console.log = jest.fn();

    render(<Table />);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Invalid response data format');
    });
  });

  test('handles errors from fetchTodos', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));
    console.log = jest.fn();

    render(<Table />);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(new Error('Network Error'));
    });
  });

  test('handles errors from deleteTodo', async () => {
    axios.delete.mockRejectedValueOnce(new Error('Delete Error'));
    console.log = jest.fn();

    render(<Table />);
    await waitFor(() => expect(screen.getByText('Test todo 1')).toBeInTheDocument());
    const deleteButton = await screen.findByRole('button', { name: `Delete Test todo 1` });
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(new Error('Delete Error'));
    });
  });

  test('handles errors from saveTodo', async () => {
    axios.put.mockRejectedValueOnce(new Error('Update Error'));
    console.log = jest.fn();

    render(<Table />);
    await waitFor(() => expect(screen.getByText('Test todo 1')).toBeInTheDocument());
    const editButton = screen.getByRole('button', { name: 'Edit Test todo 1' });
    fireEvent.click(editButton);
    const input = screen.getByLabelText('Edit input Test todo 1');
    fireEvent.change(input, { target: { value: 'Updated Test todo 1' } });
    const saveButton = screen.getByRole('button', { name: 'Save Test todo 1' });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(new Error('Update Error'));
    });
  });
});