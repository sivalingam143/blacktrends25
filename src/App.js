import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import "./components/components.css";
import "bootstrap/dist/css/bootstrap.min.css";

import routes from "./routes/routes";
import Login from "./view/Login";
import PrivateRoute from "./routes/PrivateRoute";
import Layout from "./routes/Layout";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <PrivateRoute>
                  <Layout>
                    <route.component />
                  </Layout>
                </PrivateRoute>
              }
            />
          ))}
        </Routes>
      </Router>
    </>
  );
}

export default App;