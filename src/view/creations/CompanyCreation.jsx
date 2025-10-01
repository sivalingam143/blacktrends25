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
    company_name: "",
    contact_number: "",
    email: "",
    address: "",
    gst_no: "",
  });

  useEffect(() => {
    dispatch(fetchCompanies(""));
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && company.length > 0) {
      const companyItem = company.find((c) => c.company_id === id);
      if (companyItem) {
        setFormData({
          company_name: companyItem.company_name || "",
          contact_number: companyItem.contact_number || "",
          email: companyItem.email || "",
          address: companyItem.address || "",
          gst_no: companyItem.gst_no || "",
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

    if (!formData.company_name || !formData.contact_number) {
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
              name="company_name"
              value={formData.company_name}
              formtype="text"
              onChange={handleChange}
            />
          </Col>
          <Col lg="6" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Contact Number"
              PlaceHolder="Contact Number"
              name="contact_number"
              value={formData.contact_number}
              formtype="text"
              onChange={handleChange}
            />
          </Col>
          <Col lg="6" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Email"
              PlaceHolder="Email"
              name="email"
              value={formData.email}
              formtype="email"
              onChange={handleChange}
            />
          </Col>
          <Col lg="6" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="GST No"
              PlaceHolder="GST No"
              name="gst_no"
              value={formData.gst_no}
              formtype="text"
              onChange={handleChange}
            />
          </Col>
          <Col xs="12" className="py-3">
            <TextArea
              textlabel="Address"
              name="address"
              value={formData.address}
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
