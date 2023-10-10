import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import ProtectedRoute from '../src/'; // Import your ProtectedRoute component
import axios from 'axios'; 
import Form from './components/Form';
import Table from './components/Table';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';

class App extends Component {
  constructor(props) {
    super(props);
    this.cookies = new Cookies();
    this.state = {
      authenticated: false,
      todoText: '',
    };
  }

  componentDidMount() {
    // Check user authentication status using cookies
    const authToken = this.cookies.get('authToken');
    if (authToken) {
      this.setState({ authenticated: true });
    }
  }

  handleLogin = () => {
    // Handle user login, make API calls, etc.

    // Assuming login was successful:
    this.cookies.set('authToken', 'yourAuthTokenHere', { path: '/' });
    this.setState({ authenticated: true });
  };

  handleLogout = () => {
    // Handle user logout, clear any session data, make API calls, etc.

    // Remove the authentication cookie:
    this.cookies.remove('authToken', { path: '/' });
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
        <Router>
          <Switch>
            <Route
              path="/login"
              render={props => (
                <Login {...props} onLogin={this.handleLogin} />
              )}
            />
            <Route path="/register" component={Register} />
            <ProtectedRoute
              path="/protected"
              component={Home}
              authenticated={authenticated}
            />
            <Redirect to="/login" />
          </Switch>
        </Router>
        {authenticated && (
          <>
            <Form
              onTodoTextChange={this.handleTodoTextChange}
              onSubmitTodo={this.onSubmitTodo}
            />
            <button onClick={this.onSubmitTodo}>Add todo</button>
            <Table ref={instance => (this.tableComponent = instance)} />
            <button onClick={this.handleLogout}>Logout</button>
          </>
        )}
      </div>
    );
  }
}

export default withCookies(App);
