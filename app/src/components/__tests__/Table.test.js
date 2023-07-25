import React from 'react';
import { render, screen } from '@testing-library/react';
import Table from '../Table';

test('render todo list on table component', () => {
render(<Table />);
const linkElement = screen.getByText(/Todo List/i);
expect(linkElement).toBeInTheDocument();
});
