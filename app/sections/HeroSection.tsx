'use client';

import React from 'react';
import { FiArrowRight, FiBookOpen, FiUsers, FiAward } from 'react-icons/fi';

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Learn Without{' '}
            <span className="text-indigo-200">Limits</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-indigo-100 leading-relaxed">
            Discover courses from expert instructors, track your progress, and achieve your learning goals with EduFlow.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('courses')}
              className="px-8 py-3.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Explore Courses
              <FiArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="px-8 py-3.5 bg-indigo-500/30 text-white font-semibold rounded-xl hover:bg-indigo-500/50 transition-all border border-indigo-400/30 flex items-center justify-center gap-2"
            >
              Get Started Free
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-500/30 rounded-xl mb-3">
              <FiBookOpen className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-white">500+</p>
            <p className="text-indigo-200 text-sm mt-1">Courses Available</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-500/30 rounded-xl mb-3">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-white">10K+</p>
            <p className="text-indigo-200 text-sm mt-1">Active Students</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-500/30 rounded-xl mb-3">
              <FiAward className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-white">200+</p>
            <p className="text-indigo-200 text-sm mt-1">Expert Instructors</p>
          </div>
        </div>
      </div>
    </div>
  );
}
