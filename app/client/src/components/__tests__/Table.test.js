import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Table from '../Table';

// Mock axios
jest.mock('axios');

beforeEach(() => {
    // Mock axios.get as before
    axios.get.mockResolvedValue({ data: mockTodos });
  
    // Mock axios.put to resolve with an empty object to simulate a successful response
    axios.put.mockResolvedValue({});
  });

const mockTodos = [
  { _id: '1', todo: 'Test todo 1', complete: false },
  { _id: '2', todo: 'Test todo 2', complete: true },
];

describe('Table Component', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    axios.get.mockResolvedValue({ data: mockTodos });
  });

  test('fetches todos on component mount and displays them', async () => {
    render(<Table />);

    // Wait for the todos to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('Test todo 1')).toBeInTheDocument();
      expect(screen.getByText('Test todo 2')).toBeInTheDocument();
    });
  });
  test('toggles the completion status of a todo', async () => {
    render(<Table />);
  
    // Wait for the todo items to be fetched and rendered
    const toggleCheckbox = await screen.findByRole('checkbox', { name: 'Toggle Test todo 1' });
  
    // Interact with the checkbox
    fireEvent.click(toggleCheckbox);
  
    // Add assertions as necessary, for example:
    // Expect the checkbox to be checked after the click
    expect(toggleCheckbox).toBeChecked();
  });

});