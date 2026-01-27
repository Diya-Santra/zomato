import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import axios from "axios";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("restaurantName", e.target.restaurantName.value);
    formData.append("ownerName", e.target.ownerName.value);
    formData.append("email", e.target.email.value);
    formData.append("phoneNumber", e.target.phoneNumber.value);
    formData.append("restaurantAddress", e.target.restaurantAddress.value);
    formData.append("password", e.target.password.value);

    if (e.target.profilePic.files[0]) {
      formData.append("profilePic", e.target.profilePic.files[0]);
    }

    const confirmPassword = e.target.confirmPassword.value;
    if (e.target.password.value !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/auth/food-partner/register",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      console.log(res.data);
      navigate("/");
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
            <label className="form-label">Profile Picture (Optional)</label>
            <input type="file" name="profilePic" className="form-input" accept="image/*" />
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
