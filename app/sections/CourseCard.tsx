'use client';

import React from 'react';
import { FiStar, FiUsers, FiBarChart2 } from 'react-icons/fi';

interface CourseCardProps {
  course: any;
  onClick: () => void;
}

export default function CourseCard({ course, onClick }: CourseCardProps) {
  const levelColor: Record<string, string> = {
    BEGINNER: 'bg-green-100 text-green-700',
    INTERMEDIATE: 'bg-yellow-100 text-yellow-700',
    ADVANCED: 'bg-red-100 text-red-700',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 relative overflow-hidden">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiBarChart2 className="w-12 h-12 text-indigo-300" />
          </div>
        )}
        {course.level && (
          <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full ${levelColor[course.level] || 'bg-gray-100 text-gray-700'}`}>
            {course.level}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {course.category && (
          <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1.5">
            {course.category}
          </p>
        )}
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {course.description}
        </p>

        {/* Instructor */}
        {(course.instructorName || course.instructor?.name) && (
          <p className="text-xs text-gray-400 mt-2">
            by {course.instructorName || course.instructor?.name}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {(course.averageRating != null && course.averageRating > 0) && (
              <div className="flex items-center gap-1">
                <FiStar className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  {Number(course.averageRating).toFixed(1)}
                </span>
                {course.totalReviews != null && (
                  <span className="text-xs text-gray-400">({course.totalReviews})</span>
                )}
              </div>
            )}
            {course.totalEnrollments != null && (
              <div className="flex items-center gap-1 text-gray-400">
                <FiUsers className="w-3.5 h-3.5" />
                <span className="text-xs">{course.totalEnrollments}</span>
              </div>
            )}
          </div>
          <span className="text-lg font-bold text-gray-900">
            {course.price === 0 ? 'Free' : `$${course.price}`}
          </span>
        </div>
      </div>
    </div>
  );
}
