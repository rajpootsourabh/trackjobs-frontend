import React, { useState } from 'react';
import { Button } from '@mui/material';
import AddRoleModal from './AddRolemodal';

const TestComponent = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button 
        variant="contained" 
        onClick={handleOpen}
      >
        Add Role
      </Button>

      <AddRoleModal 
        open={open}
        onClose={handleClose}
      />
    </>
  );
};

export default TestComponent;