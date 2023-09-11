import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const AutocompleteDialog = ({ open, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(["fdmjshb","cdbxj c","dncabjvh","dvhcbhhj","dcnkjxbz"]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleInputChange = (event, newValue) => {
    setInputValue(newValue);
  };

  const handleDialogClose = () => {
    onClose();
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogTitle>Autocomplete Dialog</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Start typing to search for options:
        </DialogContentText>
        <TextField
          value={inputValue}
          onChange={(event) => {
            handleInputChange(event, event.target.value);
            handleOpenMenu(event);
          }}
          label="Search..."
          variant="outlined"
        />
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1,
            width: '100%',
            maxHeight: '150px', // Adjust the maximum height as needed
            overflowY: 'auto',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            display: anchorEl ? 'block' : 'none',
          }}
        >
          <Autocomplete
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            value={inputValue}
            onChange={(event, newValue) => {
              setInputValue(newValue);
              handleCloseMenu();
            }}
            options={options}
            getOptionLabel={(option) => option}
            renderInput={() => null}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AutocompleteDialog;
