import Select from "react-select";
import React from "react";
import { Form } from "react-bootstrap";
import moment from "moment";

const DropDown = ({
  textlabel,
  placeholder,
  value,
  onChange,
  name,
  options = [],
  width = "100%",
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
      <div style={{ width: width }}>
        <Select
          options={options}
          placeholder={placeholder}
          value={options.find((option) => option.value === value)}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

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
  width = "100%",
}) => {
  return (
    <>
      {formLabel && (
        <Form.Label className="px-2 regular">{formLabel}</Form.Label>
      )}
      <div className="input-container" style={{ width: width }}>
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

const formatDate = (dateString) => {
  if (!dateString) return "";
  return moment(dateString, "YYYY-MM-DD").format("DD-MM-YYYY");
};

export { TextInputform, TextArea, DropDown, CheckBox, formatDate, Calender };
