import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Buttons, ActionButton } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { HiOutlineDotsVertical } from "react-icons/hi";
import PageTitle from "../../components/PageTitle";
import NotifyData from "../../components/NotifyData";
import TableUI from "../../components/TableUI";
import {
  fetchMembers,
  deleteMember,
  toggleGold,
} from "../../slice/MemberSlice";
import GoldConfirmModal from "../../components/GoldConfirmModal";

const Member = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { member, status } = useSelector((s) => s.member);

  // modal state
  const [showGoldModal, setShowGoldModal] = React.useState(false);
  const [pendingMember, setPendingMember] = React.useState(null);

  useEffect(() => {
    dispatch(fetchMembers(""));
  }, [dispatch]);

  const handleCreate = () => navigate("/member/create");
  const handleEdit = (m) => navigate(`/member/edit/${m.member_id}`);

  const handleDelete = async (id) => {
    try {
      const msg = await dispatch(deleteMember(id)).unwrap();
      NotifyData(msg, "success");
      dispatch(fetchMembers(""));
    } catch (e) {
      NotifyData(e.message, "error");
    }
  };

  const openGoldModal = (member) => {
    const wantYes = member.membership !== "Yes";
    setPendingMember({ ...member, wantYes });
    setShowGoldModal(true);
  };

  const confirmGold = async () => {
    if (!pendingMember) return;
    try {
      const msg = await dispatch(
        toggleGold({
          member_id: pendingMember.member_id,
          makeGold: pendingMember.wantYes,
        })
      ).unwrap();
      NotifyData("Gold membership updated", "success");
      setShowGoldModal(false);
    } catch (e) {
      NotifyData(e.message, "error");
    }
  };

  // ---------- table ----------
  const headers = ["No", "Name", "Phone", "Gold"];
  const body = member.map((m, idx) => ({
    key: m.member_id,
    values: [
      idx + 1,
      m.name,
      m.phone,
      <div
        key={m.member_id}
        className="form-check form-switch"
        onClick={() => openGoldModal(m)}
        style={{ cursor: "pointer" }}
      >
        <input
          className="form-check-input"
          type="checkbox"
          checked={m.membership === "Yes"}
          readOnly
        />
        <label className="form-check-label">
          {m.membership === "Yes" ? "Yes" : "No"}
        </label>
      </div>,
      <ActionButton
        options={[
          {
            label: "Edit",
            icon: <LiaEditSolid />,
            onClick: () => handleEdit(m),
          },
          {
            label: "Delete",
            icon: <MdOutlineDelete />,
            onClick: () => handleDelete(m.id),
          },
        ]}
        label={<HiOutlineDotsVertical />}
      />,
    ],
  }));

  return (
    <div id="main">
      <Container fluid>
        <Row>
          <Col xs="6" className="py-3">
            <PageTitle PageTitle="Members" showButton={false} />
          </Col>
          <Col xs="6" className="py-3 text-end">
            <Buttons
              btnlabel="Add New"
              className="add-btn"
              onClick={handleCreate}
            />
          </Col>

          <Col xs="12" className="py-3">
            <TableUI
              headers={headers}
              body={body}
              className="table"
              showActionColumn={true}
              noRecordMessage="No members found"
            />
          </Col>
        </Row>
      </Container>

      {/* Confirmation modal */}
      <GoldConfirmModal
        show={showGoldModal}
        onHide={() => setShowGoldModal(false)}
        memberName={pendingMember?.name}
        wantYes={pendingMember?.wantYes}
        onConfirm={confirmGold}
      />
    </div>
  );
};

export default Member;
