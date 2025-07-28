// src/routes/AppRoutes.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 🧩 Importing all page components
import Home from '../components/home/Home';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import CustomerDashboard from '../components/dashboard/CustomerDashboard';
import ProtectedRoute from './ProtectedRoute'; // 🔒 Wrapper to protect private routes

/**
 * AppRoutes component defines all frontend routes in the app.
 * Public routes (Home, Login, Register) are accessible by anyone.
 * Protected routes (Dashboards) require user authentication.
 */
function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<Home />} />                 {/* Home page */}
        <Route path="/login" element={<Login />} />           {/* Login page */}
        <Route path="/register" element={<Register />} />     {/* Registration page */}

        {/* 🔐 Protected Routes — accessible only after login */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard /> {/* Only for authenticated admin */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute>
              <CustomerDashboard /> {/* Only for authenticated customer */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
