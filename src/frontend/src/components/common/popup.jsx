// src/components/Popup.js

import React from 'react';
import './popup.css'; // Import file CSS

const Popup = ({ isOpen, title, message, buttonText, onConfirm, onClose, blurIntensity = 4, mandatory = false, }) => {
  // Nếu prop `isOpen` là false, không render gì cả
  if (!isOpen) {
    return null;
  }

  // Ngăn chặn sự kiện click lan ra overlay khi click vào container
  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = () => {
    if (!mandatory && onClose)
      onClose();
  }

  const overlayStyle = {
    backdropFilter: `blur(${blurIntensity}px)`,
  };

  return (
    <div className="popup-overlay" onClick={handleOverlayClick} style = {overlayStyle}>
      <div className="popup-container" onClick={handleContainerClick}>
        <h2 className="popup-title">{title}</h2>
        <p className="popup-message">{message}</p> 
        {onConfirm && buttonText && (
           <button className="popup-button" onClick={onConfirm}>
            {buttonText}
          </button>
        )}    
       
      </div>
    </div>
  );
};

export default Popup;