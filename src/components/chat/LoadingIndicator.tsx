
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="text-left">
      <div className="inline-block p-3 rounded-lg bg-white border">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <span className="text-gray-600">typing</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
