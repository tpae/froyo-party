import React from 'react';
import { IconButton } from '@material-ui/core';
import OnIcon from './OnIcon';
import OffIcon from './OffIcon';

const MicButton: React.FC<{
  on?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  style?: React.CSSProperties;
}> = ({
  on, onClick, style,
}) => (
  <IconButton onClick={onClick} style={style}>
    {on ? (
      <OnIcon />
    ) : (
      <OffIcon />
    )}
  </IconButton>
);

export default MicButton;
