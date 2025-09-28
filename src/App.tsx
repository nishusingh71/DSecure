import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Features from './components/Features';
import Stats from './components/Stats';
import Pricing from './components/Pricing';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ErasureTools from './pages/ErasureTools';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';
import DashboardOverview from './components/dashboard/DashboardOverview';
import MachinesList from './components/dashboard/MachinesList';
import AuditReportsList from './components/dashboard/AuditReportsList';
import CommandsList from './components/dashboard/CommandsList';
import LogsList from './components/dashboard/LogsList';
import SessionsList from './components/dashboard/SessionsList';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Toaster position="top-right" />
          
          <Routes>
            <Route path="/" element={
              <>
                <Header />
                <Hero />
                <Stats />
                <Services />
                <Features />
                <Pricing />
                <About />
                <Contact />
                <Footer />
                <Chatbot />
              </>
            } />
            <Route path="/tools" element={
              <>
                <Header />
                <ErasureTools />
                <Footer />
                <Chatbot />
              </>
            } />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<DashboardOverview />} />
                <Route path="machines" element={<MachinesList />} />
                <Route path="reports" element={<AuditReportsList />} />
                <Route path="commands" element={<CommandsList />} />
                <Route path="logs" element={<LogsList />} />
                <Route path="sessions" element={<SessionsList />} />
              </Route>
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
