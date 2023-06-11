import React, { Component } from 'react';
import axios from 'axios';

class Table extends Component {
  state = {
    todos: []
  };

  componentDidMount() {
    this.fetchTodos();
  }

  fetchTodos = () => {
    axios
      .get('http://localhost:4000/gettodo')
      .then(response => {
        this.setState({ todos: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { todos } = this.state;

    return (
      <div>
        <h2>Todo List</h2>
        <table>
          <thead>
            <tr>
              <th>Todo</th>
            </tr>
          </thead>
          <tbody>
            {todos.map(todo => (
              <tr key={todo.id}>
                <td>{todo.todo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
