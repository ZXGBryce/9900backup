import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';

export const MyButton = (props) => {
  const { text, onClick, disabled } = props;
  return (
    <Button title="click me" variant="contained" color="primary" disabled={disabled}

    style={{ margin: '10px' }} onClick={onClick}>{text}</Button>
  );
}
MyButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};
