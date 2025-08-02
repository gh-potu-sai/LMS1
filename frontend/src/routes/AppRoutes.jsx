// src/routes/AppRoutes.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from '../components/home/Home';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

import AdminDashboard from '../components/dashboard/AdminDashboard';
import CustomerDashboard from '../components/dashboard/CustomerDashboard';
import AdminProfile from '../components/dashboard/AdminProfile'; 
import CustomerProfile from '../components/dashboard/CustomerProfile';

import ApplyLoanForm from '../components/loan/customerLoan/ApplyLoanForm';

import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Admin Dashboard & Profile */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Customer Dashboard with nested routes */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute role="CUSTOMER">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="apply-loan" element={<ApplyLoanForm />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default AppRoutes;
