import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import TableUI from "../../components/TableUI";
import { ActionButton, Buttons } from "../../components/Buttons";
import { MdOutlineDelete } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../slice/UserSlice";
import { TbCircleLetterI } from "react-icons/tb";
import CustomModal from "../../components/Modal";
import NotifyData from "../../components/NotifyData";
import { HiOutlineDotsVertical } from "react-icons/hi";
import PageTitle from "../../components/PageTitle";
import UserCreation from "../creations/UserCreation";
const User = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);
  console.log({ users, status, error });

  console.log(users);
  const userSchema = [
    { name: "Name", label: "Name", type: "text", required: true },
    {
      name: "Mobile_Number",
      label: "Mobile Number",
      type: "text",
      required: true,
    },
    {
      name: "Password",
      label: "Password",
      type: "password",
      required: true,
      classname: "form-control-padright",
    },
  ];

  const [formData, setFormData] = useState({
    Name: "",
    Mobile_Number: "",
    Password: "",
  });

  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  console.log(formData);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEdit = (user) => {
    setEditMode(true);
    setSelectedUser(user || {}); // Fallback to an empty object
    setFormData({
      Name: user?.Name || "", // Use optional chaining with a default value
      Mobile_Number: user?.Mobile_Number || "",
      Password: user?.Password || "",
    });
    handleOpen();
  };

  const handleCreate = () => {
    setEditMode(false);
    setFormData({});
    handleOpen();
  };

  const handleSubmit = async () => {
    console.log("EditMode:", editMode);
    console.log("Selected User ID:", selectedUser?.id || "N/A");
    console.log("Form Data being dispatched:", formData || {});

    if (editMode) {
      if (!selectedUser?.id) {
        console.error("No user selected for editing.");
        NotifyData("User Update Failed: No user selected", "error");
        return;
      }

      if (!formData?.Name || !formData?.Mobile_Number) {
        console.error("Incomplete form data:", formData);
        NotifyData("User Update Failed: Incomplete data", "error");
        return;
      }
      console.log("updatedresponse", formData?.Name);
      try {
        const result = await dispatch(
          updateUser({
            id: selectedUser?.id,
            Name: formData.Name,
            Mobile_Number: formData.Mobile_Number,
            Password: formData.Password,
          })
        ).unwrap();

        console.log("API Response:", result);
        NotifyData("User Updated Successfully", "success");
      } catch (error) {
        console.error("Error updating user:", error);
        NotifyData("User Update Failed", "error");
      }
    } else {
      if (!formData?.Name || !formData?.Mobile_Number) {
        console.error("Incomplete form data:", formData);
        NotifyData("User Creation Failed: Incomplete data", "error");
        return;
      }

      try {
        await dispatch(addUser(formData)).unwrap();
        NotifyData("User Created Successfully", "success");
      } catch (error) {
        console.error("Error creating user:", error);
        NotifyData("User Creation Failed", "error");
      }
    }

    handleClose();
    setFormData({ Name: "", Mobile_Number: "", Password: "" });
    setEditMode(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteUser(id)).unwrap();
    NotifyData("User Deleted Successfully", "success");
  };

  const filteredUsers =
    users?.filter((user) =>
      user?.Name?.toLowerCase()?.includes(searchTerm.toLowerCase())
    ) || [];

  const RoleHead = ["No", "Name", "Mobile Number"];
  const RoleData =
    filteredUsers?.length > 0
      ? filteredUsers.map((user, index) => ({
          values: [
            index + 1,
            user.Name,
            user.Mobile_Number,
            <ActionButton
              options={[
                {
                  label: "Edit",
                  icon: <TbCircleLetterI />,
                  onClick: () => handleEdit(user),
                },
                {
                  label: "Delete",
                  icon: <MdOutlineDelete />,
                  onClick: () => handleDelete(user.id),
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
            <PageTitle PageTitle="User" showButton={false} />
          </Col>
          <Col xs="6" className="py-3 text-end">
            <Buttons
              btnlabel="Add New"
              className="add-btn"
              onClick={handleCreate}
            />
          </Col>
          <Col xs="12" className="py-3">
            <TableUI headers={RoleHead} body={RoleData} />
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={show}
        setShow={setShow}
        pageTitle={editMode ? <>Edit User</> : <>Create User</>}
        showButton={true}
        submitButton={true}
        submitLabel={editMode ? <>Update</> : <>Submit</>}
        CancelLabel="Cancel"
        BodyComponent={
          <>
            <UserCreation
              formData={formData}
              setFormData={setFormData}
              schema={userSchema}
            />
          </>
        }
        OnClick={handleSubmit}
        Size="md"
        handleOpen={handleOpen}
        handleClose={handleClose}
      />
    </div>
  );
};

export default User;
