import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

import Lobby from './Lobby';
import Room from './Room';
import Onboarding from './Onboarding';

const Routes: React.FC<{}> = () => {
  return (
    <Switch>
      <PrivateRoute isAuthenticated={true} exact path="/lobby" component={Lobby} />
      <PrivateRoute isAuthenticated={true} exact path="/room/:roomId" component={Room} />
      <Route exact path="/login" component={Onboarding} />
      <Route path="*">
        <Redirect to="/lobby" />
      </Route>
    </Switch>
  )
};

export default Routes;