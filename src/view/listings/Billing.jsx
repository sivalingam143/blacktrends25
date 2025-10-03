import React, { useEffect } from "react";
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
import { fetchBillings, deleteBilling } from "../../slice/BillingSlice";

const Billing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { billing } = useSelector((s) => s.billing);

  useEffect(() => {
    dispatch(fetchBillings(""));
  }, [dispatch]);

  const handleCreate = () => navigate("/billing/create");
  const handleEdit = (item) => navigate(`/billing/edit/${item.billing_id}`);

  const handleDelete = async (id) => {
    try {
      const msg = await dispatch(deleteBilling(id)).unwrap();
      NotifyData(msg, "success");
      dispatch(fetchBillings(""));
    } catch (e) {
      NotifyData(e.message, "error");
    }
  };

  // Table headers
  const headers = [
    "No",
    "Billing ID",
    "Date",
    "Member No",
    "Name",
    "Total",
    "Actions",
  ];

  // Table body
  const body = billing.map((item, idx) => ({
    key: item.billing_id,
    values: [
      idx + 1,
      item.billing_id,
      item.billing_date.split(" ")[0],
      item.member_no,
      item.name,
      `₹ ${parseFloat(item.total).toFixed(2)}`,
      <ActionButton
        options={[
          {
            label: "Edit",
            icon: <LiaEditSolid />,
            onClick: () => handleEdit(item),
          },
          {
            label: "Delete",
            icon: <MdOutlineDelete />,
            onClick: () => handleDelete(item.id),
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
            <PageTitle PageTitle="Billing" showButton={false} />
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
              noRecordMessage="No billings found"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Billing;
