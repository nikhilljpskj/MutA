import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

const PopUpModal = ({ open, onClose, title, message, option }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => {
            onClose();
          }}
        >
          {option}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopUpModal;
