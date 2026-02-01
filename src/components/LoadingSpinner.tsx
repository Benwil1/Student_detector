import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'var(--primary)', 
  className = '' 
}) => {
  const sizeMap = {
    sm: '16px',
    md: '24px',
    lg: '36px'
  };

  return (
    <div className={`spinner-container ${className}`} role="status">
      <style jsx>{`
        .spinner-container {
            display: inline-block;
            position: relative;
            width: ${sizeMap[size]};
            height: ${sizeMap[size]};
        }
        .spinner-ring {
            box-sizing: border-box;
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px solid ${color};
            border-radius: 50%;
            animation: ripple 1.2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
            opacity: 1;
        }
        .spinner-ring:nth-child(2) {
            animation-delay: -0.5s;
        }
        @keyframes ripple {
            0% {
                top: 45%;
                left: 45%;
                width: 10%;
                height: 10%;
                opacity: 0;
            }
            5% {
                 opacity: 1;
            }
            100% {
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
                opacity: 0;
            }
        }
      `}</style>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
    </div>
  );
};
