import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import RiskMapPage from './pages/RiskMapPage';
import VulnerabilityPage from './pages/VulnerabilityPage';
import RelocationPage from './pages/RelocationPage';
import SheltersPage from './pages/SheltersPage';
import SimulationPage from './pages/SimulationPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import AppLayout from './components/layout/AppLayout';

export default function App() {
  return (
    <Routes>
      {/* Public Landing & Auth Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />

      {/* Emergency Management Dashboard Routes */}
      <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
      <Route path="/map" element={<AppLayout><RiskMapPage /></AppLayout>} />
      <Route path="/vulnerability" element={<AppLayout><VulnerabilityPage /></AppLayout>} />
      <Route path="/relocation" element={<AppLayout><RelocationPage /></AppLayout>} />
      <Route path="/shelters" element={<AppLayout><SheltersPage /></AppLayout>} />
      <Route path="/simulation" element={<AppLayout><SimulationPage /></AppLayout>} />
      <Route path="/alerts" element={<AppLayout><AlertsPage /></AppLayout>} />
      <Route path="/reports" element={<AppLayout><ReportsPage /></AppLayout>} />
      <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
      
      {/* Admin Command Center Route */}
      <Route path="/admin" element={<AppLayout><AdminPage /></AppLayout>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
