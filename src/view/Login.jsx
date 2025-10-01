import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { TextInputform } from "../components/Forms";
import { Buttons } from "../components/Buttons";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormHandle from "../hooks/FormHandleHelper";
import NotifyData from "../components/NotifyData";
import { loginUser } from "../services/LoginService";
import "./login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, handleChange] = FormHandle({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => setIsLoaded(true), []);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

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
    } catch {
      NotifyData("Something went wrong. Please try again later.", "error");
    }
  };

  return (
    <section
      className={`login-section pad_120 d-flex align-items-center min-vh-100 overflow-hidden ${
        isLoaded ? "loaded" : ""
      }`}
    >
      <div className="overlay" />
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              "--delay": `${Math.random() * 5}s`,
              "--duration": `${Math.random() * 10 + 5}s`,
              "--size": `${Math.random() * 4 + 2}px`,
            }}
          />
        ))}
      </div>
      <Container className="position-relative">
        <Row className="justify-content-center">
          <Col lg="10">
            <Card
              className={`shadow-2xl border-0 rounded-5 overflow-hidden login-card-ultra ${
                isLoaded ? "fade-in" : ""
              }`}
            >
              <Row className="g-0">
                <Col
                  lg="5"
                  className="d-none d-lg-block bg-gradient-salon position-relative"
                >
                  <div className="position-absolute top-50 start-50 translate-middle text-white text-center px-4 animate-glow">
                    <div className="logo-container mb-4">
                      <img
                        src={require("../assets/images/storelogo.png")}
                        className="img-fluid rounded-5 shadow-2xl logo-img"
                        alt="Saloon Logo"
                      />
                    </div>
                    <h2 className="fw-bold mb-3 neon-text">
                      Welcome to Elegance
                    </h2>
                    <p className="lead opacity-95">Saloon Billing Portal</p>
                    <div className="salon-icons mt-3">
                      <i className="fas fa-cut me-2"></i>
                      <i className="fas fa-paint-brush me-2"></i>
                      <i className="fas fa-spa"></i>
                    </div>
                  </div>
                </Col>
                <Col lg="7" xs="12">
                  <div className="card-body p-5">
                    <div className="text-center mb-5 fade-in-up">
                      <h3 className="fw-bold text-dark mb-3 display-5 saloon-header">
                        Login
                      </h3>
                      <p className="text-muted lead">
                        Access your billing dashboard securely
                      </p>
                    </div>
                    <form onSubmit={handleLogin} className="fade-in-up delay-1">
                      <div className="mb-4 position-relative">
                        <TextInputform
                          PlaceHolder="Enter Your Mobile Number"
                          formLabel="Mobile Number"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-control-lg rounded-4 border-0 shadow-none input-ultra"
                        />
                        <div className="input-underline-ultra"></div>
                      </div>
                      <div className="mb-4 position-relative">
                        <TextInputform
                          formLabel="Password"
                          PlaceHolder="Enter your password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          classname="form-control-lg rounded-4 border-0 shadow-none input-ultra form-control-padright"
                          formtype={showPassword ? "text" : "password"}
                          suffix_icon={
                            showPassword ? (
                              <VscEye
                                onClick={togglePasswordVisibility}
                                className="cursor-pointer text-muted hover-icon-ultra"
                              />
                            ) : (
                              <VscEyeClosed
                                onClick={togglePasswordVisibility}
                                className="cursor-pointer text-muted hover-icon-ultra"
                              />
                            )
                          }
                        />
                        <div className="input-underline-ultra"></div>
                      </div>
                      <div className="d-grid mb-3">
                        <Buttons
                          btnlabel="Access Dashboard"
                          className="submit-btn btn-md fw-semibold rounded-4 shadow-lg login-btn-ultra"
                          type="submit"
                        />
                      </div>
                    </form>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
