import React from 'react';
import { MoreVert } from '@material-ui/icons';
import {
  IconButton, Menu, MenuItem,
} from '@material-ui/core';

const MyRoomsMenu: React.FC<{
  onEdit: (event: React.MouseEvent) => void;
  onDelete: (event: React.MouseEvent) => void;
}> = ({ onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelection = (callback: (e: React.MouseEvent) => void) => (e: React.MouseEvent) => {
    setAnchorEl(null);
    callback(e);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleSelection(onEdit)}>Edit Room</MenuItem>
        <MenuItem onClick={handleSelection(onDelete)} style={{ color: 'red' }}>Delete Room</MenuItem>
      </Menu>
    </>
  );
};

export default MyRoomsMenu;
