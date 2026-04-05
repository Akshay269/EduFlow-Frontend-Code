'use client';

import React from 'react';
import { FiBookOpen, FiHeart } from 'react-icons/fi';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-white mb-4">
              <FiBookOpen className="w-6 h-6 text-indigo-400" />
              <span className="text-xl font-bold">EduFlow</span>
            </div>
            <p className="text-sm leading-relaxed">
              Empowering learners worldwide with quality courses from expert instructors.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('courses')} className="text-sm hover:text-white transition-colors">
                  Browse Courses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="text-sm hover:text-white transition-colors">
                  Become an Instructor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="text-sm hover:text-white transition-colors">
                  Start Learning
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-2">
              <li><span className="text-sm">Help Center</span></li>
              <li><span className="text-sm">Privacy Policy</span></li>
              <li><span className="text-sm">Terms of Service</span></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-2">
              <li><span className="text-sm">support@eduflow.com</span></li>
              <li><span className="text-sm">Community Forum</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            2024 EduFlow. All rights reserved.
          </p>
          <p className="text-sm flex items-center gap-1">
            Made with <FiHeart className="w-3.5 h-3.5 text-red-400" /> for learners everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
