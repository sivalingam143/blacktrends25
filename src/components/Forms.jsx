import Select from "react-select";
import React from "react";
import { Form } from "react-bootstrap";

const TextInputform = ({
  formLabel,
  formtype,
  PlaceHolder,
  value,
  type,
  name,
  onKeyPress,
  className,
  onChange,
  readOnly,
  suffix_icon,
  prefix_icon,
}) => {
  return (
    <>
      {formLabel && (
        <Form.Label className="px-2 regular">{formLabel}</Form.Label>
      )}
      <div className="input-container">
        {prefix_icon && <span className="prefix-icon">{prefix_icon}</span>}
        <Form.Control
          type={formtype}
          placeholder={PlaceHolder}
          value={value}
          name={name}
          onKeyPress={onKeyPress}
          className={className}
          onChange={onChange}
          readOnly={readOnly}
        />
        {suffix_icon && <span className="suffix-icon">{suffix_icon}</span>}
      </div>
    </>
  );
};
const TextArea = ({
  textlabel,
  PlaceHolder,
  value,
  name,
  className,
  onChange,
  Row,
}) => {
  return (
    <div>
      <div>
        {textlabel && (
          <Form.Label className="px-2 regular">{textlabel}</Form.Label>
        )}
      </div>
      <Form.Control
        as="textarea"
        rows={Row}
        placeholder={PlaceHolder}
        className={className}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
const DropDown = ({
  textlabel,
  placeholder,
  value,
  onChange,
  name,
  options = [],
}) => {
  const handleChange = (selectedOption) => {
    onChange({
      target: {
        name,
        value: selectedOption.value,
      },
    });
  };
  return (
    <>
      {textlabel && (
        <Form.Label className="px-2 regular">{textlabel}</Form.Label>
      )}
      <Select
        options={options}
        placeholder={placeholder}
        value={options.find((option) => option.value === value)}
        onChange={handleChange}
      />
    </>
  );
};
const CheckBox = ({ textlabel, OnChange, boxLabel, type }) => {
  return (
    <>
      <div>
        {textlabel && (
          <Form.Label className="px-2 regular">{textlabel}</Form.Label>
        )}
      </div>
      <div className="check-box d-flex align-items-center">
        <div className="tick-box">
          <Form.Check type={type} onChange={OnChange} isCheckbox={true} />
        </div>
        <div className="mx-3">{boxLabel}</div>
      </div>
    </>
  );
};

const Calender = ({ setLabel, calenderlabel, initialDate }) => {
  return (
    <>
      {calenderlabel && (
        <Form.Label className="px-2 regular">{calenderlabel}</Form.Label>
      )}
      <Form.Control
        type="date"
        value={initialDate}
        onChange={(e) => setLabel(e.target.value)}
      />
    </>
  );
};

export { TextInputform, TextArea, DropDown, CheckBox, Calender };
