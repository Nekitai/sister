import React from "react";

export const Report = ({ isSidebarOpen }) => {
  const reportWrapperClass = `transition-all duration-300 w-full min-h-screen p-6 ${
    isSidebarOpen ? "ml-60" : "ml-16"
  } bg-gray-100`;

  return (
    <div className={reportWrapperClass}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {/* Earning */}
        <div className="bg-blue-900 text-white p-4 rounded shadow-md">
          <div className="text-sm mb-1">Earning</div>
          <div className="text-2xl font-bold">$ 628</div>
        </div>

        {/* Share */}
        <div className="bg-white p-4 rounded shadow-md flex items-center">
          <div className="flex-1">
            <div className="text-sm text-gray-500">Share</div>
            <div className="text-2xl font-bold">2434</div>
          </div>
          <i className="ri-share-forward-line text-orange-500 text-2xl" />
        </div>

        {/* Likes */}
        <div className="bg-white p-4 rounded shadow-md flex items-center">
          <div className="flex-1">
            <div className="text-sm text-gray-500">Likes</div>
            <div className="text-2xl font-bold">1259</div>
          </div>
          <i className="ri-thumb-up-fill text-orange-500 text-2xl" />
        </div>

        {/* Rating */}
        <div className="bg-white p-4 rounded shadow-md flex items-center">
          <div className="flex-1">
            <div className="text-sm text-gray-500">Rating</div>
            <div className="text-2xl font-bold">8.5</div>
          </div>
          <i className="ri-star-fill text-yellow-400 text-2xl" />
        </div>
      </div>
    </div>
  );
};
