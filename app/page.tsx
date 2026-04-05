'use client';

import React, { useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import Navbar from './sections/Navbar';
import HeroSection from './sections/HeroSection';
import FeaturedCourses from './sections/FeaturedCourses';
import Footer from './sections/Footer';
import LoginPage from './sections/LoginPage';
import RegisterPage from './sections/RegisterPage';
import CourseBrowsePage from './sections/CourseBrowsePage';
import CourseDetailPage from './sections/CourseDetailPage';
import StudentDashboard from './sections/StudentDashboard';
import InstructorDashboard from './sections/InstructorDashboard';
import ProfilePage from './sections/ProfilePage';

export default function EduFlowApp() {
  const { loading, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [pageData, setPageData] = useState<any>(null);

  const navigate = useCallback((page: string, data?: any) => {
    setCurrentPage(page);
    setPageData(data || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading EduFlow...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={navigate} />;

      case 'register':
        return <RegisterPage onNavigate={navigate} />;

      case 'courses':
        return <CourseBrowsePage onNavigate={navigate} />;

      case 'course-detail':
        return (
          <CourseDetailPage
            courseId={pageData?.courseId}
            onNavigate={navigate}
          />
        );

      case 'student-dashboard':
        if (!isAuthenticated) {
          return <LoginPage onNavigate={navigate} />;
        }
        return <StudentDashboard onNavigate={navigate} />;

      case 'instructor-dashboard':
        if (!isAuthenticated) {
          return <LoginPage onNavigate={navigate} />;
        }
        return <InstructorDashboard onNavigate={navigate} />;

      case 'profile':
        if (!isAuthenticated) {
          return <LoginPage onNavigate={navigate} />;
        }
        return <ProfilePage onNavigate={navigate} />;

      case 'home':
      default:
        return (
          <>
            <HeroSection onNavigate={navigate} />
            <FeaturedCourses onNavigate={navigate} />
            {/* Why Choose Section */}
            <section className="py-16 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Why Choose EduFlow?
                  </h2>
                  <p className="text-gray-500 mt-2">Everything you need for an exceptional learning experience</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Expert-Led Courses</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Learn from industry professionals who bring real-world experience to every lesson.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20V10" />
                        <path d="M18 20V4" />
                        <path d="M6 20v-4" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Track Your Progress</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Monitor your learning journey with a personalized dashboard and course tracking.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Community & Reviews</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Read reviews from fellow students and share your own learning experiences.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-indigo-600">
              <div className="max-w-3xl mx-auto px-4 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Ready to Start Learning?
                </h2>
                <p className="text-indigo-100 mb-8 text-lg">
                  Join thousands of students already learning on EduFlow. Get started for free today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('register')}
                    className="px-8 py-3.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all shadow-lg"
                  >
                    Create Free Account
                  </button>
                  <button
                    onClick={() => navigate('courses')}
                    className="px-8 py-3.5 bg-indigo-500/30 text-white font-semibold rounded-xl hover:bg-indigo-500/50 transition-all border border-indigo-400/30"
                  >
                    Browse Courses
                  </button>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={navigate} currentPage={currentPage} />
      <main>{renderPage()}</main>
      {(currentPage === 'home' || currentPage === 'courses') && (
        <Footer onNavigate={navigate} />
      )}
    </div>
  );
}
