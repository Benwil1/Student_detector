"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, ChevronDown, Clock, Trash2, X, Zap } from "lucide-react";
import React, { useState } from "react";

// Mobile Quick Score Indicator (Shows in header)
interface QuickScoreProps {
  score: number | null;
  onClick?: () => void;
}

export const MobileQuickScore: React.FC<QuickScoreProps> = ({ score, onClick }) => {
  if (score === null) return null;
  
  let color = "#ef4444";
  let label = "AI";
  if (score > 80) { color = "#10b981"; label = "Human"; }
  else if (score > 50) { color = "#f59e0b"; label = "Mixed"; }

  return (
    <motion.button
      className="quick-score"
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.95 }}
      style={{ '--score-color': color } as React.CSSProperties}
    >
      <span className="quick-score-value">{Math.round(score)}%</span>
      <span className="quick-score-label">{label}</span>
      <ChevronDown size={14} />

      <style jsx>{`
        .quick-score {
          display: none;
        }
        
        @media (max-width: 1024px) {
          .quick-score {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--score-color);
            border-radius: 20px;
            color: white;
            font-size: 0.8rem;
            font-weight: 700;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
          }
          
          .quick-score-value {
            color: var(--score-color);
          }
          
          .quick-score-label {
            color: #94a3b8;
            font-weight: 500;
          }
        }
      `}</style>
    </motion.button>
  );
};

// Mobile Persona Selector (Pill Style)
interface PersonaSelectorProps {
  persona: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const PERSONAS = [
  { id: 'standard', name: 'Standard', icon: '📝', desc: 'Basic humanization' },
  { id: 'academic', name: 'Academic', icon: '🎓', desc: 'Formal tone' },
  { id: 'lazy_student', name: 'Undetectable', icon: '⚡', desc: '100% human score' },
  { id: 'esl', name: 'ESL', icon: '🌍', desc: 'Non-native style' },
];

export const MobilePersonaSelector: React.FC<PersonaSelectorProps> = ({
  persona,
  onChange,
  isOpen,
  onToggle
}) => {
  const currentPersona = PERSONAS.find(p => p.id === persona) || PERSONAS[0];

  return (
    <>
      <button className="persona-pill" onClick={onToggle}>
        <span className="persona-icon">{currentPersona.icon}</span>
        <span className="persona-name">{currentPersona.name}</span>
        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              className="persona-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
            />
            <motion.div
              className="persona-dropdown"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {PERSONAS.map(p => (
                <button
                  key={p.id}
                  className={`persona-option ${persona === p.id ? 'active' : ''}`}
                  onClick={() => {
                    onChange(p.id);
                    onToggle();
                  }}
                >
                  <span className="option-icon">{p.icon}</span>
                  <div className="option-text">
                    <strong>{p.name}</strong>
                    <span>{p.desc}</span>
                  </div>
                  {persona === p.id && <Check size={16} className="check-icon" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .persona-pill {
          display: none;
        }
        
        @media (max-width: 1024px) {
          .persona-pill {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: rgba(59, 130, 246, 0.12);
            border: 1px solid rgba(59, 130, 246, 0.25);
            border-radius: 16px;
            color: white;
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
            transition: all 0.2s ease;
          }
          
          .persona-pill:active {
            transform: scale(0.96);
            background: rgba(59, 130, 246, 0.2);
          }
          
          .persona-icon {
            font-size: 0.9rem;
            line-height: 1;
          }
          
          .persona-name {
            color: #60a5fa;
            font-weight: 700;
          }
          
          .persona-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
          }
          
          .persona-dropdown {
            position: fixed;
            top: calc(56px + env(safe-area-inset-top, 0px) + 60px);
            left: 16px;
            right: 16px;
            background: rgba(15, 23, 42, 0.98);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 8px;
            z-index: 1001;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          }
          
          .persona-option {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 14px;
            background: transparent;
            border: none;
            border-radius: 12px;
            text-align: left;
            color: white;
            cursor: pointer;
            transition: background 0.2s;
          }
          
          .persona-option:active {
            background: rgba(255, 255, 255, 0.05);
          }
          
          .persona-option.active {
            background: rgba(59, 130, 246, 0.15);
          }
          
          .option-icon {
            font-size: 1.5rem;
          }
          
          .option-text {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          
          .option-text strong {
            font-size: 0.95rem;
            font-weight: 600;
          }
          
          .option-text span {
            font-size: 0.75rem;
            color: #64748b;
            margin-top: 2px;
          }
          
          .check-icon {
            color: #3b82f6;
          }
        }
      `}</style>
    </>
  );
};

// Mobile History Card with Swipe Actions
interface HistoryCardProps {
  item: {
    id: string;
    timestamp: string;
    preview: string;
    persona: string;
    score?: number;
  };
  onRestore: () => void;
  onDelete: () => void;
}

export const MobileHistoryCard: React.FC<HistoryCardProps> = ({
  item,
  onRestore,
  onDelete
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = () => {
    setIsDragging(false);
    if (swipeOffset < -80) {
      onDelete();
    }
    setSwipeOffset(0);
  };

  return (
    <div className="history-card-wrapper">
      {/* Delete action background */}
      <div className="delete-action">
        <Trash2 size={20} />
        <span>Delete</span>
      </div>

      <motion.div
        className="history-card-content"
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDrag={(_, info) => setSwipeOffset(info.offset.x)}
        onDragEnd={handleDragEnd}
        onClick={!isDragging ? onRestore : undefined}
        animate={{ x: 0 }}
        style={{ x: swipeOffset }}
      >
        <div className="card-header">
          <span className="timestamp">
            <Clock size={12} />
            {item.timestamp}
          </span>
          <span className="persona-badge">{item.persona}</span>
        </div>
        <p className="preview">{item.preview}</p>
        {item.score && (
          <div className="score">
            <Zap size={12} />
            Score: <strong>{Math.round(item.score)}%</strong>
          </div>
        )}
      </motion.div>

      <style jsx>{`
        .history-card-wrapper {
          position: relative;
          margin-bottom: 12px;
          border-radius: 14px;
          overflow: hidden;
        }
        
        .delete-action {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .history-card-content {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 14px;
          cursor: pointer;
          -webkit-user-select: none;
          user-select: none;
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .timestamp {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          color: #64748b;
        }
        
        .persona-badge {
          font-size: 0.65rem;
          font-weight: 700;
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: capitalize;
        }
        
        .preview {
          font-size: 0.85rem;
          color: #e2e8f0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
        }
        
        .score {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          font-size: 0.75rem;
          color: #64748b;
        }
        
        .score strong {
          color: #10b981;
        }
      `}</style>
    </div>
  );
};

// Mobile Progress Indicator (Dynamic Island Style)
interface ProgressIndicatorProps {
  isProcessing: boolean;
  progress?: number;
  message?: string;
}

export const MobileProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  isProcessing,
  progress = 0,
  message = "Processing..."
}) => {
  return (
    <AnimatePresence>
      {isProcessing && (
        <motion.div
          className="progress-island"
          initial={{ scale: 0.8, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="progress-content">
            <motion.div 
              className="progress-dot"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="progress-message">{message}</span>
          </div>
          <div className="progress-bar">
            <motion.div 
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <style jsx>{`
            .progress-island {
              display: none;
            }
            
            @media (max-width: 1024px) {
              .progress-island {
                position: fixed;
                top: calc(env(safe-area-inset-top, 0px) + 60px);
                left: 50%;
                transform: translateX(-50%);
                background: rgba(15, 23, 42, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 10px 20px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                z-index: 1000;
                min-width: 180px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
              }
              
              .progress-content {
                display: flex;
                align-items: center;
                gap: 10px;
              }
              
              .progress-dot {
                width: 8px;
                height: 8px;
                background: #3b82f6;
                border-radius: 50%;
              }
              
              .progress-message {
                font-size: 0.85rem;
                font-weight: 600;
                color: white;
              }
              
              .progress-bar {
                height: 3px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                overflow: hidden;
              }
              
              .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                border-radius: 2px;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
