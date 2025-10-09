import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ActionButton, Buttons } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { HiOutlineDotsVertical } from "react-icons/hi";
import PageTitle from "../../components/PageTitle";
import NotifyData from "../../components/NotifyData";
import TableUI from "../../components/TableUI";
import { fetchStaff, deleteStaff } from "../../slice/StaffSlice";

const Staff = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { staff } = useSelector((state) => state.staff);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchStaff(""));
  }, [dispatch]);

  const handleCreate = () => {
    navigate("/staff/create");
  };

  const handleEdit = (staffItem) => {
    navigate(`/staff/edit/${staffItem.staff_id}`);
  };

  const handleDelete = async (staffId) => {
    try {
      const msg = await dispatch(deleteStaff(staffId)).unwrap();
      NotifyData(msg, "success");
      dispatch(fetchStaff(""));
    } catch (error) {
      NotifyData(error.message, "error");
    }
  };

  const filteredStaff = staff.filter(
    (staffItem) =>
      (staffItem.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(staffItem.phone || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (staffItem.address || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Table headers
  const headers = ["No", "Name", "Phone", "Address"];

  // Table body
  const body = filteredStaff.map((staffItem, index) => ({
    key: staffItem.staff_id,
    values: [
      index + 1,
      staffItem.name,
      staffItem.phone,
      staffItem.address || "-",
      <ActionButton
        options={[
          {
            label: "Edit",
            icon: <LiaEditSolid />,
            onClick: () => handleEdit(staffItem),
          },
          {
            label: "Delete",
            icon: <MdOutlineDelete />,
            onClick: () => handleDelete(staffItem.id),
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
            <PageTitle PageTitle="Staff" showButton={false} />
          </Col>
          <Col xs="6" className="py-3 text-end">
            <Buttons
              btnlabel="Add New"
              className="add-btn"
              onClick={handleCreate}
            />
          </Col>
          <Col xs="12" lg="3" className="py-2">
            <input
              type="text"
              placeholder="Search by name, phone, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </Col>
          <Col xs="12" className="py-3">
            <TableUI
              headers={headers}
              body={body}
              className="table"
              showActionColumn={true}
              noRecordMessage="No staff found"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Staff;
