
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
    <div className="fixed inset-0 z-50 bg-cugini-dark flex items-center justify-center">
      <div className="flex flex-col items-center">
        {/* Logo with animation */}
        <div className="relative">
          <div className="text-5xl md:text-7xl font-serif text-white tracking-wider relative">
            <span className="opacity-0 animate-[fade-in_2s_ease-out_forwards]">CUGINI</span>
            <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-cugini-golden animate-[grow-width_1.5s_ease-out_forwards_0.5s]"></div>
          </div>
          <div className="absolute -top-4 -left-4 w-full h-full border border-cugini-golden opacity-0 animate-[fade-in_0.5s_ease-out_forwards_0.8s,grow-border_1s_ease-out_forwards_0.8s]"></div>
        </div>
        
        {/* Tagline */}
        <div className="mt-4 text-cugini-taupe text-sm md:text-base italic opacity-0 animate-[fade-in_0.5s_ease-out_forwards_1s]">
          Timeless Italian Fashion
        </div>
        
        {/* Progress bar */}
        <div className="mt-8 w-48 h-0.5 bg-cugini-taupe/30 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-cugini-golden transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
