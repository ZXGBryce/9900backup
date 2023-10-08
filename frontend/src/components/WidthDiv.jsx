import { width } from '@mui/system';
import React from 'react';
import PropTypes from 'prop-types';

export const WidthDiv = (props) => {
  const { text, width } = props;
  return (
    <div name='widthDiv' style={{ width: `${width}` }}>{text}</div>
  )
}

WidthDiv.propTypes = {
  text: PropTypes.string,
  width: PropTypes.string
}
