import React from "react";

const Button = ({ onClick, className, children, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        disabled
          ? "bg-[hsl(var(--secondary))] cursor-not-allowed"
          : "bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] hover:cursor-pointer"
      } ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;