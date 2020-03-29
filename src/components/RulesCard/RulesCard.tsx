import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './RulesCard.module.scss';

const RulesCard: React.FC<{
  title: string;
}> = ({
  title, children,
}) => (
  <Card className={styles.card}>
    <Card.Header>{title}</Card.Header>
    <Card.Body>
      <Card.Text>
        {children}
      </Card.Text>
    </Card.Body>
  </Card>
);

export default RulesCard;
