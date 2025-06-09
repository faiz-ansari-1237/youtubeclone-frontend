// src/components/FloatingUploadButton.jsx

import { useState } from 'react';
import VideoUploadModal from '../pages/VideoUploadModal';

const FloatingUploadButton = ({ token, onUpload, onClick }) => {
  return (
    <>
      <button
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
        title="Upload Video"
        onClick={onClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </>
  );
};

export default FloatingUploadButton;