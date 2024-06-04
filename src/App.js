import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {AuthProvider } from './context/AuthContext';
import { ImageProvider } from './context/ImageContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SignUp from './components/SignUp';
import UploadImage from './components/UploadImage';

const App = () => {
    
    return (
        <AuthProvider>
            <ImageProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path='/addImage' element={<UploadImage/>} />
                        <Route path="/" element={<Dashboard />} />
                    </Routes>
                </Router>
            </ImageProvider>
        </AuthProvider>
    );
}

export default App;
