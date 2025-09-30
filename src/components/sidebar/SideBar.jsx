import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { RxDash } from "react-icons/rx";
import { Collapse } from "react-bootstrap";
import "./sidebar.css";
import MenuItems from "./MenuItems";
import "./MobileDevice.css";

const Sidebar = () => {
  const [open, setOpen] = useState(null);

  const toggleSubMenu = (index) => {
    setOpen(open === index ? null : index);
  };
  const handleSideBar = () => {
    document.body.classList.remove("toggle-sidebar");
  };
  return (
    <aside id="side-bar" className="side-bar">
      <div>
        <div className="side-bar-header text-center">
          <img
            src={require("../../assets/images/storelogo.png")}
            className="img-fluid org-logo"
            alt="Black Trends"
          />
        </div>
      </div>

      <div className="list-group">
        <ul>
          {MenuItems.map((item, index) => (
            <li key={index} onClick={handleSideBar}>
              <NavLink
                to={item.path}
                className="nav-link"
                onClick={(e) => {
                  if (item.submenu) {
                    e.preventDefault();
                    toggleSubMenu(index);
                  }
                }}
              >
                <span className="list-icon">{item.icon}</span>
                <span className="list-text">{item.text}</span>
                {item.submenu && (
                  <span className="arrow-icon">
                    {open === index ? (
                      <MdKeyboardArrowDown />
                    ) : (
                      <MdKeyboardArrowRight />
                    )}
                  </span>
                )}
              </NavLink>
              {item.submenu && (
                <Collapse in={open === index}>
                  <ul className="submenu-list">
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <NavLink to={subItem.path} className="nav-link">
                          <span className="list-icon">
                            <RxDash />
                          </span>
                          <span className="list-text">{subItem.text}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </Collapse>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
