import React from "react";

const SkeletonLoader = () => {
    return (
        <div className="flex flex-row flex-wrap  justify-center lg:justify-between items-center gap-6 p-4 w-full mx-auto max-w-[900px]">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-300 shadow-md rounded-lg p-10 w-[350px] md:w-[270px] lg:w-[240px] animate-pulse"
          >
            {/* Skeleton Image */}
            <div className="w-full h-40 bg-gray-300 dark:bg-gray-500 rounded-md"></div>
  
            {/* Skeleton Title */}
            <div className="mt-4 h-6 w-3/4 bg-gray-300 dark:bg-gray-500 rounded"></div>
  
            {/* Skeleton Text */}
            <div className="mt-2 h-4 w-5/6 bg-gray-300 dark:bg-gray-500 rounded"></div>
            <div className="mt-2 h-4 w-4/6 bg-gray-300 dark:bg-gray-500 rounded"></div>
          </div>
        ))}
      </div>
    );
  };
  
  export default SkeletonLoader;