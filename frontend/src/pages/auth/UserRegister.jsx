import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


const UserRegister = () => {
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const fullName = e.target.fullName.value
    const email = e.target.email.value
    const phoneNumber = e.target.phoneNumber.value
    const password = e.target.password.value
    const confirmPassword = e.target.confirmPassword.value
    console.log('fullname:', fullName);

    if (password !== confirmPassword) {
      return;
    }


    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/user/register`,
        {
          fullName,
          email,
          phoneNumber,
          password
        },
        { withCredentials: true }
      );

      console.log(res.data);
      navigate('/')
    } catch (error) {
      console.error(error.response?.data?.message || "Registration failed");
    }

  }
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Sign up to get started</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              name="fullName"
              className="form-input"
              placeholder="Enter your full name"
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
              name="phoneNumber"
              className="form-input"
              placeholder="Enter your phone number"
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
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/user/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;

