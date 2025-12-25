import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';

const FoodPartnerLogin = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Partner Login</h1>
          <p className="auth-subtitle">Sign in to your partner account</p>
        </div>

        <form className="auth-form">
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
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="form-button form-button-primary">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Don't have a partner account?{' '}
            <Link to="/food-partner/register" className="auth-link">
              Register as Partner
            </Link>
          </p>
          <p className="auth-footer-text">
            <Link to="/user/register" className="auth-link">
              Register as Normal User
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;

