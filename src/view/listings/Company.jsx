import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import TableUI from "../../components/TableUI";
import { ActionButton, Buttons } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { TbCircleLetterI } from "react-icons/tb";

import { HiOutlineDotsVertical } from "react-icons/hi";
import PageTitle from "../../components/PageTitle";
import CompanyCreation from "../creations/CompanyCreation";
import CustomModal from "../../components/Modal";
import NotifyData from "../../components/NotifyData";

const Company = () => {
  const dispatch = useDispatch();
  const { company, status, error } = useSelector((state) => {
    console.log("Redux State:", state);
    return state.company || { company: [], status: "idle", error: null };
  });
  console.log({ company, status, error });

  const companySchema = [
    { name: "Name", label: "Company Name", type: "text", required: true },
    { name: "Location", label: "Location", type: "text", required: true },
    { name: "Contact", label: "Contact", type: "text", required: true },
  ];

  const [formData, setFormData] = useState({
    Name: "",
    Location: "",
    Contact: "",
  });
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleEdit = (company) => {
    setEditMode(true);
    setSelectedCompany(company || {});
    setFormData({
      Name: company?.Name || "",
      Location: company?.Location || "",
      Contact: company?.Contact || "",
    });
    handleOpen();
  };

  const handleCreate = () => {
    setEditMode(false);
    setFormData({ Name: "", Location: "", Contact: "" });
    handleOpen();
  };

  const filteredcompany =
    company?.filter((company) =>
      company?.Name?.toLowerCase()?.includes(searchTerm.toLowerCase())
    ) || [];

  const CompanyHead = ["No", "Company Name", "Location", "Contact", "Action"];
  const CompanyData =
    filteredcompany?.length > 0
      ? filteredcompany.map((company, index) => ({
          values: [
            index + 1,
            company.Name,
            company.Location,
            company.Contact,
            <ActionButton
              options={[
                {
                  label: "Edit",
                  icon: <TbCircleLetterI />,
                  onClick: () => handleEdit(company),
                },
              ]}
              label={<HiOutlineDotsVertical />}
            />,
          ],
        }))
      : [];

  return (
    <div id="main">
      <Container>
        <Row>
          <Col xs="6" className="py-3">
            <PageTitle PageTitle="company" showButton={false} />
          </Col>
          <Col xs="6" className="py-3 text-end">
            <Buttons
              btnlabel="Add New"
              className="submit-btn"
              onClick={handleCreate}
            />
          </Col>
          <Col xs="12" className="py-3">
            <TableUI headers={CompanyHead} body={CompanyData} />
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={show}
        setShow={setShow}
        pageTitle={editMode ? <>Edit Company</> : <>Create Company</>}
        showButton={true}
        submitButton={true}
        submitLabel={editMode ? <>Update</> : <>Submit</>}
        CancelLabel="Cancel"
        BodyComponent={
          <CompanyCreation
            formData={formData}
            setFormData={setFormData}
            schema={companySchema}
          />
        }
        Size="md"
        handleOpen={handleOpen}
        handleClose={handleClose}
      />
    </div>
  );
};

export default Company;
