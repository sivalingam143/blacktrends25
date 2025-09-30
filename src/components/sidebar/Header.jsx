import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { MdFormatAlignLeft } from "react-icons/md";
import { Buttons, ActionButton } from "../Buttons";
import { MdLogout } from "react-icons/md";
// import { TbUserSquare } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Dialog from "../Dialog";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../services/LoginService";

import { HiOutlineUser } from "react-icons/hi";
const Header = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  const handleClose = () => {
    setShowConfirmDialog(true);
  };
  const handleLogout = (confirm) => {
    setShowConfirmDialog(false);
    if (confirm) {
      dispatch(logoutUser())
        .then(() => {
          console.log("Logged out successfully");
          Navigate("/");
        })
        .catch((error) => {
          console.error("Logout failed:", error);
          alert(error);
        });
      console.log("logout Success");
    }
  };
  const options = [
    { label: "Logout", icon: <MdLogout size={20} />, onClick: handleClose },
  ];
  const handleSideBar = () => {
    console.log("Sidebar toggle triggered");
    document.body.classList.toggle("toggle-sidebar");
  };

  return (
    <>
      <Navbar expand="sm" className="bg-body-tertiary pos-fixed top-navbar">
        <Container fluid className="head_pad">
          <Buttons
            className="action-btn"
            btnlabel={
              <>
                <MdFormatAlignLeft size={25} />
              </>
            }
            onClick={handleSideBar} // Correctly pass the handleSideBar function here
          />

          <Navbar.Collapse id="admin-nav">
            <Nav className="ms-auto">
              <div className="profile d-flex align-items-center">
                <ActionButton
                  label={
                    <>
                      <span className="mx-2">
                        <HiOutlineUser size={22} />
                      </span>
                      <span className="mx-1">{username || "Guest"}</span>
                    </>
                  }
                  options={options}
                />
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <>
        <Dialog
          DialogTitle="Are you sure you want to logout?"
          isVisible={showConfirmDialog}
          onConfirm={handleLogout}
          onCancel={() => handleLogout(false)}
        />
      </>
    </>
  );
};

export default Header;
