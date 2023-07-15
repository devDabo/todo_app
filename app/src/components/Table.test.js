import React from 'react';
import ReactDOM from 'react-dom';
import Table from './Table';

describe('Table component', () => {
  it('renders the table with todos correctly', () => {
    const div = document.createElement("div");
    ReactDOM.render(<Table></Table>, div)
  })
})
