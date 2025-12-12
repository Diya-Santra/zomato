import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginForm } from "../components/login-form";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/register" element={<h1>hello</h1>} />
        <Route path="/user/login" element={<LoginForm/>} />
        <Route
          path="/food-partner/register"
          element={<h1>food-partner register</h1>}
        />
        <Route
          path="/food-partner/login"
          element={<h1>food-partner register</h1>}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
