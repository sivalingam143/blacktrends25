import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Buttons, ActionButton } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { HiOutlineDotsVertical } from "react-icons/hi";
import * as XLSX from "xlsx";
import PageTitle from "../../components/PageTitle";
import NotifyData from "../../components/NotifyData";
import TableUI from "../../components/TableUI";
import { DropDown } from "../../components/Forms";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [membershipFilter, setMembershipFilter] = useState("");
  const [Role, setRole] = useState("");
  const [extraDiscountFilter, setExtraDiscountFilter] = useState("All");

  // modal state
  const [showGoldModal, setShowGoldModal] = React.useState(false);
  const [pendingMember, setPendingMember] = React.useState(null);

  useEffect(() => {
    dispatch(fetchMembers(""));
    const storedRole = sessionStorage.getItem("Role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, [dispatch]);



  const handleCreate = () => navigate("/member/create");

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const [year, month, day] = dateStr.split(" ")[0].split("-");
    return `${day}-${month}-${year}`;
  };

  // New function to calculate days left until expiry
  const calculateDaysLeft = (activatedAt) => {
    if (!activatedAt) return 0;
    const activatedDate = new Date(activatedAt);
    const expiryDate = new Date(activatedDate);
    expiryDate.setFullYear(activatedDate.getFullYear() + 1);
    const now = new Date(); // Current date: Oct 13, 2025
    const diffTime = expiryDate - now;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleExport = () => {
    const wsData = [
      [
        "S.No",
        "Member No",
        "Name",
        "Phone",
        "Membership",
        "Status", // Status column with days
        "Last Visit Date",
        "Total Visit Count",
        "Total Spending",
      ], // headers
      ...filteredMember.map((m, index) => {
        let statusText = "-";
        if (m.membership === "Yes") {
          const daysLeft = calculateDaysLeft(m.membership_activated_at);
          if (m.is_expired === "expired") {
            statusText = "Expired - Renew?";
          } else {
            statusText = `Expires in ${daysLeft} days`;
          }
        }
        return [
          index + 1,
          m.member_no,
          m.name,
          m.phone,
          m.membership,
          statusText,
          formatDate(m.last_visit_date),
          m.total_visit_count,
          m.total_spending,
        ];
      }),
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Members");
    XLSX.writeFile(
      wb,
      `Members_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };
const extraDiscountOptions = [
  { value: "All", label: "All" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];
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
    const isExpired = member.is_expired === "expired";
    if (member.membership === "Yes" && !isExpired) {
      NotifyData("Cannot change Gold membership until 1 year expiry", "error");
      return; // Block if active Yes
    }
    const wantYes = !isExpired ? member.membership !== "Yes" : true; // For expired Yes, default to renew (Yes)
    setPendingMember({ ...member, wantYes, isExpired });
    setShowGoldModal(true);
  };

  const confirmGold = async () => {
    if (!pendingMember) return;
    try {
      const { isExpired, wantYes } = pendingMember;
      const msg = await dispatch(
        toggleGold({
          member_id: pendingMember.member_id,
          makeGold: wantYes,
        })
      ).unwrap();
      NotifyData(
        isExpired && wantYes
          ? "Membership renewed!"
          : "Gold membership updated",
        "success"
      );
      setShowGoldModal(false);
      dispatch(fetchMembers("")); // Refresh list
    } catch (e) {
      NotifyData(e.message, "error");
    }
  };

  const membershipOptions = [
    { value: "All", label: "All" },
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  // const filteredMember = member.filter((m) => {
  //   const nameMatch = (m.name || "")
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase());
  //   const phoneMatch = String(m.phone || "")
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase());
  //   const membershipMatch =
  //     !membershipFilter ||
  //     membershipFilter === "All" ||
  //     m.membership === membershipFilter;
  //   return (nameMatch || phoneMatch) && membershipMatch;
  // });
  const filteredMember = member.filter((m) => {
  const nameMatch = (m.name || "")
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
  const phoneMatch = String(m.phone || "")
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const membershipMatch =
    !membershipFilter || membershipFilter === "All" || m.membership === membershipFilter;

  const extraDiscountMatch =
    !extraDiscountFilter || extraDiscountFilter === "All" ||
    (extraDiscountFilter === "Yes" && m.extra_milestone_customer === 1) ||
    (extraDiscountFilter === "No" && m.extra_milestone_customer === 0);

  return (nameMatch || phoneMatch) && membershipMatch && extraDiscountMatch;
});


  // ---------- table ----------
  const headers = ["No", "Name", "Phone", "Membership", "Status"]; // Status column
  const body = filteredMember.map((m, idx) => {
    const isExpired = m.is_expired === "expired";
    const isActiveGold = m.membership === "Yes" && !isExpired;
    let statusDisplay = "-";
    if (m.membership === "Yes") {
      if (isExpired) {
        statusDisplay = (
          <span
            className="blink expired"
            style={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Expired - Renew?
          </span>
        );
      } else {
        const daysLeft = calculateDaysLeft(m.membership_activated_at);
        statusDisplay = `Expires in ${daysLeft} days`;
      }
    }
    const membershipDisplay = (
      <div
        key={m.member_id}
        className={`form-check form-switch ${isActiveGold ? "disabled-toggle" : ""
          }`}
        onClick={() => openGoldModal(m)}
        style={{ cursor: isActiveGold ? "not-allowed" : "pointer" }}
      >
        <input
          className="form-check-input"
          type="checkbox"
          checked={m.membership === "Yes"}
          readOnly
          disabled={isActiveGold}
        />
        <label
          className={`form-check-label ${isActiveGold ? "text-muted" : ""}`}
        >
          {m.membership} {isActiveGold && "(Locked until expiry)"}
        </label>
      </div>
    );
    return {
      key: m.member_id,
      values: [
        idx + 1,
        m.name,
        m.phone,
        membershipDisplay,
        statusDisplay, // Dynamic status
        <ActionButton
          options={[

            {
              label: Role === "Admin" ? "Edit" : "View",
              icon: <LiaEditSolid />,
              onClick: () => handleEdit(m),
            },
            ...(Role === "Admin" // Only include Delete if role is Admin
              ? [
                {
                  label: "Delete",
                  icon: <MdOutlineDelete />,
                  onClick: () => handleDelete(m.id),
                },
              ]
              : []),
          ]}
          label={<HiOutlineDotsVertical />}
        />,
      ],
    };
  });

  return (
    <div id="main">
      <style>{`
        .blink {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0% { opacity: 1; color: red; }
          50% { opacity: 0.5; color: orange; }
          100% { opacity: 1; color: red; }
        }
        .expired {
          font-weight: bold;
          text-decoration: underline;
        }
        .disabled-toggle {
          opacity: 0.6;
          pointer-events: none;
        }
      `}</style>
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
            {Role === "Admin" && (
              <>
                <Buttons
                  btnlabel="Download Excel"
                  className="add-btn ms-2"
                  onClick={handleExport}
                />
              </>
            )}
          </Col>
          <Col xs="12" lg="3" className="py-2">
            <div className="d-flex gap-2">
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control flex-grow-1"
              />
            </div>
          </Col>
          <Col xs="12" lg="3" className="py-2">
            <DropDown
              placeholder="Membership"
              value={membershipFilter}
              onChange={(e) => setMembershipFilter(e.target.value)}
              options={membershipOptions}
             
            />
          </Col>
          <Col xs="12" lg="3" className="py-2">
            <DropDown
              placeholder="Extra Discount"
              value={extraDiscountFilter}
              onChange={(e) => setExtraDiscountFilter(e.target.value)}
              options={extraDiscountOptions}
              width="150px"
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
        isExpired={pendingMember?.isExpired}
        onConfirm={confirmGold}
      />
    </div>
  );
};

export default Member;
