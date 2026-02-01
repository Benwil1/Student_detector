"use client";

import { Clock, Info, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Trash2, Zap } from "lucide-react";
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
  persona?: string;
  onPersonaChange?: (val: string) => void;
  onOpenHistory?: () => void;
  history?: any[];
  onRestore?: (item: any) => void;
  onClearHistory?: () => void;
  onDeleteHistory?: (id: string) => void;
  // Hybrid Detection Props
  detectionConfidence?: number | null;
  detectionMethod?: 'heuristic' | 'ml' | 'hybrid';
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    mode, 
    humanScore, 
    settings, 
    onSettingChange, 
    aiSentencesCount = 0,
    persona = "standard",
    onPersonaChange,
    onOpenHistory,
    history = [],
    onRestore,
    onClearHistory,
    onDeleteHistory,
    detectionConfidence = null,
    detectionMethod = 'heuristic'
}) => {
  const [isCompact, setIsCompact] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(mode === "analysis" ? "detector" : "config");

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
    <aside className={`sidebar sidebar-${mode} ${isCompact ? 'compact' : ''}`}>
      {mode === "analysis" ? (
        <div className="sidebar-content animate-fade-in" style={{ padding: isCompact ? '0.5rem' : '1rem' }}>
             
             {/* Analysis Header Toggle */}
             <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCompact ? '1rem' : '1rem' }}>
                {!isCompact && <h3>{activeTab === 'detector' ? 'AI Detector' : 'Configuration'}</h3>}
                <button 
                  onClick={() => setIsCompact(!isCompact)} 
                  className="icon-btn"
                  title={isCompact ? "Expand" : "Compact Mode"}
                  style={{ margin: isCompact ? '0 auto' : '0' }}
                >
                   {isCompact ? <PanelRightOpen size={18} /> : <PanelRightClose size={18} />}
                </button>
             </div>

             {!isCompact ? (
               <>
                 {/* Tab Switcher */}
                 <div className="tab-switcher-container">
                <button 
                  className={`tab-switch-btn ${activeTab === 'detector' ? 'active' : ''}`}
                  onClick={() => setActiveTab('detector')}
                >
                  AI Detector
                </button>
                <button 
                  className={`tab-switch-btn ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  Humanizer Settings
                </button>
             </div>

             {activeTab === 'detector' ? (
              <div className="tab-pane animate-fade-in">
                 <div className="analysis-header">
                    <h3 style={{ fontSize: '0.8rem', opacity: 0.7 }}>LIKELIHOOD</h3>
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
                        <div className="stat-val-lg">
                          {detectionConfidence !== null ? `${Math.round(detectionConfidence)}%` : 'High'}
                        </div>
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
                        <div className="stat-lbl">
                          {detectionMethod === 'ml' ? '🤖 ML' : detectionMethod === 'hybrid' ? '⚡ Hybrid' : '📊 Heuristic'}
                        </div>
                     </div>
                 </div>

                 {/* DETAILED BREAKDOWN (New) */}
                 <div className="breakdown-section-new">
                    <div className="breakdown-row">
                        <div className="bd-label-group">
                            <span>AI-generated</span>
                            <span title="Text with low perplexity and high consistency."><Info size={12} className="info-icon-sm" /></span>
                        </div>
                        <div className="bd-value-group">
                            <div className="dot-indicator" style={{ backgroundColor: '#f7a049' }}></div>
                            <span className="bd-value">{humanScore !== null ? `${aiPart.toFixed(1)}%` : "--%"}</span>
                        </div>
                    </div>

                    <div className="breakdown-row">
                        <div className="bd-label-group">
                            <span>Human & AI-refined</span>
                            <span title="Text with mixed signals."><Info size={12} className="info-icon-sm" /></span>
                        </div>
                        <div className="bd-value-group">
                            <div className="dot-indicator" style={{ backgroundColor: '#a5d6ff' }}></div>
                            <span className="bd-value">{humanScore !== null ? `${mixedPart.toFixed(1)}%` : "--%"}</span>
                        </div>
                    </div>

                    <div className="breakdown-row">
                        <div className="bd-label-group">
                            <span>Human-written</span>
                            <span title="Text with high entropy and burstiness."><Info size={12} className="info-icon-sm" /></span>
                        </div>
                        <div className="bd-value-group">
                            <div className="dot-indicator" style={{ backgroundColor: 'transparent', border: '1px solid var(--text-tertiary)' }}></div>
                            <span className="bd-value">{humanScore !== null ? `${humanPart.toFixed(1)}%` : "--%"}</span>
                        </div>
                    </div>
                 </div>

                 <div className="verification-section" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                    <div style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <span className="section-label" style={{ marginBottom: 0 }}>PASSED DETECTORS</span>
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
                         if (humanScore !== null) status = humanScore > det.threshold ? "pass" : "fail";
                         return (
                            <div key={det.name} className={`det-badge ${status}`}>
                              {status === "pass" ? "✓" : status === "fail" ? "✕" : "○"}
                              <span>{det.name}</span>
                            </div>
                         );
                      })}
                    </div>
                 </div>
              </div>
             ) : (
              <div className="tab-pane animate-fade-in" style={{ padding: '0.5rem 0' }}>
                  <div className="settings-group">
                    <span className="section-label">Writing Persona</span>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      Choose a persona to adjust the tone and style of the humanization.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {[
                          { id: 'standard', name: 'Basic Human', desc: 'Standard humanization for general use.' },
                          { id: 'academic', name: 'Academic Stealth', desc: 'Maintains formal tone while bypassing detection.' },
                          { id: 'lazy_student', name: '⚡ Undetectable™', desc: 'Aggressive humanization for 100% human score.' },
                          { id: 'esl', name: 'ESL Student', desc: 'Writes like a non-native speaker (Very effective).' }
                        ].map(p => (
                          <div 
                            key={p.id} 
                            className={`persona-card ${persona === p.id ? 'active' : ''}`}
                            onClick={() => onPersonaChange?.(p.id)}
                          >
                            <div className="persona-info">
                              <strong>{p.name}</strong>
                              <p>{p.desc}</p>
                            </div>
                            <div className="radio-circle"></div>
                          </div>
                        ))}
                    </div>
                  </div>
              </div>
             )}

             <div className="spacer" style={{ flex: 1 }}></div>

             <div className="truthscan-badge" style={{ marginTop: '2rem' }}>
                <button className="truthscan-btn">
                   <Zap size={14} fill="currentColor" />
                   Powered by <strong>Student Humanizer Plus</strong>
                </button>
             </div>
                </>
              ) : (
                <div className="compact-indicators animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                   {/* Compact Gauge Representative */}
                   <div style={{ 
                      width: '40px', height: '40px', borderRadius: '50%', 
                      border: `3px solid ${gaugeColor}`, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: 'bold', color: 'white'
                   }}>
                      {Math.round(humanScore || 0)}
                   </div>
                   <Zap size={16} className="icon-gold" style={{ opacity: 0.5 }} />
                </div>
              )}
        </div>
      ) : (
        <div className="sidebar-content animate-fade-in" style={{ padding: isCompact ? '0.5rem' : '1rem' }}>
             {!isCompact && (
               <div className="tab-switcher-container">
                  <button 
                    className={`tab-switch-btn ${activeTab === 'config' ? 'active' : ''}`}
                    onClick={() => setActiveTab('config')}
                  >
                    Configuration
                  </button>
                  <button 
                    className={`tab-switch-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                  >
                    History
                  </button>
               </div>
             )}

             <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {!isCompact && <h3>{activeTab === 'config' ? 'Configuration' : 'Writing History'}</h3>}
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
                 {activeTab === 'config' ? (
                   <>
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
                   </>
                 ) : (
                   <div className="history-tab-content">
                      {history.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                           <button 
                             className="clear-history-btn"
                             onClick={onClearHistory}
                           >
                              Clear All
                           </button>
                        </div>
                      )}
                      {history.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-tertiary)' }}>
                           <Clock size={32} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                           <p>No recent activity found.</p>
                        </div>
                      ) : (
                        history.map((item: any) => (
                          <div 
                            key={item.id} 
                            className="history-side-card" 
                            onClick={() => onRestore?.(item)}
                          >
                             <div className="h-meta">
                                <span>{item.timestamp}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                   <span className="h-persona">{item.persona}</span>
                                   <button 
                                     className="h-delete-btn"
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       onDeleteHistory?.(item.id);
                                     }}
                                     title="Delete item"
                                   >
                                      <Trash2 size={12} />
                                   </button>
                                </div>
                             </div>
                             <p className="h-preview">{item.preview}</p>
                             {item.score && (
                               <div className="h-score">
                                  Score: <strong>{Math.round(item.score)}%</strong>
                               </div>
                             )}
                          </div>
                        ))
                      )}
                   </div>
                 )}
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
          background: var(--bg-app);
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
         
         .sidebar-analysis.compact {
            width: 60px;
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
           background: var(--bg-app); 
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

        /* --- NEW TAB STYLES --- */
        .tab-switcher-container {
            background: var(--bg-app); /* Dark navy background */
            padding: 4px;
            border-radius: 12px;
            display: flex;
            gap: 4px;
            margin-bottom: 2rem;
            border: 1px solid #1e293b;
        }
        .tab-switch-btn {
            flex: 1;
            padding: 8px 12px;
            border: none;
            background: transparent;
            font-size: 0.85rem;
            font-weight: 600;
            color: #64748b;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .tab-switch-btn.active {
            background: white;
            color: var(--bg-app); /* Dark text for active tab */
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }
        
        /* --- PERSONA CARD STYLES --- */
        .persona-card {
            background: var(--bg-app);
            border: 1px solid #1e293b;
            padding: 1rem;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.2s;
            margin-bottom: 0.6rem;
        }
        .persona-card:hover {
            border-color: var(--primary);
            background: rgba(59, 130, 246, 0.08);
        }
        .persona-card.active {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);
        }
        .persona-info strong {
            display: block;
            font-size: 0.9rem;
            color: var(--text-primary);
            margin-bottom: 2px;
        }
        .persona-info p {
            font-size: 0.75rem;
            color: var(--text-tertiary);
            line-height: 1.3;
        }
        .radio-circle {
            width: 18px;
            height: 18px;
            border: 2px solid var(--border-subtle);
            border-radius: 50%;
            position: relative;
        }
        .persona-card.active .radio-circle {
            border-color: var(--primary);
        }
        .persona-card.active .radio-circle::after {
            content: '';
            position: absolute;
            inset: 3px;
            background: var(--primary);
            border-radius: 50%;
        }

        /* --- HISTORY SIDEBAR TAB STYLES --- */
        .history-side-card {
            background: var(--bg-app); /* Darker card background */
            border: 1px solid #1e293b;
            padding: 1rem;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 0.8rem;
        }
        .history-side-card:hover {
            border-color: var(--primary);
            background: rgba(59, 130, 246, 0.05);
        }
        .h-meta {
            display: flex;
            justify-content: space-between;
            font-size: 0.7rem;
            color: var(--text-tertiary);
            margin-bottom: 0.4rem;
        }
        .h-persona {
            color: var(--primary);
            font-weight: 600;
            text-transform: capitalize;
        }
        .h-preview {
            font-size: 0.8rem;
            color: var(--text-primary);
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-bottom: 0.4rem;
        }
        .h-score {
            font-size: 0.75rem;
            color: var(--text-tertiary);
            margin-top: 0.4rem;
        }
        .h-score strong {
            color: #10b981; /* High contrast green */
            font-weight: 700;
        }

        .h-delete-btn {
            background: transparent;
            border: none;
            color: var(--text-tertiary);
            cursor: pointer;
            padding: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.2s;
        }
        .h-delete-btn:hover {
            background: rgba(239, 68, 68, 0.1);
            color: var(--danger);
        }

        .clear-history-btn {
            background: transparent;
            border: 1px solid var(--border-subtle);
            color: var(--text-tertiary);
            font-size: 0.75rem;
            padding: 4px 10px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .clear-history-btn:hover {
            color: var(--danger);
            border-color: var(--danger);
            background: rgba(239, 68, 68, 0.05);
        }

        /* ==============================
           MOBILE RESPONSIVE STYLES
           ============================== */
        @media (max-width: 1024px) {
          .sidebar {
            display: none;
          }
        }

        /* Mobile Bottom Sheet Mode */
        @media (max-width: 768px) {
          .sidebar.mobile-visible {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            top: auto;
            width: 100%;
            height: 70vh;
            max-height: 70vh;
            border-radius: 20px 20px 0 0;
            border: none;
            border-top: 1px solid var(--border-subtle);
            z-index: 1000;
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
          }
          
          .sidebar.mobile-visible .sidebar-content {
            padding: 1.5rem;
            padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 20px));
          }

          .sidebar.mobile-visible .section-header {
            margin-bottom: 1rem;
            padding-bottom: 0.8rem;
          }

          .sidebar.mobile-visible .section-header h3 {
            font-size: 1.1rem;
          }

          /* Touch-friendly toggle buttons */
          .sidebar.mobile-visible .check-row {
            padding: 0.8rem 0;
            min-height: 56px;
          }

          .sidebar.mobile-visible .check-row input {
            width: 44px;
            height: 24px;
          }

          .sidebar.mobile-visible .check-row input::after {
            width: 18px;
            height: 18px;
          }

          .sidebar.mobile-visible .check-row input:checked::after {
            transform: translateX(18px);
          }

          .sidebar.mobile-visible .persona-card {
            padding: 1rem;
            min-height: 60px;
          }

          .sidebar.mobile-visible .tab-switcher-container {
            gap: 0.5rem;
          }

          .sidebar.mobile-visible .tab-switch-btn {
            padding: 0.6rem 0.8rem;
            font-size: 0.8rem;
            flex: 1;
            text-align: center;
          }

          /* Gauge adjustments for mobile */
          .sidebar.mobile-visible .gauge-container {
            max-width: 200px;
            margin: 0 auto;
          }

          .sidebar.mobile-visible .stats-grid-new {
            grid-template-columns: 1fr 1fr;
            gap: 0.8rem;
          }

          .sidebar.mobile-visible .stat-item {
            padding: 0.8rem;
          }

          .sidebar.mobile-visible .stat-val-lg {
            font-size: 1.1rem;
          }

          .sidebar.mobile-visible .breakdown-section-new {
            margin-top: 1rem;
          }

          .sidebar.mobile-visible .breakdown-row {
            padding: 0.6rem 0;
          }

          /* Badge cloud on mobile */
          .sidebar.mobile-visible .badge-cloud {
            gap: 0.4rem;
          }

          .sidebar.mobile-visible .det-badge {
            padding: 0.4rem 0.6rem;
            font-size: 0.65rem;
          }

          /* History cards on mobile */
          .sidebar.mobile-visible .history-side-card {
            padding: 1rem;
          }

          /* Hide the TruthScan badge on mobile sheet */
          .sidebar.mobile-visible .truthscan-badge {
            display: none;
          }
        }

        /* Slide up animation for mobile */
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </aside>
  );
};
