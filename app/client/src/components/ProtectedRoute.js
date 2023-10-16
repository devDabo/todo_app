import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Destructure `component` and rename it to `Component` to satisfy JSX naming conventions
// Rest of the props are collected into `...rest`
const ProtectedRoute = ({ component: Component, ...rest }) => {
  
  // Extract `isAuthenticated` from the auth context
  const { isAuthenticated } = useAuth();

  return (
    // Render a `Route` component and pass any additional props (`...rest`) to it
    <Route
      {...rest}
      // The `render` prop is used to render the provided component (`Component`)
      // only if the user is authenticated, otherwise redirect to the login page
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
