
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
        <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
      </div>
      <p className="mt-6 text-lg font-medium text-white">Carregando Infinity CRM...</p>
      <p className="mt-2 text-sm text-white/70">Preparando sua experiência personalizada</p>
      
      <div className="mt-8 w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-progress-bar"></div>
      </div>
      
      <style jsx>{`
        @keyframes progress {
          0% { width: 5%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress-bar {
          animation: progress 1.5s ease-in-out forwards;
          width: 0%;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
