import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/profile-reg.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState(formData);
  const [loading, setLoading] = useState(false);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!/^[a-zA-Z]+$/.test(formData.firstName)) {
        newErrors.firstName = "First name should contain only letters";
      }
  
      if (!/^[a-zA-Z]+$/.test(formData.lastName)) {
        newErrors.lastName = "Last name should contain only letters";
      }
  
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email address";
      }
      
      if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(formData.password)) {
        newErrors.password = "Password should be alpha-numeric, at least 8 characters long and have atleast 1 special character ";
      }
  
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setLoading(true);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setLoading(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/profile", {
          state: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
          },
        });
      }, 2000);
    }
  };
  
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSuccessMessage(false);
  };

  return (
    <div className="container">
      <div className="title-container">
        <h1 className="title">Profile Registration</h1>
        </div>
        <form className={"register-form"} onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
            {errors.firstName && <span className="error">{errors.firstName}</span>}
          </div>
          <div className="input-group">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
            {errors.lastName && <span className="error">{errors.lastName}</span>}
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Register'}</button>
        </form>
      {showSuccessMessage && (
        <div className="success-message" onClick={handleClose}>
          Registration Successful...Redirecting to the Profile Page
        </div>
      )}
    </div>
  );
}


export default SignUp;