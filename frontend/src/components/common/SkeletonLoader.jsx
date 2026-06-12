import React from 'react';

const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden shadow-premium border border-black/5 animate-pulse"
        >
          {/* Thumbnail Shimmer */}
          <div className="h-64 bg-gray-200 w-full relative">
            <div className="absolute top-4 left-4 h-6 w-24 bg-gray-300 rounded-full" />
          </div>
          
          {/* Details Shimmer */}
          <div className="p-6 space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/3" />
            <div className="h-6 bg-gray-300 rounded w-3/4" />
            
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <div className="space-y-1 w-1/3">
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-5 bg-gray-300 rounded w-full" />
              </div>
              <div className="h-10 bg-gray-300 rounded-full w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
