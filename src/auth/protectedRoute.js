// src/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar';

const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return isAuthenticated ? (
    <Sidebar>
      <Outlet /> {/* Renders the nested routes */}
    </Sidebar>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
