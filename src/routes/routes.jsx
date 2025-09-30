import DashBoard from "../view/listings/DashBoard";
import User from "../view/listings/User";
import Company from "../view/listings/Company";
import Login from "../view/Login";

const routes = [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/dashboard",
    component: DashBoard,
  },
  {
    path: "/users",
    component: User,
  },
  {
    path: "/company",
    component: Company,
  },
];

export default routes;
