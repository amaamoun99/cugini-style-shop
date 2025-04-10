
import React, { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    // Animate progress
    let progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 2;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <div className="flex flex-col items-center">
        {/* Simple elegant logo */}
        <div className="text-6xl font-serif text-cugini-dark mb-4">
          CUGINI
        </div>
        
        {/* Minimal progress bar */}
        <div className="w-48 h-[1px] bg-cugini-taupe/30 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-cugini-golden transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Tagline */}
        <div className="mt-4 text-cugini-dark text-sm font-serif italic">
          Tailored for the Timeless
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
