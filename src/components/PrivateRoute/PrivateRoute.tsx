import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';

const PrivateRoute = ({ component, isAuthenticated, ...rest }: any) => {
  const location = useLocation();
  const RouteComponent = (props: any) =>
    isAuthenticated ? (
      React.createElement(component, props)
    ) : (
      <Redirect to={{ pathname: '/login', state: { from: location } }} />
    );
  return <Route {...rest} component={RouteComponent} />;
};

export default PrivateRoute;
