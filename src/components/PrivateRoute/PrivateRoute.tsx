import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component, isAuthenticated, ...rest }: any) => {
  const RouteComponent = (props: any) => (
    isAuthenticated
      ? React.createElement(component, props)
      : <Redirect to={{ pathname: '/login' }} />
  );
  return <Route {...rest} component={RouteComponent} />;
};

export default PrivateRoute;
