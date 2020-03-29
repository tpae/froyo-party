import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './TextCard.module.scss';

const TextCard: React.FC<{
  title: string;
}> = ({
  title, children,
}) => (
  <Card className={styles.card}>
    <Card.Header>{title}</Card.Header>
    <Card.Body>
      {children}
    </Card.Body>
  </Card>
);

export default TextCard;
