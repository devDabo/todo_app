import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
  state = {
    email: '',
    password: '',
    error: '',
    success: false,
    isLoading: false,
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, error: '' });
  };

  handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const { email, password } = this.state;

    try {
      this.setState({ isLoading: true });
      
      const response = await axios.post(
        '/auth',
        { user: email, pwd: password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;

      // Protected route goes here
      this.setState({ success: true, error: '', isLoading: false });
    } catch (error) {
      // Handle errors
      this.setState({
        isLoading: false,
        error: error?.response?.data?.message || 'Login Failed',
      });
    }
  };

  render() {
    const { email, password, error, success, isLoading } = this.state;

    return (
      <div>
        {success ? (
          <section>
            <h1>You are logged in!</h1>
            <br />
            <p>
              <a href="#">Go to Home</a>
            </p>
          </section>
        ) : (
          <section>
            {error && <p>{error}</p>}
            <h2>Login</h2>
            <form onSubmit={this.handleLogin}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={this.handleInputChange}
              />
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={this.handleInputChange}
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging In...' : 'Login'}
              </button>
            </form>
            <p>
              Need an Account?<br />
              <span className="line">
                {/* todo: create route */}
                <a href="#">Sign Up</a>
              </span>
            </p>
          </section>
        )}
      </div>
    );
  }
}

export default Login;
