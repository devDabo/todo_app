import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from '../Login';

// Mock axios
jest.mock('axios');

describe('Login component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();
  });

  const renderWithRouter = (component) => {
    return render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={component} />
          <Route path="/home" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders the login form', () => {
    renderWithRouter(<Login />);
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('allows the user to input email and password', () => {
    renderWithRouter(<Login />);
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'password123' } });

    expect(screen.getByLabelText(/Email:/i).value).toBe('test@example.com');
    expect(screen.getByLabelText(/Password:/i).value).toBe('password123');
  });

  test('handles successful login', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Login successful' } });
    const mockOnLoginSuccess = jest.fn();

    renderWithRouter(<Login onLoginSuccess={mockOnLoginSuccess} />);
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalled();
      expect(screen.getByText(/Home/i)).toBeInTheDocument();
    });
  });

  test('handles login failure', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } }
    });

    renderWithRouter(<Login />);
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('displays a general error message if login fails without a specific error message', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    renderWithRouter(<Login />);
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
    });
  });
});