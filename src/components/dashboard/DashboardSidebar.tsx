import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Shield, LayoutDashboard, HardDrive, FileText, Terminal, BookOpen, Users, X } from 'lucide-react';

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
}

const DashboardSidebar: React.FC<SidebarProps> = ({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  isSidebarCollapsed,
}) => {
  const navItems = [
    { to: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { to: 'machines', icon: HardDrive, label: 'Machines' },
    { to: 'reports', icon: FileText, label: 'Audit Reports' },
    { to: 'commands', icon: Terminal, label: 'Commands' },
    { to: 'logs', icon: BookOpen, label: 'Logs' },
    { to: 'sessions', icon: Users, label: 'Sessions' },
  ];

  const NavItem: React.FC<{ to: string; icon: React.ElementType; label: string }> = ({
    to,
    icon: Icon,
    label,
  }) => (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-gray-200 transition-colors duration-200 transform rounded-lg hover:bg-gray-700 ${
          isActive ? 'bg-gray-700' : ''
        } ${isSidebarCollapsed ? 'justify-center' : ''}`
      }
      onClick={() => setIsMobileSidebarOpen(false)}
      title={isSidebarCollapsed ? label : ''}
    >
      <Icon className="w-5 h-5" />
      <span
        className={`mx-4 font-medium transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:opacity-0 lg:w-0 lg:mx-0' : 'opacity-100'
        }`}
      >
        {label}
      </span>
    </NavLink>
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 z-30 overflow-y-auto bg-gray-800 border-r transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0`}
      >
        <div
          className={`px-4 py-8 flex ${
            isSidebarCollapsed ? 'justify-center' : 'items-center justify-between'
          }`}
        >
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span
              className={`text-2xl font-bold text-white transition-opacity duration-300 ${
                isSidebarCollapsed ? 'lg:hidden' : ''
              }`}
            >
              DSecure
            </span>
          </Link>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="text-gray-400 focus:outline-none lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-10 space-y-2 px-2">
          {navItems.map(item => <NavItem key={item.to} {...item} />)}
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;
