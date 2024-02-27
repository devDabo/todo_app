import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Form from './components/Form';
import Table from './components/Table';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import './App.css';

axios.defaults.withCredentials = true;

class App extends Component {
  state = {
    authenticated: false,
    todoText: ''
  };

  componentDidMount() {
    this.checkAuthenticationStatus();
  }

  checkAuthenticationStatus = () => {
    axios.get('http://localhost:4000/api/auth/status')
      .then(response => {
        if (response.data.authenticated) {
          this.setState({ authenticated: true });
        } else {
          this.setState({ authenticated: false });
        }
      })
      .catch(error => {
        console.error("Authentication check failed", error);
        this.setState({ authenticated: false });
      });
  };

  handleLogin = (credentials) => {
    // Send credentials to the server for login
    axios.post('http://localhost:4000/login', credentials)
      .then(response => {
        // After login, check authentication status again
        this.checkAuthenticationStatus();
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleLogout = () => {
    axios.post('http://localhost:4000/api/auth/logout')
      .then(response => {
        // After logout, update authentication status
        this.checkAuthenticationStatus();
      })
      .catch(error => {
        console.log(error);
      });
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
          {authenticated ? (
            <button onClick={this.handleLogout}>Logout</button>
          ) : (
            <Navigate to="/login" replace />
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