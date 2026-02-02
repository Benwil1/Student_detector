"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Loader2, Shield, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";

interface MobileFloatingActionsProps {
  onHumanize: () => void;
  onScan: () => void;
  isProcessing: boolean;
  isScanning: boolean;
  humanScore: number | null;
  hasOutput: boolean;
}

export const MobileFloatingActions: React.FC<MobileFloatingActionsProps> = ({
  onHumanize,
  onScan,
  isProcessing,
  isScanning,
  humanScore,
  hasOutput
}) => {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  // Determine button state
  const isLoading = isProcessing || isScanning;
  const buttonText = isProcessing 
    ? "Humanizing..." 
    : isScanning 
    ? "Scanning..." 
    : "Humanize";

  return (
    <>
      {/* Main Floating Action Button */}
      <div className="mobile-fab-wrapper">
        <motion.button
          className={`mobile-fab ${isLoading ? 'processing' : ''}`}
          onClick={onHumanize}
          disabled={isLoading}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.3
          }}
        >
          {isLoading ? (
            <Loader2 className="fab-icon spinning" size={20} />
          ) : (
            <Sparkles className="fab-icon" size={20} />
          )}
          <span>{buttonText}</span>
        </motion.button>

        {/* Secondary action - Scan */}
        <AnimatePresence>
          {hasOutput && !isLoading && (
            <motion.button
              className="mobile-fab-mini"
              onClick={onScan}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              whileTap={{ scale: 0.9 }}
            >
              <Shield size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .mobile-fab-wrapper {
          display: none;
        }
        
        @media (max-width: 1024px) {
          .mobile-fab-wrapper {
            position: fixed !important; /* Force fixed */
            bottom: calc(110px + env(safe-area-inset-bottom, 20px)); /* Clear the new floating dock */
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999; /* Ensure on top of everything */
            display: flex;
            align-items: center;
            gap: 12px;
            pointer-events: auto;
          }
          
          .mobile-fab {
            height: 56px;
            padding: 0 28px;
            border-radius: 28px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border: none;
            color: white;
            font-size: 0.95rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            box-shadow: 
              0 8px 30px rgba(59, 130, 246, 0.5),
              0 4px 15px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
          
          .mobile-fab:disabled {
            background: linear-gradient(135deg, #475569 0%, #334155 100%);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            cursor: not-allowed;
          }
          
          .mobile-fab.processing {
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            box-shadow: 
              0 8px 30px rgba(139, 92, 246, 0.5),
              0 4px 15px rgba(0, 0, 0, 0.2);
          }
          
          .mobile-fab-mini {
            width: 48px;
            height: 48px;
            border-radius: 24px;
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #94a3b8;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            cursor: pointer;
          }
          
          .fab-icon {
            flex-shrink: 0;
          }
          
          .fab-icon.spinning {
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        }
      `}</style>
    </>
  );
};

// Mobile Toast Component
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'processing';
  visible: boolean;
  onClose?: () => void;
}

export const MobileToast: React.FC<ToastProps> = ({
  message,
  type,
  visible,
  onClose
}) => {
  useEffect(() => {
    if (visible && type !== 'processing') {
      const timer = setTimeout(() => {
        onClose?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, type, onClose]);

  const icons = {
    success: <Check size={16} />,
    error: "✕",
    info: "ℹ",
    processing: <Loader2 className="toast-spinner" size={16} />
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`mobile-toast ${type}`}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <span className="toast-icon">{icons[type]}</span>
          <span className="toast-message">{message}</span>
        </motion.div>
      )}
      
      <style jsx>{`
        .mobile-toast {
          display: none;
        }
        
        @media (max-width: 1024px) {
          .mobile-toast {
            position: fixed;
            bottom: calc(72px + env(safe-area-inset-bottom, 20px) + 90px);
            left: 50%;
            transform: translateX(-50%);
            padding: 14px 24px;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 50px;
            color: white;
            font-size: 0.9rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 
              0 8px 30px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
            z-index: 2000;
          }
          
          .mobile-toast.success {
            border-color: rgba(16, 185, 129, 0.3);
          }
          
          .mobile-toast.success .toast-icon {
            color: #10b981;
            background: rgba(16, 185, 129, 0.2);
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .mobile-toast.error {
            border-color: rgba(239, 68, 68, 0.3);
          }
          
          .mobile-toast.error .toast-icon {
            color: #ef4444;
          }
          
          .mobile-toast.processing {
            border-color: rgba(139, 92, 246, 0.3);
          }
          
          .mobile-toast.processing .toast-icon {
            color: #8b5cf6;
          }
          
          .toast-spinner {
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        }
      `}</style>
    </AnimatePresence>
  );
};

// Score Progress Ring for Mobile
interface ScoreRingProps {
  score: number;
  size?: number;
}

export const MobileScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 80
}) => {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  
  let color = "#ef4444"; // danger
  if (score > 80) color = "#10b981"; // success
  else if (score > 50) color = "#f59e0b"; // warning

  return (
    <div className="score-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          className="ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <div className="ring-text">
        <motion.span 
          className="ring-value"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(score)}%
        </motion.span>
        <span className="ring-label">HUMAN</span>
      </div>

      <style jsx>{`
        .score-ring-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .ring-text {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .ring-value {
          font-size: 1.3rem;
          font-weight: 800;
          color: white;
          line-height: 1;
        }
        
        .ring-label {
          font-size: 0.55rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
};
