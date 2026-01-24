import React from 'react';
import '../styles/Button.css';

const Button = ({ children, onClick, variant = 'primary', size = 'medium', disabled = false }) => {
  return (
    <button 
      className={`button ${variant} ${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;