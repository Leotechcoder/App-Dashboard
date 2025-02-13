import React from 'react'

const Input = React.forwardRef(
  (
    { type = "text", placeholder = "", value, onChange, className = "", id, name, required, disabled, ...props },
    ref,
  ) => {
    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
        {...props}
      />
    )
  },
)

Input.displayName = "Input"

export default Input

