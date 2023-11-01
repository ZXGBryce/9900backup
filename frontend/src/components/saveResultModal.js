// Modal.js
import React from 'react';
import { useEffect, useState } from "react";
import '../css/SaveResultModal.css';


const SaveResultModal = ({ isOpen, onClose, children }) => {
  
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1300);
  useEffect(() => {
    function handleResize() {
        if (window.innerWidth > 1300) {
            setIsMobileView(false);
        } else {
            setIsMobileView(true);
        }
        console.log("isMobileView:", isMobileView);
    };
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  if (!isOpen) return null;
    
  return (

    <div style={overlayStyle}>
      <div  className="modalBaseStyle" style={isMobileView? modalStyle : visibleNavbarStyle}>
        {/* <button onClick={onClose}>Close</button> */}
        {children}
      </div>
    </div>
  );
};


const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.7)'
};

const modalBaseStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  padding: '1em',
  width: '60%',
  maxHeight: '90vh',  // 90% of the viewport height
  overflowY: 'scroll' // Show a visible scroller
};

const modalStyle = {
  ...modalBaseStyle
};

const visibleNavbarStyle = {
  ...modalBaseStyle,
  left: '60%'
};

export default SaveResultModal;
