import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';

const AuthRoute = ({ component, isAuthenticated, ...rest }: any) => {
  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/lobby' } };
  const routeComponent = (props: any) =>
    !isAuthenticated ? (
      React.createElement(component, props)
    ) : (
      <Redirect to={from} />
    );
  return <Route {...rest} render={routeComponent} />;
};

export default AuthRoute;
