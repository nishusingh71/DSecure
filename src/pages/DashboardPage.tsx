import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Chatbot from '../components/Chatbot';

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <Outlet />
      <Chatbot />
    </DashboardLayout>
  );
};

export default DashboardPage;
