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
import { fetchCompanies, deleteCompany } from "../../slice/CompanySlice";

const Company = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { company } = useSelector((state) => state.company);

  useEffect(() => {
    dispatch(fetchCompanies(""));
  }, [dispatch]);

  const handleCreate = () => {
    navigate("/company/create");
  };

  const handleEdit = (companyItem) => {
    navigate(`/company/edit/${companyItem.company_id}`);
  };

  const handleDelete = async (companyId) => {
    try {
      const msg = await dispatch(deleteCompany(companyId)).unwrap();
      NotifyData(msg, "success");
      dispatch(fetchCompanies(""));
    } catch (error) {
      NotifyData(error.message, "error");
    }
  };

  // Table headers
  const headers = ["No", "Company Name", "Contact Number", "GSTIN", "Actions"];

  // Table body
  const body = company.map((companyItem, index) => ({
    key: companyItem.company_id,
    values: [
      index + 1,
      companyItem.Company_Name,
      companyItem.Contact_Number,
      companyItem.GSTIN || "-",
      <ActionButton
        options={[
          {
            label: "Edit",
            icon: <LiaEditSolid />,
            onClick: () => handleEdit(companyItem),
          },
          {
            label: "Delete",
            icon: <MdOutlineDelete />,
            onClick: () => handleDelete(companyItem.id),
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
            <PageTitle PageTitle="Company" showButton={false} />
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
              noRecordMessage="No companies found"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Company;
