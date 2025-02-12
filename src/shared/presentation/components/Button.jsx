import React from "react";

const Button = ({ onClick, className, children, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        disabled
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      } ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;