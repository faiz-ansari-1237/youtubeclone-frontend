// src/components/SidebarRow.jsx
import React from 'react';

const SidebarRow = ({ Icon, title, selected, isSidebarOpen }) => {
  return (
    <div className={`flex items-center rounded-lg cursor-pointer hover:bg-gray-100
      ${selected ? 'bg-gray-200 font-medium' : ''}
      ${isSidebarOpen ? 'py-3 px-3' : 'py-3 px-0 justify-center'}` /* Adjusted padding and centering for collapsed state */
    }>
      {/* Icon size remains h-6 w-6, but margin is removed when collapsed */}
      <Icon className={`h-6 w-6 text-gray-600 ${isSidebarOpen ? 'mr-4' : ''}`} />
      {/* Title is hidden when sidebar is not open */}
      <span className={`text-sm text-gray-800 ${!isSidebarOpen && 'hidden'}`}>{title}</span>
    </div>
  );
};

export default SidebarRow;
