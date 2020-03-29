import React from 'react';
import { Pane } from 'evergreen-ui';
import { Button } from 'react-bootstrap';
import { signInWithFacebook } from '../../services/firebase';

const Onboarding: React.FC<{}> = () => {
  const handleSignIn = React.useCallback(() => {
    signInWithFacebook();
  }, []);

  return (
    <Pane width="100%" height="100vh" display="flex" alignItems="center" justifyContent="center">
      <Button size="lg" onClick={handleSignIn}>Sign in with Facebook</Button>
    </Pane>
  );
};

export default Onboarding;
