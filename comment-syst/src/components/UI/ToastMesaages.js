import React from 'react';

const ToastMessages = ({ message, type }) => {
  return (
    <div className={`toast-message ${type}`}>
      {message}
    </div>
  );
};

export default ToastMessages;
