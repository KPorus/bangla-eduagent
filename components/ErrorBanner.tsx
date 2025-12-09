import React from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss, onRetry, className = "" }) => (
  <div className={`bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-700 animate-fade-in ${className}`}>
    <AlertCircle className="flex-shrink-0 mt-0.5 text-red-500" size={20} />
    <div className="flex-1">
      <h3 className="font-semibold text-sm text-red-800">Something went wrong</h3>
      <p className="text-sm mt-1 text-red-600 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-800 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
        >
          <RefreshCw size={12} />
          Try Again
        </button>
      )}
    </div>
    {onDismiss && (
      <button onClick={onDismiss} className="text-red-400 hover:text-red-700 p-1 hover:bg-red-100 rounded-full transition-colors">
        <X size={18} />
      </button>
    )}
  </div>
);