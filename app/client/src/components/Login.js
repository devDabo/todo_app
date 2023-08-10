import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
  state = {
    email: '',
    password: '',
    error: '',
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleLogin = () => {
    const { email, password } = this.state;

    axios
      .post('http://localhost:4000/api/auth/login', { email, password })
      .then((response) => {
        console.log(response.data);
        // Set authentication token or user info in your context/state management
        // Redirect to the protected route
        this.props.history.push('/');
      })
      .catch((error) => {
        this.setState({ error: 'Invalid email or password' });
      });
  };

  render() {
    const { email, password, error } = this.state;

    return (
      <div>
        <h2>Login</h2>
        {error && <p>{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={this.handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={this.handleInputChange}
        />
        <button onClick={this.handleLogin}>Login</button>
      </div>
    );
  }
}

export default Login;
