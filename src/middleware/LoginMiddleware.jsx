import NotifyData from "../components/NotifyData";
const LoginMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type === "auth/loginUser/fulfilled") {
  } else if (action.type === "auth/loginUser/rejected") {
    NotifyData("Invalid users");
  }
  if (action.type === "auth/logoutUser/fulfilled") {
  }
  return result;
};
export default LoginMiddleware;
