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
    // Wait for the todo item to be removed from the DOM
    await waitFor(() => {
      expect(screen.queryByText('Test todo 1')).not.toBeInTheDocument();
    });
  });
});