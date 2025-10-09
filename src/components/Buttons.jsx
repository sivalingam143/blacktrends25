import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
const Buttons = ({ type, btnlabel, className, onClick, disabled }) => {
  return (
    <>
      <button
        type={type}
        className={className}
        onClick={onClick}
        disabled={disabled}
      >
        {btnlabel}
      </button>
    </>
  );
};
const ActionButton = ({ options, label, className }) => {
  return (
    <Dropdown className={className}>
      <Dropdown.Toggle>{label}</Dropdown.Toggle>
      <Dropdown.Menu>
        {options.map((option, index) => (
          <Dropdown.Item key={index} onClick={option.onClick}>
            {option.icon && <span className="mx-3">{option.icon}</span>}
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
export { Buttons, ActionButton };
