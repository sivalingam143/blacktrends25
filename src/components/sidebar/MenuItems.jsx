import { MdOutlineHome } from "react-icons/md";
import { BiUserPlus } from "react-icons/bi";
import { BsFilePlus } from "react-icons/bs";
import { FaBuilding } from "react-icons/fa";

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
    submenu: [],
  },
];

export default MenuItems;
