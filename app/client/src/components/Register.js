import React, { Component } from 'react';
import axios from 'axios';

class Register extends Component {
  state = {
    email: '',
    password: '',
    confirmPassword: '',
    successMessage: '',
    errorMessage: '',
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { email, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      this.setState({ errorMessage: 'Passwords do not match' });
      return;
    }

    axios.post('http://localhost:4000/register', { email, password }, { withCredentials: true })
      .then(response => {
        this.setState({
          successMessage: 'User registered successfully',
          errorMessage: '',
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({ errorMessage: 'An error occurred' });
      });
  };

  render() {
    const { email, password, confirmPassword, successMessage, errorMessage } = this.state;

    return (
      <div className="register-container">
        <h2>Register</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
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
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={this.handleInputChange}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    );
  }
}

export default Register;