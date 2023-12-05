import React, { Component } from 'react';
import axios from 'axios';
import Form from './components/Form';
import Table from './components/Table';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import './App.css';

class App extends Component {
  state = {
    authenticated: false,
    todoText: ''
  };

  componentDidMount() {
    this.setState({ authenticated: true });
  }

  handleLogin = () => {
    this.setState({ authenticated: true });
  };

  handleLogout = () => {
    this.setState({ authenticated: false });
  };

  onSubmitTodo = () => {
    const { todoText } = this.state;

    axios
      .post('http://localhost:4000/api/todo', { todo: todoText })
      .then(response => {
        console.log(response.data);
        this.tableComponent.fetchTodos(); // Update the todos by calling fetchTodos in the Table component
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleTodoTextChange = todoText => {
    this.setState({ todoText });
  };

  render() {
    const { authenticated } = this.state;

    return (
      <div className="App">
        <h1>Todo App</h1>
        {authenticated ? (
          <>
            <Form
              onTodoTextChange={this.handleTodoTextChange}
              onSubmitTodo={this.onSubmitTodo}
            />
            <button onClick={this.onSubmitTodo}>Add todo</button>
            <Table ref={instance => (this.tableComponent = instance)} />
            <button onClick={this.handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Login onLogin={this.handleLogin} />
            <Register />
          </>
        )}
      </div>
    );
  }
}

export default App;
