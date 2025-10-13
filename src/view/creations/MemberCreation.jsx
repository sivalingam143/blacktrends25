import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { TextInputform } from "../../components/Forms";
import { Buttons } from "../../components/Buttons";
import NotifyData from "../../components/NotifyData";
import { fetchMembers, addMember, updateMember } from "../../slice/MemberSlice";
import GoldConfirmModal from "../../components/GoldConfirmModal";

const MemberCreation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { member } = useSelector((s) => s.member);
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    membership: "No",
  });
  const [submitting, setSubmitting] = useState(false);

  // Flag to track if expired warning has been shown (to avoid duplicates)
  const hasShownExpiredWarning = useRef(false);

  // Modal state for gold confirmation
  const [showGoldModal, setShowGoldModal] = useState(false);
  const [pendingGold, setPendingGold] = useState(null);

  // load list (for edit lookup)
  useEffect(() => {
    dispatch(fetchMembers(""));
  }, [dispatch]);

  // pre-fill on edit - keep original membership, even if expired
  useEffect(() => {
    if (isEdit && member.length && !hasShownExpiredWarning.current) {
      const rec = member.find((m) => m.member_id === id);
      if (rec) {
        setForm({
          name: rec.name,
          phone: rec.phone,
          membership: rec.membership, // Keep as is (Yes even if expired)
        });
        if (rec.is_expired === "expired" && !hasShownExpiredWarning.current) {
          NotifyData(
            `${rec.name}'s Gold membership expired. You can renew or downgrade.`,
            "warning"
          );
          hasShownExpiredWarning.current = true; // Set flag to prevent duplicates
        }
      }
    }
  }, [id, member, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleGoldRadio = (e) => {
    const newVal = e.target.value;
    if (newVal === form.membership) return;

    // Block downgrade if not expired
    if (isEdit && form.membership === "Yes" && newVal === "No") {
      const rec = member.find((m) => m.member_id === id);
      if (rec && rec.is_expired !== "expired") {
        NotifyData(
          "Cannot downgrade Gold membership before 1 year expiry",
          "error"
        );
        return;
      }
    }

    // Show confirmation modal
    setPendingGold(newVal);
    setShowGoldModal(true);
  };

  const confirmGoldChange = () => {
    if (pendingGold !== null) {
      setForm((p) => ({ ...p, membership: pendingGold }));
    }
    setShowGoldModal(false);
    setPendingGold(null);
  };

  const cancelGoldChange = () => {
    setShowGoldModal(false);
    setPendingGold(null);
    // No change on cancel
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

  const memberDisplayName =
    form.name || (isEdit ? "this member" : "New Member");
  const wantYes = pendingGold === "Yes";

  // Get current rec for disable
  const currentRec = isEdit ? member.find((m) => m.member_id === id) : null;
  const isActiveGold =
    currentRec?.membership === "Yes" && currentRec?.is_expired !== "expired";

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

          {/* Gold radio */}
          <Col lg="4" md="6" xs="12" className="py-3 d-flex align-items-center">
            <div className="me-3">Gold Membership:</div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="membership"
                id="goldYes"
                value="Yes"
                checked={form.membership === "Yes"}
                onChange={handleGoldRadio}
                disabled={isActiveGold}
              />
              <label className="form-check-label" htmlFor="goldYes">
                Yes
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="membership"
                id="goldNo"
                value="No"
                checked={form.membership === "No"}
                onChange={handleGoldRadio}
                disabled={isActiveGold}
              />
              <label className="form-check-label" htmlFor="goldNo">
                No {isActiveGold && "(Locked until expiry)"}
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
            disabled={
              submitting ||
              (isEdit && isActiveGold && form.membership === "Yes")
            } // Allow submit if changing to No (expired) or Yes (new)
          />
          <Buttons
            btnlabel="Cancel"
            className="border-0 add-btn"
            onClick={() => navigate("/member")}
            disabled={submitting}
          />
        </div>
      </Container>

      {/* Confirmation modal for gold change - pass isExpired if needed */}
      <GoldConfirmModal
        show={showGoldModal}
        onHide={cancelGoldChange}
        memberName={memberDisplayName}
        wantYes={wantYes}
        isExpired={currentRec?.is_expired === "expired"}
        onConfirm={confirmGoldChange}
      />
    </div>
  );
};

export default MemberCreation;
