import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase';

import PrivateRoute from '../components/PrivateRoute';
import Lobby from './Lobby';
import Room from './Room';
import Onboarding from './Onboarding';

const Routes: React.FC<{}> = () => {
  const [user, loading] = useAuthState(firebase.auth());
  const isAuthenticated = !loading && user;
  return (
    <Switch>
      <PrivateRoute isAuthenticated={isAuthenticated} exact path="/lobby" component={Lobby} />
      <PrivateRoute isAuthenticated={isAuthenticated} exact path="/room/:roomId" component={Room} />
      <Route exact path="/login" component={Onboarding} />
      <Route path="*">
        <Redirect to="/lobby" />
      </Route>
    </Switch>
  );
};

export default Routes;
