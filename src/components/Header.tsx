import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ChevronDown, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './Auth/AuthModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const location = useLocation();
  const { profile, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">DSecure</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <Link to="/" className={`text-gray-700 hover:text-blue-600 transition-colors ${location.pathname === '/' ? 'text-blue-600 font-semibold' : ''}`}>
                Home
              </Link>
              
              <div className="relative group">
                <button 
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  Services
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                
                <AnimatePresence>
                  {isServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2"
                      onMouseEnter={() => setIsServicesOpen(true)}
                      onMouseLeave={() => setIsServicesOpen(false)}
                    >
                      <Link to="/tools" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                        Data Erasure Tools
                      </Link>
                      <a href="#services" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                        Security Auditing
                      </a>
                      <a href="#services" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                        Compliance Solutions
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
              
              {isAuthenticated && profile ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-2 hover:bg-gray-200 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium hidden sm:inline">{profile.full_name}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2"
                        onMouseLeave={() => setIsUserMenuOpen(false)}
                      >
                        <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                          Dashboard
                        </Link>
                        <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                          Settings
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-2 py-2 sm:px-0"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-4 border-t border-gray-200"
              >
                <div className="flex flex-col space-y-4">
                  <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                    Home
                  </Link>
                  <Link to="/tools" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                    Data Erasure Tools
                  </Link>
                  <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                    Services
                  </a>
                  <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                    Pricing
                  </a>
                  <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                    About
                  </a>
                  <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors py-2">
                    Contact
                  </a>
                  
                  {isAuthenticated && profile ? (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="text-gray-900 font-medium mb-2">Welcome, {profile.full_name}</div>
                      <Link to="/dashboard" className="block text-gray-700 hover:text-blue-600 transition-colors py-2">
                        Dashboard
                      </Link>
                      <Link to="/settings" className="block text-gray-700 hover:text-blue-600 transition-colors py-2">
                        Settings
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left text-gray-700 hover:text-blue-600 transition-colors py-2"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <button
                        onClick={() => handleAuthClick('login')}
                        className="w-full text-left text-gray-700 hover:text-blue-600 transition-colors py-2"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => handleAuthClick('register')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold mt-4 self-start"
                      >
                        Get Started
                      </button>
                    </div>
                  )}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;
