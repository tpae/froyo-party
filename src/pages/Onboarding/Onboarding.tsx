import React from 'react';
import { Pane } from 'evergreen-ui';
import { Button } from 'react-bootstrap';
import { signInWithFacebook, signInWithGoogle } from '../../services/firebase';

const Onboarding: React.FC<{}> = () => {
  const handleSignInFacebook = React.useCallback(() => {
    signInWithFacebook();
  }, []);

  const handleSignInGoogle = React.useCallback(() => {
    signInWithGoogle();
  }, []);

  return (
    <Pane width="100%" height="100vh" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
      <Button size="lg" onClick={handleSignInFacebook}>Sign in with Facebook</Button>
      <Pane height="15px" />
      <Button size="lg" onClick={handleSignInGoogle}>Sign in with Google</Button>
    </Pane>
  );
};

export default Onboarding;
