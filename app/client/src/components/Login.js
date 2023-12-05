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
        // Store the JWT token in local storage
        localStorage.setItem('token', response.data.token);

        console.log('Login successful:', response.data);
      })
      .catch(error => {
        const errorMessage = error.response && error.response.data.message 
                           ? error.response.data.message 
                           : 'Login failed';
        this.setState({ error: errorMessage });
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
        {/* <p>Don't have an account? <Link to="/register">Register here</Link> </p> */}
      </div>
    );
  }
}

export default Login;
