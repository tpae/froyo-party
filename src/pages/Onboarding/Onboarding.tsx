import React from 'react';
import { Pane } from 'evergreen-ui';
import {
  Button, Container, Col, Row,
} from 'react-bootstrap';
import styles from './Onboarding.module.scss';
import { signInWithFacebook, signInWithGoogle } from '../../services/firebase';

const Onboarding: React.FC<{}> = () => {
  const handleSignInFacebook = React.useCallback(() => {
    signInWithFacebook();
  }, []);

  const handleSignInGoogle = React.useCallback(() => {
    signInWithGoogle();
  }, []);

  return (
    <Pane className={styles.container}>
      <img className={styles.logo} src="/header-logo.png" alt="Froyo Party" />
      <Container>
        <Row>
          <Col style={{ justifyContent: 'center' }} className={styles.col} xs={12} md={6}>
            <img className={styles.froyos} src="/froyos.png" alt="Froyos" />
          </Col>
          <Col className={styles.col} xs={12} md={6}>
            <Pane display="flex" flexDirection="column">
              <Pane>
                <h1 className={styles.textHeader}>The Anti-Lonely App</h1>
                <p className={styles.text}>
                  Social distancing has never been so sweet. Virtually connect over topics
                  and interests with like minded people. Discuss, learn and collaborate in a
                  safe environment. We’re in this together.
                </p>
              </Pane>
              <Pane className={styles.buttonContainer}>
                <Button
                  className={styles.facebookButton}
                  onClick={handleSignInFacebook}
                >
                  Sign in with Facebook
                </Button>
                <Button
                  className={styles.googleButton}
                  onClick={handleSignInGoogle}
                >
                  Sign in with Google
                </Button>
              </Pane>
            </Pane>
          </Col>
        </Row>
      </Container>
      <img className={styles.footer} src="/wave.svg" alt="Wave" />
    </Pane>
  );
};

export default Onboarding;
