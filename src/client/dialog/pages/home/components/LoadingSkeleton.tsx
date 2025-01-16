import React from 'react';

export const LoadingSkeleton: React.FC = () => (
  <div className="w-full max-w-4xl mx-auto p-4 space-y-3">
    {[1, 2, 3, 4].map((index) => (
      <div 
        key={index}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse"
      >
        <div className="flex items-center p-4 space-x-4">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
          <div className="flex-grow">
            <div className="w-3/4 h-8 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="px-5 pb-4">
          <div className="w-full h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
); 