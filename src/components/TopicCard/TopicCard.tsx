import React from 'react';
import { Card, Button } from 'react-bootstrap';
import styles from './TopicCard.module.scss';

const TopicCard: React.FC<{
  title: string;
  description: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({
  title, description, onClick,
}) => (
  <Card className={styles.card}>
    <Card.Header>{title}</Card.Header>
    <Card.Body>
      <Card.Text>
        {description}
      </Card.Text>
      <Button variant="outline-secondary" onClick={onClick} block>Join</Button>
    </Card.Body>
  </Card>
);

export default TopicCard;
