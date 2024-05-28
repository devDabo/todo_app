import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Register from '../Register';

// Mock axios
jest.mock('axios');

describe('Register component', () => {
  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();
  });

  test('renders the registration form', () => {
    render(<Register />);
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Password:/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  test('allows the user to input email, password, and confirm password', () => {
    render(<Register />);
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'test@example.com' } });
    const passwordInputs = screen.getAllByLabelText(/Password:/i);
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password:/i), { target: { value: 'password123' } });

    expect(screen.getByLabelText(/Email:/i).value).toBe('test@example.com');
    expect(passwordInputs[0].value).toBe('password123');
    expect(screen.getByLabelText(/Confirm Password:/i).value).toBe('password123');
  });

  test('displays an error message if passwords do not match', () => {
    render(<Register />);
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'test@example.com' } });
    const passwordInputs = screen.getAllByLabelText(/Password:/i);
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password:/i), { target: { value: 'password456' } });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test('handles successful registration', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'User registered successfully' } });

    render(<Register />);
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'test@example.com' } });
    const passwordInputs = screen.getAllByLabelText(/Password:/i);
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password:/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText(/User registered successfully/i)).toBeInTheDocument();
    });
  });

  test('handles registration failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('An error occurred'));

    render(<Register />);
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'test@example.com' } });
    const passwordInputs = screen.getAllByLabelText(/Password:/i);
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password:/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
    });
  });
});