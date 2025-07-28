import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="mt-3 text-red-500 text-sm font-medium">{message}</div>
);

export default ErrorMessage;