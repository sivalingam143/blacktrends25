import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { TextInputform, TextArea } from "../../components/Forms";
import { Buttons } from "../../components/Buttons";
import NotifyData from "../../components/NotifyData";
import { fetchStaff, addStaff, updateStaff } from "../../slice/StaffSlice";

const StaffCreation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { staff } = useSelector((s) => s.staff);
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchStaff(""));
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && staff.length > 0) {
      const staffItem = staff.find((s) => s.staff_id === id);
      if (staffItem) {
        setFormData({
          name: staffItem.name || "",
          phone: staffItem.phone || "",
          address: staffItem.address || "",
        });
      }
    }
  }, [id, staff, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!formData.name || !formData.phone) {
      NotifyData(
        `${
          isEdit ? "Staff Update" : "Staff Creation"
        } Failed: Required fields missing`,
        "error"
      );
      setIsSubmitting(false);
      return;
    }

    const staffData = {
      ...formData,
      ...(isEdit && { staff_id: id }),
    };

    try {
      const action = isEdit ? updateStaff(staffData) : addStaff(staffData);
      const msg = await dispatch(action).unwrap();
      NotifyData(msg, "success");
      navigate("/staff");
    } catch (error) {
      NotifyData(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/staff");
  };

  return (
    <div id="main">
      <Container fluid className="p-3">
        <Row>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Name"
              PlaceHolder="Staff Name"
              name="name"
              value={formData.name}
              formtype="text"
              onChange={handleChange}
            />
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Phone"
              PlaceHolder="Phone Number"
              name="phone"
              value={formData.phone}
              formtype="text"
              onChange={handleChange}
            />
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
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
                  ? isEdit
                    ? "Updating..."
                    : "Submitting..."
                  : isEdit
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
              className="border-0 add-btn"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default StaffCreation;
