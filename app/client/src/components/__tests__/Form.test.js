import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from '../Form';

describe('Form component', () => {
  test('renders the input field and submit button', () => {
    render(<Form onFormSubmit={jest.fn()} />);
    expect(screen.getByLabelText(/Todo:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Todo/i })).toBeInTheDocument();
  });

  test('allows the user to type in the input field', () => {
    render(<Form onFormSubmit={jest.fn()} />);
    const input = screen.getByLabelText(/Todo:/i);
    fireEvent.change(input, { target: { value: 'New Todo' } });
    expect(input.value).toBe('New Todo');
  });

  test('calls onFormSubmit with the input value when the form is submitted', () => {
    const mockOnFormSubmit = jest.fn();
    render(<Form onFormSubmit={mockOnFormSubmit} />);
    const input = screen.getByLabelText(/Todo:/i);
    fireEvent.change(input, { target: { value: 'New Todo' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Todo/i }));
    expect(mockOnFormSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnFormSubmit).toHaveBeenCalledWith('New Todo');
  });

  test('clears the input field after form submission', () => {
    const mockOnFormSubmit = jest.fn();
    render(<Form onFormSubmit={mockOnFormSubmit} />);
    const input = screen.getByLabelText(/Todo:/i);
    fireEvent.change(input, { target: { value: 'New Todo' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Todo/i }));
    expect(input.value).toBe('');
  });

  test('prevents form submission when input is empty', () => {
    const mockOnFormSubmit = jest.fn();
    render(<Form onFormSubmit={mockOnFormSubmit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Add Todo/i }));
    expect(mockOnFormSubmit).not.toHaveBeenCalled();
  });
});