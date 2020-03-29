import React from 'react';
import { Pane } from 'evergreen-ui';
import TopicCard from '../TopicCard';
import { TOPICS } from '../../constants';

const TopTopics: React.FC<{
  onJoinTopic: (topic: string) => void;
}> = ({ onJoinTopic }) => {
  const handleJoinTopic = React.useCallback((topic: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    onJoinTopic(topic);
  }, []);

  return (
    <Pane>
      <h3>Top Topics</h3>
      {TOPICS.map((topic) => (
        <TopicCard
          key={topic.tag}
          title={topic.title}
          description={topic.description}
          onClick={handleJoinTopic(topic.tag)}
        />
      ))}
    </Pane>
  );
};

export default TopTopics;
