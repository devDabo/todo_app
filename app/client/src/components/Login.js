import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
  state = {
    email: '',
    password: '',
    error: '',
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { email, password } = this.state;

    axios.post('http://localhost:4000/login', { email, password })
      .then(response => {
        // Handle successful login
        console.log(response.data);

        // Assuming the server sends back a token
        const token = response.data.token;

        // Store the token in local storage (or a secure location)
        localStorage.setItem('token', token);

        // Redirect to a protected route (e.g., user dashboard)
        this.props.history.push('/home');
      })
      .catch(error => {
        // Handle login error
        console.error(error);
        this.setState({ error: 'Invalid email or password' });
      });
  };

  render() {
    const { email, password, error } = this.state;

    return (
      <div className="login-container">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={this.handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={this.handleInputChange}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default Login;
