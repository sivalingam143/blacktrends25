import DashBoard from "../view/listings/DashBoard";
import User from "../view/listings/User";
import Company from "../view/listings/Company";
import Member from "../view/listings/Member";
import Staff from "../view/listings/Staff";
import CompanyCreation from "../view/creations/CompanyCreation";
import MemberCreation from "../view/creations/MemberCreation";
import StaffCreation from "../view/creations/StaffCreation";
import Login from "../view/Login";

const routes = [
  { path: "/", component: Login },
  { path: "/dashboard", component: DashBoard },
  { path: "/users", component: User },

  // ---- company routes ----
  { path: "/company", component: Company },
  { path: "/company/create", component: CompanyCreation },
  { path: "/company/edit/:id", component: CompanyCreation },

  // ---- member routes ----
  { path: "/member", component: Member },
  { path: "/member/create", component: MemberCreation },
  { path: "/member/edit/:id", component: MemberCreation },

  // <-- new staff routes
  { path: "/staff", component: Staff },
  { path: "/staff/create", component: StaffCreation },
  { path: "/staff/edit/:id", component: StaffCreation },
];

export default routes;
