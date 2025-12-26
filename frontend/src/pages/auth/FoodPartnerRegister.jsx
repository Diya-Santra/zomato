import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import axios from "axios";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const restaurantName = e.target.restaurantName.value;
    const ownerName = e.target.ownerName.value;
    const email = e.target.email.value;
    const phoneNumber = e.target.phoneNumber.value;
    const restaurantAddress = e.target.restaurantAddress.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/auth/food-partner/register",
        {
          restaurantName,
          ownerName,
          email,
          phoneNumber,
          restaurantAddress,
          password,
        },
        { withCredentials: true }
      );

      alert("Partner registered successfully");
      console.log(res.data);
      navigate("/create-food");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Partner Registration</h1>
          <p className="auth-subtitle">Join as a food partner</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Restaurant Name</label>
            <input type="text" name="restaurantName" className="form-input" required />
          </div>

          <div className="form-group">
            <label className="form-label">Owner Name</label>
            <input type="text" name="ownerName" className="form-input" required />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-input" required />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" name="phoneNumber" className="form-input" required />
          </div>

          <div className="form-group">
            <label className="form-label">Restaurant Address</label>
            <input type="text" name="restaurantAddress" className="form-input" required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" required />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" name="confirmPassword" className="form-input" required />
          </div>

          <button type="submit" className="form-button form-button-primary">
            Register as Partner
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/food-partner/login" className="auth-link">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
