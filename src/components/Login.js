// Login component 
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../stylesheets/login.css'
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const { error, loading, login, successMessage } = useContext(AuthContext);

    // Handle event when submit button is clicked
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Login action is called in AuthContext
        await login({ ...formData});
      if (!error) {
        console.log("Not Error ---->", error)
        setTimeout(() => {
          setFormData({
            email: "",
            password: "",
          });
          navigate("/");
        }, 3000);
      }
        
    };

    return (
        <div className="container">
            <div className="title-container">
                <h1 className="title">Login</h1>
            </div>
            {error && <span className="error">{error}</span>}
            <form className={"register-form"} onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Username"
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                    />
                </div>
                <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
            </form>
            <Link to={"/signup"}>New User ? Signup</Link>
            {successMessage && (
                <div className="success-message">
                    Login Successful...Redirecting to the Dashboard
                </div>
            )}
        </div>
    );
};

export default Login;
