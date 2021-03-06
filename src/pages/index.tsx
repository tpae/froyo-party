import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/app';

import PrivateRoute from '../components/PrivateRoute';
import AuthRoute from '../components/AuthRoute';
import Lobby from './Lobby';
import MyRooms from './MyRooms';
import Room from './Room';
import Onboarding from './Onboarding';
import SignUp from './SignUp';
import Profile from './Profile';

const Routes: React.FC<{}> = () => {
  const [user, loading] = useAuthState(firebase.auth());
  if (loading) {
    return <h3>Loading...</h3>;
  }
  return (
    <Switch>
      <PrivateRoute
        isAuthenticated={!!user}
        exact
        path="/profile"
        component={Profile}
      />
      <PrivateRoute
        isAuthenticated={!!user}
        exact
        path="/lobby"
        component={Lobby}
      />
      <PrivateRoute
        isAuthenticated={!!user}
        exact
        path="/rooms"
        component={MyRooms}
      />
      <PrivateRoute
        isAuthenticated={!!user}
        exact
        path="/room/:roomId"
        component={Room}
      />
      <AuthRoute
        isAuthenticated={!!user}
        exact
        path="/login"
        component={Onboarding}
      />
      <AuthRoute
        isAuthenticated={!!user}
        exact
        path="/signup"
        component={SignUp}
      />
      <Route path="*">
        <Redirect to="/lobby" />
      </Route>
    </Switch>
  );
};

export default Routes;
