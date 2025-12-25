import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserLogin from "../pages/auth/UserLogin";
import UserRegister from "../pages/auth/UserRegister";
import FoodPartnerLogin from "../pages/auth/FoodPartnerLogin";
import FoodPartnerRegister from "../pages/auth/FoodPartnerRegister";
import Home from "../pages/general/Home";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route
          path="/food-partner/register"
          element={<FoodPartnerRegister />}
        />
        <Route
          path="/food-partner/login"
          element={<FoodPartnerLogin />}
        />
        <Route path="/" element={<Home/>}/>
      </Routes>

    </Router>
  );
};

export default AppRoutes;
