import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';

const FoodPartnerRegister = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Partner Registration</h1>
          <p className="auth-subtitle">Join as a food partner</p>
        </div>
        
        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="restaurantName" className="form-label">Restaurant Name</label>
            <input
              type="text"
              id="restaurantName"
              name="restaurantName"
              className="form-input"
              placeholder="Enter restaurant name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="ownerName" className="form-label">Owner Name</label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              className="form-input"
              placeholder="Enter owner's name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address" className="form-label">Restaurant Address</label>
            <input
              type="text"
              id="address"
              name="address"
              className="form-input"
              placeholder="Enter restaurant address"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Create a password"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <button type="submit" className="form-button form-button-primary">
            Register as Partner
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="auth-footer-text">
            Already have a partner account?{' '}
            <Link to="/food-partner/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;

