import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, ChevronDown, User, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

const DashboardHeader: React.FC<{
  setIsMobileSidebarOpen: (open: boolean | ((isOpen: boolean) => boolean)) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((isCollapsed: boolean) => boolean)) => void;
}> = ({ setIsMobileSidebarOpen, isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname.split('/').pop() || 'overview';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-2 border-gray-200">
      <div className="flex items-center">
        <button
          onClick={() => setIsMobileSidebarOpen(open => !open)}
          className="text-gray-500 focus:outline-none lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsSidebarCollapsed(collapsed => !collapsed)}
          className="text-gray-500 focus:outline-none hidden lg:block mr-4"
        >
          {isSidebarCollapsed ? <PanelLeftOpen className="w-6 h-6" /> : <PanelLeftClose className="w-6 h-6" />}
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center">
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-2 hover:bg-gray-200 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700 font-medium hidden sm:block">{user?.name}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10"
              >
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
