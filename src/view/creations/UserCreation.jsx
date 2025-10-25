import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { TextInputform, SelectInputForm } from "../../components/Forms"; // Add a SelectInputForm component
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const UserCreation = ({ formData, setFormData, schema }) => {
  const [passwordVisibility, setPasswordVisibility] = useState({});

  const togglePasswordVisibility = (fieldName) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <Container>
        <Row>
          {schema.map((field, index) => (
            <Col lg="12" md="12" xs="12" className="py-3" key={index}>
              {field.type === "select" ? (
                <SelectInputForm
                  textlabel={field.label}
                  name={field.name}
                  value={formData[field.name] || ""}
                  options={field.options || []}
                  onChange={(value) => handleSelectChange(field.name, value)}
                />
              ) : (
                <TextInputform
                  textlabel={field.label}
                  PlaceHolder={field.label}
                  name={field.name}
                  value={formData[field.name] || ""}
                  formtype={
                    field.type === "password" && passwordVisibility[field.name]
                      ? "text"
                      : field.type
                  }
                  onChange={handleChange}
                  classname={field.classname || ""}
                  suffix_icon={
                    field.type === "password" ? (
                      passwordVisibility[field.name] ? (
                        <VscEyeClosed
                          onClick={() => togglePasswordVisibility(field.name)}
                        />
                      ) : (
                        <VscEye
                          onClick={() => togglePasswordVisibility(field.name)}
                        />
                      )
                    ) : null
                  }
                />
              )}
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default UserCreation;
