"use client";

import { Download, Play, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

interface NavbarProps {
  onHumanize: () => void;
  onScan: () => void;
  onExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onHumanize, onScan, onExport }) => {
  return (
    <header className="navbar">
      <Link href="/" className="nav-brand">
        <div className="brand-logo">
           <Zap size={20} fill="currentColor" />
        </div>
        <h1>Humanizer<span style={{ color: "var(--primary)" }}>AI</span></h1>
      </Link>
      
      <div className="nav-actions">
        <button className="nav-btn ghost" onClick={onScan}>
          <ShieldCheck size={18} />
          <span>Check Score</span>
        </button>
        <button className="nav-btn primary" onClick={onHumanize}>
          <Play size={16} fill="currentColor" />
          <span>Humanize Text</span>
        </button>
        <button className="nav-btn outline" onClick={onExport}>
          <Download size={18} />
          <span>Export</span>
        </button>
      </div>

      <style jsx>{`
        .navbar {
          height: var(--nav-height);
          background: rgba(2, 6, 23, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1.5rem;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 10001;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        
        .brand-logo {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px var(--primary-faint);
        }

        h1 {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .nav-actions {
          display: flex;
          gap: 0.8rem;
          align-items: center;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .nav-btn.primary {
          background: var(--primary);
          color: white;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .nav-btn.primary:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }

        .nav-btn.outline {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
        }
        .nav-btn.outline:hover {
          border-color: var(--text-primary);
          color: var(--text-primary);
        }
        
        .nav-btn.ghost {
           color: var(--text-tertiary);
        }
        .nav-btn.ghost:hover {
           color: var(--text-primary);
           background: var(--bg-surface);
        }

        @media (max-width: 900px) {
          .nav-btn span {
            display: none;
          }
          .nav-btn {
            padding: 0.5rem;
          }
        }
      `}</style>
    </header>
  );
};
