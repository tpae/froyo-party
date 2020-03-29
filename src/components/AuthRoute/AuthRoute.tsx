import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({ component, isAuthenticated, ...rest }: any) => {
  const routeComponent = (props: any) => (
    !isAuthenticated
      ? React.createElement(component, props)
      : <Redirect to={{ pathname: '/lobby' }} />
  );
  return <Route {...rest} render={routeComponent} />;
};

export default AuthRoute;
