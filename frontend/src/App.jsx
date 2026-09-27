import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreateGenerationPage from './pages/CreateGenerationPage';
import PipelinePage from './pages/PipelinePage';
import ResultsPage from './pages/ResultsPage';
import ReviewPage from './pages/ReviewPage';
import HistoryPage from './pages/HistoryPage';
import AuditLogsPage from './pages/AuditLogsPage';
import SettingsPage from './pages/SettingsPage';

import { api } from './api';

function AppLayout({ currentUser, onSwitchRole, onLogout, toasts, onDismissToast, onToast, pendingCount }) {
  const location = useLocation();
  const isPublicPage = location.pathname === '/' || location.pathname === '/login';

  if (isPublicPage) {
    return (
      <>
        <Toast toasts={toasts} onDismiss={onDismissToast} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={onSwitchRole} />} />
        </Routes>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-defense-950 text-slate-100 flex flex-col selection:bg-tactical-cyan/20 selection:text-tactical-cyan">
      <Navbar 
        currentUser={currentUser} 
        onSwitchRole={onSwitchRole} 
        onLogout={onLogout} 
      />

      <div className="flex-1 flex">
        <Sidebar pendingCount={pendingCount} />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage currentUser={currentUser} onToast={onToast} />} />
            <Route path="/create" element={<CreateGenerationPage onToast={onToast} />} />
            <Route path="/pipeline/:id" element={<PipelinePage onToast={onToast} />} />
            <Route path="/results/:id" element={<ResultsPage onToast={onToast} />} />
            <Route path="/review" element={<ReviewPage currentUser={currentUser} onToast={onToast} />} />
            <Route path="/review/:id" element={<ReviewPage currentUser={currentUser} onToast={onToast} />} />
            <Route path="/history" element={<HistoryPage onToast={onToast} />} />
            <Route path="/audit" element={<AuditLogsPage onToast={onToast} />} />
            <Route path="/settings" element={<SettingsPage currentUser={currentUser} onToast={onToast} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      <Toast toasts={toasts} onDismiss={onDismissToast} />
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    username: 'analyst',
    full_name: 'Dr. Vikram Sethi',
    role: 'Analyst',
    department: 'Cyber Threat Intelligence Wing',
    clearance_level: 'SECRET'
  });

  const [toasts, setToasts] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  // Poll or load pending reviews count
  const checkPending = async () => {
    try {
      const data = await api.getPendingReviews();
      setPendingCount(data.length);
    } catch (e) {
      // Backend might still be starting
    }
  };

  useEffect(() => {
    checkPending();
    const interval = setInterval(checkPending, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleToast = (toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      handleDismissToast(id);
    }, 4500);
  };

  const handleDismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSwitchRole = async (roleName) => {
    try {
      const updated = await api.switchRole(roleName);
      setCurrentUser(updated);
      handleToast({
        type: 'info',
        title: 'Role Switched',
        message: `Active operator is now ${updated.full_name} (${updated.role}).`
      });
    } catch (e) {
      // Offline fallback
      setCurrentUser((prev) => ({ ...prev, role: roleName }));
    }
  };

  const handleLogout = () => {
    handleToast({
      type: 'info',
      title: 'Session Closed',
      message: 'Operator session terminated safely.'
    });
    window.location.href = '/login';
  };

  return (
    <BrowserRouter>
      <AppLayout
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
        toasts={toasts}
        onDismiss={handleDismissToast}
        onToast={handleToast}
        pendingCount={pendingCount}
      />
    </BrowserRouter>
  );
}
