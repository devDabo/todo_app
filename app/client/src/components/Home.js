import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
  state = {
    todos: [],
  };

  componentDidMount() {
    this.fetchTodos();
  }

  fetchTodos = () => {
    // Get the token from local storage
    const token = localStorage.getItem('token');

    // Include the token in the request headers
    axios
      .get('http://localhost:4000/api/todo', {
        headers: {
          'x-auth-token': token,
        },
      })
      .then((response) => {
        this.setState({ todos: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { todos } = this.state;

    return (
      <div>
        <h2>Your Todo List</h2>
        <ul>
          {todos.map((todo) => (
            <li key={todo._id}>{todo.todo}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Home;
