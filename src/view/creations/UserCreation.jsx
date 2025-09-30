import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { TextInputform } from "../../components/Forms";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const UserCreation = ({ formData, setFormData, schema }) => {
  const [passwordVisibility, setPasswordVisibility] = useState({}); // Store visibility for each field

  const togglePasswordVisibility = (fieldName) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Container>
        <Row>
          {schema.map((field, index) => (
            <Col lg="12" md="12" xs="12" className="py-3" key={index}>
              <TextInputform
                textlabel={field.label}
                PlaceHolder={field.label}
                name={field.name}
                value={formData[field.name] || ""}
                formtype={
                  field.type === "password" && passwordVisibility[field.name]
                    ? "text"
                    : field.type
                } // Toggle password visibility per field
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
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default UserCreation;
