import React from 'react';

interface LoadingScreenProps {
  message: string;
  subMessage?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message, subMessage }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center animate-fade-in">
    <div className="relative w-16 h-16 mb-6">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full animate-ping opacity-75"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-600 border-r-transparent border-b-indigo-600 border-l-transparent rounded-full animate-spin"></div>
    </div>
    <h2 className="text-xl font-bold text-slate-800 mb-2">{message}</h2>
    {subMessage && <p className="text-slate-500 animate-pulse">{subMessage}</p>}
  </div>
);

export default LoadingScreen;
