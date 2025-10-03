import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Container, Row, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { TextInputform, TextArea } from "../../components/Forms";
import { Buttons } from "../../components/Buttons";
import NotifyData from "../../components/NotifyData";
import { fetchMembers } from "../../slice/MemberSlice";
import {
  fetchBillings,
  addBilling,
  updateBilling,
} from "../../slice/BillingSlice";

const BillingCreation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { member } = useSelector((s) => s.member);
  const { billing } = useSelector((s) => s.billing);
  const isEdit = !!id;

  const [form, setForm] = useState({
    billing_date: new Date().toISOString().split("T")[0],
    member_no: "",
    name: "",
    phone: "",
    productandservice_details: "",
    subtotal: 0,
    discount: 0,
    total: 0,
    last_visit_date: new Date().toISOString().split("T")[0],
    total_visit_count: 0,
    total_spending: 0,
    membership: "No",
    created_by_id: 1, // Assume
    updated_by_id: 1,
    billing_id: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchMembers(""));
    dispatch(fetchBillings(""));
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && billing.length) {
      const rec = billing.find((b) => b.billing_id === id);
      if (rec) {
        setForm({
          ...rec,
          billing_date: rec.billing_date.split(" ")[0],
          last_visit_date: rec.last_visit_date.split(" ")[0],
          subtotal: parseFloat(rec.subtotal),
          discount: parseFloat(rec.discount),
          total: parseFloat(rec.total),
          total_spending: parseFloat(rec.total_spending),
          total_visit_count: parseInt(rec.total_visit_count),
        });
      }
    }
  }, [id, billing, isEdit]);

  const handleMemberChange = (e) => {
    const selectedNo = e.target.value;
    setForm((prev) => {
      const selectedMember = member.find((m) => m.member_no === selectedNo);
      return {
        ...prev,
        member_no: selectedNo,
        name: selectedMember ? selectedMember.name : "",
        phone: selectedMember ? selectedMember.phone : "",
        membership: selectedMember ? selectedMember.gold_membership : "No",
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      let newVal = value;
      if (["subtotal", "discount", "total", "total_spending"].includes(name)) {
        newVal = parseFloat(value) || 0;
      } else if (name === "total_visit_count") {
        newVal = parseInt(value) || 0;
      }
      return { ...prev, [name]: newVal };
    });
  };

  const handleTotalCalc = () => {
    const subtotal = parseFloat(form.subtotal) || 0;
    const discount = parseFloat(form.discount) || 0;
    setForm((prev) => ({ ...prev, total: subtotal - discount }));
  };

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);

    if (
      !form.member_no ||
      !form.name ||
      !form.phone ||
      !form.productandservice_details
    ) {
      NotifyData("Required fields missing", "error");
      setSubmitting(false);
      return;
    }

    const payload = {
      ...form,
      ...(isEdit && { billing_id: id }),
    };

    try {
      const action = isEdit ? updateBilling(payload) : addBilling(payload);
      const msg = await dispatch(action).unwrap();
      NotifyData(msg, "success");
      navigate("/billing");
    } catch (e) {
      NotifyData(e.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="main">
      <Container fluid className="p-3">
        <Row>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Billing Date"
              PlaceHolder="YYYY-MM-DD"
              name="billing_date"
              formtype="date"
              value={form.billing_date}
              onChange={handleChange}
            />
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <Form.Group>
              <Form.Label>Member No</Form.Label>
              <Form.Select
                name="member_no"
                value={form.member_no}
                onChange={handleMemberChange}
              >
                <option value="">Select Member</option>
                {member.map((m) => (
                  <option key={m.member_no} value={m.member_no}>
                    {m.member_no} - {m.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Name"
              PlaceHolder="Name"
              name="name"
              value={form.name}
              disabled={true}
              onChange={handleChange}
            />
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Phone"
              PlaceHolder="Phone"
              name="phone"
              value={form.phone}
              disabled={true}
              onChange={handleChange}
            />
          </Col>
          <Col lg="12" md="12" xs="12" className="py-3">
            <TextArea
              textlabel="Product & Service Details"
              name="productandservice_details"
              value={form.productandservice_details}
              onChange={handleChange}
              rows={4}
              placeholder="Enter details (e.g., JSON or text)"
            />
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Subtotal"
              PlaceHolder="0.00"
              name="subtotal"
              formtype="number"
              step="0.01"
              value={form.subtotal}
              onChange={handleChange}
              onBlur={handleTotalCalc}
            />
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Discount"
              PlaceHolder="0.00"
              name="discount"
              formtype="number"
              step="0.01"
              value={form.discount}
              onChange={handleChange}
              onBlur={handleTotalCalc}
            />
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Total"
              PlaceHolder="0.00"
              name="total"
              formtype="number"
              step="0.01"
              value={form.total}
              onChange={handleChange}
            />
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Last Visit Date"
              PlaceHolder="YYYY-MM-DD"
              name="last_visit_date"
              formtype="date"
              value={form.last_visit_date}
              onChange={handleChange}
            />
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Total Visit Count"
              PlaceHolder="0"
              name="total_visit_count"
              formtype="number"
              value={form.total_visit_count}
              onChange={handleChange}
            />
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Total Spending"
              PlaceHolder="0.00"
              name="total_spending"
              formtype="number"
              step="0.01"
              value={form.total_spending}
              onChange={handleChange}
            />
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3 d-flex align-items-center">
            <div className="me-3">Membership:</div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="membership"
                id="memYes"
                value="Yes"
                checked={form.membership === "Yes"}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="memYes">
                Yes
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="membership"
                id="memNo"
                value="No"
                checked={form.membership === "No"}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="memNo">
                No
              </label>
            </div>
          </Col>
        </Row>

        <div className="d-flex justify-content-center mt-4">
          <Buttons
            btnlabel={
              submitting
                ? isEdit
                  ? "Updating…"
                  : "Adding…"
                : isEdit
                ? "Update"
                : "Create"
            }
            className="border-0 submit-btn me-3"
            onClick={submit}
            disabled={submitting}
          />
          <Buttons
            btnlabel="Cancel"
            className="border-0 add-btn"
            onClick={() => navigate("/billing")}
            disabled={submitting}
          />
        </div>
      </Container>
    </div>
  );
};

export default BillingCreation;
