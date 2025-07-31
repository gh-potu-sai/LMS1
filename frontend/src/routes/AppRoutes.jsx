// src/routes/AppRoutes.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from '../components/home/Home';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import CustomerDashboard from '../components/dashboard/CustomerDashboard';
import CustomerProfile from '../components/dashboard/CustomerProfile'; // ✅ Add this
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Admin Route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Nested Protected Customer Routes */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="profile" element={<CustomerProfile />} />
          {/* You can add these below as you build them: */}
          {/* <Route path="emi" element={<EMICalculator />} /> */}
          {/* <Route path="apply" element={<ApplyLoan />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
