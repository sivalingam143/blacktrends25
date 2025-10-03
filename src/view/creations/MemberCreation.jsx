import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { TextInputform } from "../../components/Forms";
import { Buttons } from "../../components/Buttons";
import NotifyData from "../../components/NotifyData";
import { fetchMembers, addMember, updateMember } from "../../slice/MemberSlice";

const MemberCreation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { member } = useSelector((s) => s.member);
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    gold_membership: "No",
  });
  const [submitting, setSubmitting] = useState(false);

  // load list (for edit lookup)
  useEffect(() => {
    dispatch(fetchMembers(""));
  }, [dispatch]);

  // pre-fill on edit
  useEffect(() => {
    if (isEdit && member.length) {
      const rec = member.find((m) => m.member_id === id);
      if (rec) {
        setForm({
          name: rec.name,
          phone: rec.phone,
          gold_membership: rec.gold_membership,
        });
      }
    }
  }, [id, member, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleGoldRadio = (e) => {
    setForm((p) => ({ ...p, gold_membership: e.target.value }));
  };

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);

    if (!form.name || !form.phone) {
      NotifyData("Required fields missing", "error");
      setSubmitting(false);
      return;
    }

    const payload = {
      ...form,
      ...(isEdit && { member_id: id }),
    };

    try {
      const action = isEdit ? updateMember(payload) : addMember(payload);
      const msg = await dispatch(action).unwrap();
      NotifyData(msg, "success");
      navigate("/member");
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
              formLabel="Name"
              PlaceHolder="Member name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputform
              formLabel="Phone"
              PlaceHolder="10-digit phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </Col>

          {/* Gold radio – appears in both create & edit */}
          <Col lg="4" md="6" xs="12" className="py-3 d-flex align-items-center">
            <div className="me-3">Gold Membership:</div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gold_membership"
                id="goldYes"
                value="Yes"
                checked={form.gold_membership === "Yes"}
                onChange={handleGoldRadio}
              />
              <label className="form-check-label" htmlFor="goldYes">
                Yes
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gold_membership"
                id="goldNo"
                value="No"
                checked={form.gold_membership === "No"}
                onChange={handleGoldRadio}
              />
              <label className="form-check-label" htmlFor="goldNo">
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
            onClick={() => navigate("/member")}
            disabled={submitting}
          />
        </div>
      </Container>
    </div>
  );
};

export default MemberCreation;
