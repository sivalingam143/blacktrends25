import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { TextInputform } from "../components/Forms";
import { Buttons } from "../components/Buttons";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormHandle from "../hooks/FormHandleHelper";
import NotifyData from "../components/NotifyData";
import { loginUser } from "../services/LoginService";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialValues = { email: "", password: "" };
  const [formData, handleChange] = FormHandle(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      NotifyData("Please enter email and password.", "error");
      return;
    }

    try {
      const response = await dispatch(loginUser(formData));

      if (response?.meta?.requestStatus === "fulfilled") {
        NotifyData("Login Success", "success");
        navigate("/dashboard");
      } else {
        NotifyData(response?.payload || "Invalid email or password", "error");
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      NotifyData("Something went wrong. Please try again later.", "error");
    }
  };
  return (
    <>
      <section className="pad_120">
        <Container>
          <Row className="justify-content-center">
            <Col lg="8" md="8" xs="12" className="align-self-center">
              <div id="login-box">
                <Row>
                  <Col sm="6" xs={12} className="py-3 align-self-center">
                    <img
                      src={require("../assets/images/storelogo.png")}
                      className="img-fluid"
                      alt="General Name"
                    />
                  </Col>
                  <Col sm="6" xs={12} className="align-self-center">
                    <div className="login-box-body">
                      <h3 className="fw-bold bold">Login</h3>
                      <div>Welcome back to Your Special Place</div>
                    </div>
                    <div className="py-3">
                      <TextInputform
                        PlaceHolder="Enter Your Mobile Number"
                        formLabel="Enter Your Mobile Number"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="py-3">
                      <TextInputform
                        formLabel="Password"
                        PlaceHolder="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        classname="form-control-padright"
                        formtype={showPassword ? "text" : "password"}
                        suffix_icon={
                          <>
                            {showPassword ? (
                              <VscEye onClick={togglePasswordVisibility} />
                            ) : (
                              <VscEyeClosed
                                onClick={togglePasswordVisibility}
                              />
                            )}
                          </>
                        }
                      />
                    </div>

                    <div className="py-3">
                      <Buttons
                        btnlabel="Submit"
                        className="submit-btn w-100"
                        onClick={handleLogin}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Login;
