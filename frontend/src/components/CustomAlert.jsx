import React from 'react';
import '../css/components/CustomAlert.css';

function CustomAlert({ title, message, onClose }) {
  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default CustomAlert;