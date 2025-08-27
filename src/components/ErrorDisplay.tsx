import React from 'react';

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
  <div className="mt-4 text-red-600 text-center">{message}</div>
);

export default ErrorDisplay;
