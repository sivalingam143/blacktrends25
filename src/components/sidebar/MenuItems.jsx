import { MdOutlineHome } from "react-icons/md";
import { BiUserPlus } from "react-icons/bi";
import { BsFilePlus } from "react-icons/bs";
import { FaBuilding, FaUsers, FaUserTie, FaBox } from "react-icons/fa";

const MenuItems = [
  {
    path: "/dashboard",
    text: "Dashboard",
    icon: <MdOutlineHome />,
  },
  {
    path: "/users",
    text: "Users",
    icon: <BiUserPlus />,
  },
  {
    path: "/company",
    text: "Company",
    icon: <FaBuilding />,
  },

  {
    path: "/master/category",
    text: "Master",
    icon: <BsFilePlus />,
    submenu: [
      {
        path: "/member",
        text: "Members",
        icon: <FaUsers />,
      },
      {
        path: "/staff",
        text: "Staff",
        icon: <FaUserTie />,
      },
      {
        path: "/productandservice",
        text: "Product & Service",
        icon: <FaBox />,
      },
    ],
  },
];

export default MenuItems;
