import React from 'react';
import { Info, CheckCircle2, AlertCircle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'info' | 'success' | 'error';
}

interface ToastProps {
  toast: ToastMessage | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-300 shrink-0" />;
    }
  };

  const getBg = () => {
    switch (toast.type) {
      case 'error':
        return 'bg-rose-950/80 border-rose-500/40 text-rose-100';
      case 'success':
        return 'bg-emerald-950/80 border-emerald-500/40 text-emerald-100';
      default:
        return 'bg-blue-950/80 border-blue-500/40 text-blue-100';
    }
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-4">
      <div
        className={`px-5 py-2.5 rounded-full border shadow-2xl backdrop-blur-xl flex items-center gap-2.5 text-xs sm:text-sm font-medium ${getBg()}`}
      >
        {getIcon()}
        <span>{toast.text}</span>
      </div>
    </div>
  );
};
