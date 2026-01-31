"use client";

import { Info, PanelLeftClose, PanelLeftOpen, Zap } from "lucide-react";
import React, { useState } from "react";

interface SidebarProps {
  mode: "settings" | "analysis";
  humanScore: number | null;
  settings: {
    vocab: boolean;
    grammar: boolean;
    structure: boolean;
    burst: boolean;
    intensity: number;
    fluff: boolean;
    typo: boolean;
    simplifier: boolean;
  };
  onSettingChange: (key: string, value: any) => void;
  aiSentencesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ mode, humanScore, settings, onSettingChange, aiSentencesCount = 0 }) => {
  const [isCompact, setIsCompact] = useState(false);

  // Calculations
  const displayScore = humanScore !== null ? `${humanScore.toFixed(1)}%` : "--%";
  const aiProb = humanScore !== null ? `${(100 - humanScore).toFixed(1)}%` : "--%";
  
  const humanPart = humanScore !== null ? humanScore : 0;
  const aiPart = humanScore !== null ? Math.max(0, 100 - humanScore - 10) : 0;
  const mixedPart = humanScore !== null ? 100 - humanPart - aiPart : 0;

  // Gauge Logic
  let gaugeColor = "#ef4444"; // default danger
  if (humanScore !== null) {
      if (humanScore > 80) gaugeColor = "#10b981"; // success
      else if (humanScore > 50) gaugeColor = "#f59e0b"; // warning
  }
  const percentage = humanScore !== null ? humanScore : 0;

  return (
    <aside className={`sidebar sidebar-${mode} ${isCompact && mode === 'settings' ? 'compact' : ''}`}>
      {mode === "analysis" ? (
        <div className="sidebar-content animate-fade-in" style={{ padding: '1.5rem 1rem' }}>
             <div className="analysis-header">
                <h3>AI DETECTION LIKELIHOOD</h3>
                <Info size={14} className="info-icon" />
             </div>
             
             {/* Semi-Circle Gauge */}
             <div className="gauge-container">
                <svg viewBox="0 0 200 105" className="gauge-svg">
                  {/* Background Track */}
                  <path 
                    d="M 20 100 A 80 80 0 0 1 180 100" 
                    fill="none" 
                    stroke="var(--bg-surface)" 
                    strokeWidth="16" 
                    strokeLinecap="round"
                  />
                  {/* Value Track */}
                  <path 
                    d="M 20 100 A 80 80 0 0 1 180 100" 
                    fill="none" 
                    stroke={gaugeColor} 
                    strokeWidth="16" 
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - (humanScore !== null ? humanScore : 0) / 100)}
                    className="gauge-progress"
                  />
                </svg>
                <div className="gauge-overlay">
                   <div className="gauge-text">
                     <span className="gauge-percent">{humanScore !== null ? Math.round(humanScore) : 0}%</span>
                     <span className="gauge-label">HUMAN</span>
                   </div>
                </div>
             </div>

             {/* 2x2 Stats Grid */}
             <div className="stats-grid-new">
                 <div className="stat-item">
                    <div className="stat-val-lg">{aiProb}</div>
                    <div className="stat-lbl">AI Probability</div>
                 </div>
                 <div className="stat-item">
                    <div className="stat-val-lg">High</div>
                    <div className="stat-lbl">Confidence</div>
                 </div>
                 <div className="stat-item">
                    <div className={`class-badge ${
                      humanScore !== null ? (humanScore > 80 ? 'human' : humanScore > 50 ? 'mixed' : 'ai') : 'mixed'
                    }`}>
                      {humanScore !== null ? (humanScore > 80 ? 'Human' : humanScore > 50 ? 'Mixed' : 'AI') : 'Mixed'}
                    </div>
                    <div className="stat-lbl">Classification</div>
                 </div>
                 <div className="stat-item">
                    <div className="stat-val-lg">{aiSentencesCount} <Info size={10} className="info-icon-sm" /></div>
                    <div className="stat-lbl">AI Sentences</div>
                 </div>
             </div>

             {/* DETAILED BREAKDOWN (New) */}
             <div className="breakdown-section-new">
                {/* AI ROW */}
                <div className="breakdown-row">
                    <div className="bd-label-group">
                        <span>AI-generated</span>
                        <Info size={12} className="info-icon-sm" title="Text with low perplexity and high consistency." />
                    </div>
                    <div className="bd-value-group">
                        <div className="dot-indicator" style={{ backgroundColor: '#f7a049' }}></div>
                        <span className="bd-value">{humanScore !== null ? `${aiPart.toFixed(1)}%` : "--%"}</span>
                    </div>
                </div>

                {/* MIXED ROW */}
                <div className="breakdown-row">
                    <div className="bd-label-group">
                        <span>Human & AI-refined</span>
                        <Info size={12} className="info-icon-sm" title="Text with mixed signals." />
                    </div>
                    <div className="bd-value-group">
                        <div className="dot-indicator" style={{ backgroundColor: '#a5d6ff' }}></div>
                        <span className="bd-value">{humanScore !== null ? `${mixedPart.toFixed(1)}%` : "--%"}</span>
                    </div>
                </div>

                {/* HUMAN ROW */}
                <div className="breakdown-row">
                    <div className="bd-label-group">
                        <span>Human-written</span>
                        <Info size={12} className="info-icon-sm" title="Text with high entropy and burstiness." />
                    </div>
                    <div className="bd-value-group">
                        <div className="dot-indicator" style={{ backgroundColor: 'transparent', border: '1px solid var(--text-tertiary)' }}></div>
                        <span className="bd-value">{humanScore !== null ? `${humanPart.toFixed(1)}%` : "--%"}</span>
                    </div>
                </div>
             </div>

             <div className="verification-section" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                <div style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <span className="section-label" style={{ marginBottom: 0 }}>PASSED DETECTORS (SIMULATED)</span>
                   <Info size={12} className="info-icon-sm" title="These results are estimated based on local entropy and burstiness analysis. No data is sent to external servers." />
                </div>
                
                <div className="badge-cloud" style={{ justifyContent: 'center' }}>
                  {[
                    { name: "GPTZero", threshold: 60 },
                    { name: "Writer", threshold: 80 },
                    { name: "QuillBot", threshold: 30 },
                    { name: "Copyleaks", threshold: 65 },
                    { name: "Sapling", threshold: 70 },
                    { name: "ZeroGPT", threshold: 40 },
                    { name: "Turnitin", threshold: 85 }
                  ].map(det => {
                     let status = "pending";
                     if (humanScore !== null) {
                         status = humanScore > det.threshold ? "pass" : "fail";
                     }
 
                     return (
                        <div key={det.name} className={`det-badge ${status}`}>
                          {status === "pass" ? (
                             <span style={{ color: "var(--success)", fontWeight: "bold" }}>✓</span>
                          ) : status === "fail" ? (
                             <span style={{ color: "var(--danger)", fontWeight: "bold" }}>✕</span>
                          ) : (
                             <span style={{ color: "var(--text-tertiary)" }}>○</span>
                          )}
                          <span>{det.name}</span>
                        </div>
                     );
                  })}
                </div>
             </div>

             <div className="spacer" style={{ flex: 1 }}></div>

             <div className="truthscan-badge">
                <button className="truthscan-btn">
                   <Zap size={14} fill="currentColor" />
                   Powered by <strong>MyThesisTruth</strong>
                </button>
             </div>
        </div>
      ) : (
        <div className="sidebar-content animate-fade-in">
             <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {!isCompact && <h3>Configuration</h3>}
                <button 
                  onClick={() => setIsCompact(!isCompact)} 
                  className="icon-btn"
                  title={isCompact ? "Expand" : "Compact Mode"}
                >
                   {isCompact ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                </button>
             </div>

             {!isCompact ? (
               <div className="settings-scroll-area animate-fade-in">
                 <div className="settings-group">
                    <span className="section-label">Humanization Strategy</span>
                    <div className="check-row">
                      <input 
                        type="checkbox" 
                        id="vocab" 
                        checked={settings.vocab} 
                        onChange={(e) => onSettingChange("vocab", e.target.checked)} 
                      />
                      <label htmlFor="vocab">
                        <strong>Banned Vocab Filter</strong>
                        <p>Replaces "Utilize", "Leverage", "Delve"...</p>
                      </label>
                    </div>
                    <div className="check-row">
                      <input 
                        type="checkbox" 
                        id="grammar" 
                        checked={settings.grammar} 
                        onChange={(e) => onSettingChange("grammar", e.target.checked)} 
                      />
                      <label htmlFor="grammar">
                        <strong>ESL Grammar Engine</strong>
                        <p>Drops articles, simplifies tenses.</p>
                      </label>
                    </div>
                    <div className="check-row">
                      <input 
                        type="checkbox" 
                        id="structure" 
                        checked={settings.structure} 
                        onChange={(e) => onSettingChange("structure", e.target.checked)} 
                      />
                      <label htmlFor="structure">
                        <strong>Messy Structure</strong>
                        <p>Splits headers, kills bullet points.</p>
                      </label>
                    </div>
                    <div className="check-row">
                       <input 
                        type="checkbox" 
                        id="burst" 
                        checked={settings.burst} 
                        onChange={(e) => onSettingChange("burst", e.target.checked)} 
                       />
                       <label htmlFor="burst">
                         <strong style={{ color: "var(--accent-yellow)" }}>Burstiness Injector</strong>
                         <p>Creates run-on sentences to break AI rhythm.</p>
                       </label>
                    </div>
                 </div>

                 <div className="settings-group">
                    <span className="section-label" style={{ color: "var(--danger)" }}>Aggressive Mode</span>
                    <div className="check-row">
                      <input 
                        type="checkbox" 
                        id="fluff" 
                        checked={settings.fluff} 
                        onChange={(e) => onSettingChange("fluff", e.target.checked)} 
                      />
                      <label htmlFor="fluff">
                        <strong>Subjective Fluff</strong>
                        <p>Inserts "basically," "I guess," "honestly."</p>
                      </label>
                    </div>
                    <div className="check-row">
                      <input 
                        type="checkbox" 
                        id="typo" 
                        checked={settings.typo} 
                        onChange={(e) => onSettingChange("typo", e.target.checked)} 
                      />
                      <label htmlFor="typo">
                        <strong>Lazy Typist (Typos)</strong>
                        <p>Misses commas, lowercases "i", swaps letters.</p>
                      </label>
                    </div>
                 </div>

                 <div className="settings-group">
                    <span className="section-label" style={{ color: "var(--primary)" }}>Semantics</span>
                    <div className="check-row">
                      <input 
                        type="checkbox" 
                        id="simplifier" 
                        checked={settings.simplifier} 
                        onChange={(e) => onSettingChange("simplifier", e.target.checked)} 
                      />
                      <label htmlFor="simplifier">
                        <strong>Smart Simplifier</strong>
                        <p>"High-conductivity" → "Strong signal" manner.</p>
                      </label>
                    </div>
                 </div>

                 <div className="settings-group">
                    <span className="section-label">Intensity Control</span>
                    <input 
                        type="range" 
                        className="intensity-slider" 
                        min="0" 
                        max="100" 
                        value={settings.intensity} 
                        onChange={(e) => onSettingChange("intensity", parseInt(e.target.value))} 
                    />
                    <div className="slider-labels">
                       <span>Safe</span>
                       <strong>{settings.intensity > 80 ? "Chaos" : settings.intensity > 50 ? "Aggressive" : "Safe"}</strong>
                       <span>Chaos</span>
                    </div>
                 </div>
                 
                 <div className="feature-card">
                     <Zap size={20} className="icon-gold" />
                     <div>
                        <strong>Anti-Undetectable Fix</strong>
                        <p>Removes fingerprints left by bypasser tools.</p>
                     </div>
                  </div>
              </div>
             ) : (
               <div className="compact-indicators animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                  <div title="Intensity" style={{ height: '100px', width: '4px', background: 'var(--bg-surface)', borderRadius: '2px', position: 'relative' }}>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${settings.intensity}%`, background: 'var(--primary)', borderRadius: '2px' }} />
                  </div>
                  <Zap size={16} className="icon-gold" style={{ opacity: 0.5 }} />
               </div>
             )}
        </div>
      )}

      <style jsx>{`
        .sidebar {
          background: var(--bg-panel);
          display: flex;
          flex-direction: column;
          height: 100%;
          border-right: 1px solid var(--border-subtle);
          overflow: hidden;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .sidebar-settings {
           width: var(--sidebar-width-left);
           border-right: 1px solid var(--border-subtle);
           border-left: none;
        }

        .sidebar-settings.compact {
           width: 60px;
        }

        .sidebar-analysis {
           width: var(--sidebar-width-right);
           border-left: 1px solid var(--border-subtle);
           border-right: none;
        }

        .sidebar-content {
           flex: 1;
           display: flex;
           flex-direction: column;
           overflow-y: auto;
           padding: 1.5rem;
        }
        
        .sidebar.compact .sidebar-content {
           padding: 1rem 0.5rem;
           overflow: hidden;
        }

        .section-header {
           margin-bottom: 2rem;
           padding-bottom: 1rem;
           border-bottom: 1px solid var(--border-subtle);
           min-height: 45px;
        }
        
        .sidebar.compact .section-header {
           margin-bottom: 1rem;
           border-bottom: none;
           padding-bottom: 0;
           justify-content: center;
        }

        .section-header h3 {
           font-size: 1rem;
           font-weight: 600;
           color: var(--text-primary);
           letter-spacing: -0.02em;
           white-space: nowrap;
        }

        .icon-btn {
           background: transparent;
           border: none;
           color: var(--text-secondary);
           cursor: pointer;
           padding: 4px;
           border-radius: 4px;
           display: flex;
           align-items: center;
           justify-content: center;
        }
        .icon-btn:hover {
           background: var(--bg-surface);
           color: var(--text-primary);
        }

        .section-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        /* Gauge & Stats Styles */
        .score-section {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .gauge-outer {
           width: 180px;
           height: 180px;
           border-radius: 50%;
           margin: 0 auto 1.5rem;
           display: flex;
           align-items: center;
           justify-content: center;
           position: relative;
        }

        .gauge-inner {
           width: 168px;
           height: 168px;
           border-radius: 50%;
           background: var(--bg-panel); 
           display: flex;
           align-items: center;
           justify-content: center;
           z-index: 2;
        }

        .gauge-value h2 {
           font-size: 2.5rem;
           font-weight: 700;
           letter-spacing: -0.04em;
           line-height: 1;
           margin-bottom: 4px;
           color: var(--text-primary);
        }
        .gauge-value span {
           font-size: 0.7rem;
           color: var(--text-tertiary);
           text-transform: uppercase;
           font-weight: 600;
           letter-spacing: 0.1em;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
          margin-bottom: 2rem;
        }
        .stat-card {
           background: var(--bg-surface);
           border: 1px solid var(--border-subtle);
           padding: 0.8rem;
           border-radius: var(--radius-md);
           text-align: center;
        }
        .stat-val {
          display: block;
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .stat-label {
          font-size: 0.65rem;
          color: var(--text-secondary);
          margin-top: 0.2rem;
        }

        .breakdown-section {
          margin-bottom: 2rem;
          background: var(--bg-surface);
          padding: 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }
        .breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .breakdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .desc {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .dot.ai { background: var(--danger); }
        .dot.mixed { background: var(--warning); }
        .dot.human { background: var(--success); }
        .val { font-weight: 600; color: var(--text-primary); font-family: var(--font-mono); }

        .badge-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .det-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--bg-surface);
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          font-size: 0.7rem;
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
        }
        .det-badge.pass {
            color: var(--success);
            border-color: rgba(16, 185, 129, 0.2);
            background: rgba(16, 185, 129, 0.05);
        }
        .det-badge.fail {
            color: var(--danger);
            border-color: rgba(239, 68, 68, 0.2);
            background: rgba(239, 68, 68, 0.05);
        }

        /* Settings Toggle Styles */
        .settings-group {
          margin-bottom: 2.5rem;
        }
        .check-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.2rem;
          cursor: pointer;
          align-items: flex-start;
        }
        .check-row input {
          appearance: none;
          width: 32px;
          height: 18px;
          background: var(--bg-surface);
          border-radius: 99px;
          position: relative;
          cursor: pointer;
          transition: background 0.2s;
          flex-shrink: 0;
          margin-top: 3px;
          border: 1px solid var(--border-subtle);
        }
        .check-row input::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 12px;
          height: 12px;
          background: var(--text-tertiary);
          border-radius: 50%;
          transition: transform 0.2s, background 0.2s;
        }
        .check-row input:checked {
          background: var(--primary);
          border-color: var(--primary);
        }
        .check-row input:checked::after {
          transform: translateX(14px);
          background: #fff;
        }

        .check-row label strong {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 0.2rem;
          color: var(--text-primary);
        }
        .check-row label p {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          line-height: 1.4;
        }
        
        /* Range Slider */
        .intensity-slider {
           -webkit-appearance: none;
           width: 100%;
           height: 4px;
           background: var(--bg-surface);
           border-radius: 2px;
           margin: 1rem 0;
        }
        .intensity-slider::-webkit-slider-thumb {
           -webkit-appearance: none;
           width: 16px;
           height: 16px;
           background: var(--primary);
           border-radius: 50%;
           cursor: pointer;
           border: 2px solid var(--bg-panel);
           box-shadow: 0 0 0 1px var(--primary);
        }
        .slider-labels {
           display: flex;
           justify-content: space-between;
           font-size: 0.7rem;
           color: var(--text-tertiary);
        }
        
        .feature-card {
           display: flex;
           align-items: center;
           gap: 1rem;
           background: var(--bg-surface);
           padding: 1rem;
           border-radius: var(--radius-md);
           border: 1px solid var(--border-subtle);
           margin-top: 1rem;
        }
        .icon-gold {
           color: var(--accent-yellow);
        }
        .feature-card strong {
           font-size: 0.8rem;
           display: block;
           color: var(--text-primary);
        }
        .feature-card p {
           font-size: 0.7rem;
           color: var(--text-tertiary);
        }
        /* New Analysis Styles */
        .analysis-header {
           display: flex;
           align-items: center;
           gap: 0.5rem;
           margin-bottom: 2rem;
           justify-content: center;
        }
        .analysis-header h3 {
           font-size: 0.9rem;
           font-weight: 700;
           color: var(--text-primary);
           letter-spacing: -0.01em;
        }
        .info-icon {
           color: var(--text-tertiary);
           cursor: pointer;
        }

        .gauge-container {
           position: relative;
           width: 200px;
           height: 110px;
           margin: 0 auto 2rem;
           display: flex;
           justify-content: center;
        }
        .gauge-svg {
           width: 100%;
           height: 100%;
           overflow: visible;
        }
        .gauge-progress {
           transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .gauge-overlay {
           position: absolute;
           bottom: 0;
           left: 0;
           right: 0;
           display: flex;
           justify-content: center;
           align-items: flex-end;
           height: 100%;
           padding-bottom: 0px;
        }
        .gauge-text {
           text-align: center;
           transform: translateY(10px);
        }
        .gauge-percent {
           display: block;
           font-size: 2.2rem;
           font-weight: 800;
           color: var(--text-primary);
           line-height: 1;
        }
        .gauge-label {
            font-size: 0.9rem;
            font-weight: 700;
            color: var(--text-primary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .stats-grid-new {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 1.5rem 1rem;
           text-align: center;
           margin-bottom: auto;
        }
        .stat-item {
           display: flex;
           flex-direction: column;
           align-items: center;
           gap: 0.3rem;
        }
        .stat-val-lg {
           font-size: 1.2rem;
           font-weight: 700;
           color: var(--text-primary);
        }
        .stat-lbl {
           font-size: 0.8rem;
           color: var(--text-tertiary);
        }
        .class-badge {
           padding: 2px 8px;
           border-radius: 4px;
           font-size: 0.9rem;
           font-weight: 700;
           display: inline-block;
        }
        .class-badge.mixed {
           background: rgba(234, 179, 8, 0.15);
           color: #eab308;
           border: 1px solid rgba(234, 179, 8, 0.3);
        }
        .class-badge.human {
           background: rgba(16, 185, 129, 0.15);
           color: #10b981;
           border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .class-badge.ai {
           background: rgba(239, 68, 68, 0.15);
           color: #ef4444; 
           border: 1px solid rgba(239, 68, 68, 0.3);
        }
        
        .truthscan-badge {
           margin-top: 2rem;
           display: flex;
           justify-content: center;
        }
        .truthscan-btn {
           display: flex;
           align-items: center;
           gap: 0.5rem;
           padding: 0.6rem 1.2rem;
           border-radius: 99px;
           background: rgba(59, 130, 246, 0.1);
           color: #3b82f6;
           font-size: 0.85rem;
           border: 1px solid rgba(59, 130, 246, 0.3);
           transition: all 0.2s;
        }
        .truthscan-btn:hover {
           background: rgba(59, 130, 246, 0.2);
           transform: translateY(-1px);
        }
        .breakdown-section-new {
           margin-top: 1.5rem;
           border-top: 1px solid var(--border-subtle);
           padding-top: 1.5rem;
           display: flex;
           flex-direction: column;
           gap: 1rem;
        }
        .breakdown-row {
           display: flex;
           align-items: center;
           justify-content: space-between;
           font-size: 0.85rem;
           color: var(--text-secondary);
        }
        .bd-label-group {
           display: flex;
           align-items: center;
           gap: 0.5rem;
           color: var(--text-primary);
        }
        .bd-value-group {
           display: flex;
           align-items: center;
           gap: 0.8rem;
        }
        .dot-indicator {
           width: 10px;
           height: 10px;
           border-radius: 50%;
        }
        .bd-value {
           font-weight: 700;
           font-family: var(--font-mono);
           color: var(--text-primary);
           min-width: 45px;
           text-align: right;
        }
        .info-icon-sm {
           color: var(--text-tertiary);
           cursor: help;
        }
      `}</style>
    </aside>
  );
};
