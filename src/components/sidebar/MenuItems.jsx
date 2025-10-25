import { MdOutlineHome } from "react-icons/md";
import { BiUserPlus } from "react-icons/bi";
import { BsFilePlus } from "react-icons/bs";
import { FaBuilding } from "react-icons/fa";
import { FaFileInvoice } from "react-icons/fa";


const MenuItems = [
  {
    path: "/dashboard",
    text: "Dashboard",
    icon: <MdOutlineHome />,
    roles: ["Admin"], // only Admin
  },
  {
    path: "/users",
    text: "Users",
    icon: <BiUserPlus />,
    roles: ["Admin"], // only Admin
  },
  {
    path: "/company",
    text: "Company",
    icon: <FaBuilding />,
    roles: ["Admin"], // only Admin
  },
  {
    path: "/master/category",
    text: "Master",
    icon: <BsFilePlus />,
    roles: ["Admin","Staff"], // visible to both
    submenu: [
      { path: "/staff", text: "Staff", roles: ["Admin"] },
      { path: "/member", text: "Members", roles: ["Admin", "Staff"] },
      { path: "/category", text: "Category", roles: ["Admin"] },
      { path: "/productandservice", text: "Product & Service", roles: ["Admin"] },
    ],
  },
  {
    path: "/billing",
    text: "Billing",
    icon: <FaFileInvoice />,
    roles: ["Admin", "Staff"], // visible to both
  },
];


export default MenuItems;
