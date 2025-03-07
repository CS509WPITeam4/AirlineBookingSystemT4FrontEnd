import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Import your page components
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import FlightDetailsPage from './pages/FlightDetailsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Flight pages */}
        <Route path="/flight/:flightId" element={<FlightDetailsPage />} />
        <Route path="/search-flights" element={<Navigate to="/flight/FL123" replace />} />
        <Route path="/booking/:flightId" element={<Navigate to="/dashboard" replace />} />
        
        {/* Protected pages */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;