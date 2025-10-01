import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { TextInputform, TextArea } from "../../components/Forms";
import { Buttons } from "../../components/Buttons";
import NotifyData from "../../components/NotifyData";
import {
  fetchCompanies,
  addCompany,
  updateCompany,
} from "../../slice/CompanySlice";

const CompanyCreation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { company } = useSelector((state) => state.company);
  const isEditMode = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    Company_Name: "",
    Contact_Number: "",
    Email: "",
    Address: "",
    GSTIN: "",
    Contact_Person: "",
  });

  useEffect(() => {
    dispatch(fetchCompanies(""));
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && company.length > 0) {
      const companyItem = company.find((c) => c.company_id === id);
      if (companyItem) {
        setFormData({
          Company_Name: companyItem.Company_Name || "",
          Contact_Number: companyItem.Contact_Number || "",
          Email: companyItem.Email || "",
          Address: companyItem.Address || "",
          GSTIN: companyItem.GSTIN || "",
          Contact_Person: companyItem.Contact_Person || "",
        });
      }
    }
  }, [id, company, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!formData.Company_Name || !formData.Contact_Number) {
      NotifyData(
        `${
          isEditMode ? "Company Update" : "Company Creation"
        } Failed: Required fields missing`,
        "error"
      );
      setIsSubmitting(false);
      return;
    }

    const companyData = {
      ...formData,
      ...(isEditMode && { company_id: id }),
    };

    try {
      const action = isEditMode
        ? updateCompany(companyData)
        : addCompany(companyData);
      const msg = await dispatch(action).unwrap();
      NotifyData(msg, "success");
      navigate("/company");
    } catch (error) {
      NotifyData(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/company");
  };

  return (
    <div id="main">
      <Container fluid className="p-3">
        <Row>
          <Col lg="6" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Company Name"
              PlaceHolder="Company Name"
              name="Company_Name"
              value={formData.Company_Name}
              formtype="text"
              onChange={handleChange}
            />
          </Col>
          <Col lg="6" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Contact Number"
              PlaceHolder="Contact Number"
              name="Contact_Number"
              value={formData.Contact_Number}
              formtype="text"
              onChange={handleChange}
            />
          </Col>
          <Col lg="6" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Email"
              PlaceHolder="Email"
              name="Email"
              value={formData.Email}
              formtype="email"
              onChange={handleChange}
            />
          </Col>
          <Col lg="6" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="GSTIN"
              PlaceHolder="GSTIN"
              name="GSTIN"
              value={formData.GSTIN}
              formtype="text"
              onChange={handleChange}
            />
          </Col>
          <Col xs="12" className="py-3">
            <TextArea
              textlabel="Address"
              name="Address"
              value={formData.Address}
              onChange={handleChange}
            />
          </Col>
          <Col lg="6" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Contact Person"
              PlaceHolder="Contact Person"
              name="Contact_Person"
              value={formData.Contact_Person}
              formtype="text"
              onChange={handleChange}
            />
          </Col>
        </Row>
        <div className="align-items-end justify-content-center mt-5 d-flex custom-create">
          <div className="p-4">
            <Buttons
              btnlabel={
                isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Submitting..."
                  : isEditMode
                  ? "Update"
                  : "Submit"
              }
              className="border-0 submit-btn"
              onClick={handleSubmit}
              disabled={isSubmitting}
            />
          </div>
          <div className="p-4">
            <Buttons
              btnlabel={<>Cancel</>}
              onClick={handleCancel}
              className="border-0 can-btn"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CompanyCreation;
