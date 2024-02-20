import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
    // Check for a token in local storage
    const token = true;
  
    // Set the authenticated state based on whether the token exists
    this.setState({ authenticated: !!token });
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
        this.tableComponent.fetchTodos();
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
      <BrowserRouter>
        <div className="App">
          <h1>Todo App</h1>
          {authenticated && (
            <button onClick={this.handleLogout}>Logout</button>
          )}
          <Routes>
            <Route path="/login" element={<Login onLogin={this.handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={authenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/todos" element={
              <>
                <Form onTodoTextChange={this.handleTodoTextChange} onSubmitTodo={this.onSubmitTodo} />
                <button onClick={this.onSubmitTodo}>Add todo</button>
                <Table ref={instance => (this.tableComponent = instance)} />
              </>
            } />
            <Route path="*" element={<Navigate to={authenticated ? "/home" : "/login"} />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
