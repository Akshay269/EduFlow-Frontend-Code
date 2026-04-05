'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { FiBookOpen, FiMenu, FiX, FiUser, FiLogOut, FiGrid, FiSearch } from 'react-icons/fi';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { user, isAuthenticated, logout, isStudent, isInstructor } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMobileOpen(false);
    setProfileDropdown(false);
  };

  const handleLogout = () => {
    logout();
    handleNavigate('home');
  };

  const navLinkClass = (page: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
      currentPage === page
        ? 'text-indigo-600 bg-indigo-50'
        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-2 text-xl font-bold text-indigo-600"
            >
              <FiBookOpen className="w-6 h-6" />
              <span>EduFlow</span>
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => handleNavigate('courses')} className={navLinkClass('courses')}>
              <span className="flex items-center gap-1.5">
                <FiSearch className="w-4 h-4" />
                Browse Courses
              </span>
            </button>

            {isAuthenticated && isStudent && (
              <button onClick={() => handleNavigate('student-dashboard')} className={navLinkClass('student-dashboard')}>
                <span className="flex items-center gap-1.5">
                  <FiGrid className="w-4 h-4" />
                  My Learning
                </span>
              </button>
            )}

            {isAuthenticated && isInstructor && (
              <button onClick={() => handleNavigate('instructor-dashboard')} className={navLinkClass('instructor-dashboard')}>
                <span className="flex items-center gap-1.5">
                  <FiGrid className="w-4 h-4" />
                  My Courses
                </span>
              </button>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavigate('login')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavigate('register')}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-indigo-600" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </button>

                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                        {user?.role}
                      </span>
                    </div>
                    <button
                      onClick={() => handleNavigate('profile')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiUser className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
            >
              {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <button onClick={() => handleNavigate('courses')} className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Browse Courses
            </button>
            {isAuthenticated && isStudent && (
              <button onClick={() => handleNavigate('student-dashboard')} className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                My Learning
              </button>
            )}
            {isAuthenticated && isInstructor && (
              <button onClick={() => handleNavigate('instructor-dashboard')} className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                My Courses
              </button>
            )}
            {!isAuthenticated ? (
              <>
                <button onClick={() => handleNavigate('login')} className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Log In
                </button>
                <button onClick={() => handleNavigate('register')} className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 rounded-lg text-center">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleNavigate('profile')} className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Profile
                </button>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
