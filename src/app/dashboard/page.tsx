"use client";

import { WebsiteNavbar } from "@/components/WebsiteNavbar";
import { ArrowRight, CheckCircle2, Crown, FileDiff, RefreshCw, ScanSearch, ShieldCheck, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function DashboardPage() {
  return (
    <div className="dashboard-wrapper animate-fade-in">
      <WebsiteNavbar />
      
      <main className="dashboard-main">
        
        {/* Compact Hero */}
        <div className="hero-header">
           <div className="left-hero">
              <h1>Welcome back, <span className="text-grad">Bernard</span></h1>
              <p>Your academic toolkit is ready.</p>
           </div>
           <div className="right-hero">
              <div className="usage-pill">
                  <ShieldCheck size={14} className="text-green-400" />
                  <span className="scans-text"><b>12</b> / 100 Scans</span>
              </div>
              <div className="plan-pill">
                 <Zap size={14} className="text-yellow-400" />
                 <span>PRO</span>
              </div>
           </div>
        </div>

        {/* PRIMARY TOOLS - The "Workforce" */}
        <section className="primary-grid">
           {/* Humanizer - The Star */}
           <Link href="/editor" className="tool-card primary-card group">
              <div className="card-bg-gradient cyan-grad"></div>
              <div className="card-header">
                 <div className="icon-box cyan">
                    <Sparkles size={28} />
                 </div>
                 <div className="arrow-btn">
                    <ArrowRight size={20} />
                 </div>
              </div>
              <div className="card-body">
                 <h3>AI Humanizer</h3>
                 <p>Transform text to bypass AI detectors with natural flow.</p>
              </div>
           </Link>

           {/* Detector - The Validator (With Animation) */}
           <Link href="/editor" className="tool-card primary-card group detector-card">
              <div className="card-bg-gradient purple-grad"></div>
              
              <div className="card-header relative-z">
                 <div className="icon-box purple">
                     <ScanSearch size={28} />
                 </div>
                 <div className="arrow-btn">
                    <ArrowRight size={20} />
                 </div>
              </div>
              
              <div className="card-body relative-z">
                 <h3>AI Detector</h3>
                 <p>Scan content for AI patterns with 99% accuracy.</p>
              </div>
           </Link>
        </section>

        {/* SECONDARY / UPCOMING - Clean Row */}
        <h4 className="section-label">Coming Soon</h4>
        <section className="secondary-grid">
           
           <div className="tool-card secondary-card">
              <div className="coming-soon-pill">Coming Soon</div>
              <div className="icon-mini blue"><FileDiff size={20} /></div>
              <span>Similarity Check</span>
           </div>

           <div className="tool-card secondary-card">
              <div className="coming-soon-pill">Coming Soon</div>
              <div className="icon-mini rose"><RefreshCw size={20} /></div>
              <span>Paraphraser</span>
           </div>

           <div className="tool-card secondary-card">
              <div className="coming-soon-pill">Coming Soon</div>
              <div className="icon-mini amber"><CheckCircle2 size={20} /></div>
              <span>Grammar Check</span>
           </div>

        </section>

        {/* PROMO BANNER */}
        <div className="promo-banner">
            <div className="promo-left">
               <div className="crown-icon">
                  <Crown size={24} color="#f59e0b" />
               </div>
               <div>
                  <h3>Unlock Full Potential</h3>
                  <p>Invite friends to earn free generations.</p>
               </div>
            </div>
            <button className="invite-btn">Invite Friends</button>
        </div>

      </main>

      <style jsx>{`
        .dashboard-wrapper {
          min-height: 100vh;
          background: #020617;
          background-image: 
             radial-gradient(circle at 15% 15%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
             radial-gradient(circle at 85% 30%, rgba(168, 85, 247, 0.08) 0%, transparent 40%);
          padding-top: 100px;
          color: white;
        }

        .dashboard-main {
           max-width: 900px;
           margin: 0 auto;
           padding: 0 2rem 4rem;
        }

        /* HEADER */
        .hero-header {
           display: flex;
           justify-content: space-between;
           align-items: flex-end;
           margin-bottom: 2.5rem;
           padding-bottom: 1.5rem;
           border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .left-hero h1 { font-size: 1.8rem; font-weight: 700; margin-bottom: 0.2rem; }
        .text-grad {
           background: linear-gradient(to right, #60a5fa, #a855f7);
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
        }
        .left-hero p { color: #94a3b8; font-size: 0.95rem; }

        .right-hero { display: flex; gap: 0.8rem; }
        .usage-pill, .plan-pill {
           background: rgba(15, 23, 42, 0.6);
           border: 1px solid rgba(255,255,255,0.08);
           padding: 6px 14px;
           border-radius: 99px;
           display: flex; align-items: center; gap: 6px;
           font-size: 0.8rem; color: #cbd5e1;
        }
        .scans-text b { color: white; }
        .plan-pill span { font-weight: 800; color: white; letter-spacing: 0.05em; font-size: 0.7rem; }

        /* PRIMARY GRID */
        .primary-grid {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 1.5rem;
           margin-bottom: 2.5rem;
        }

        .tool-card {
           background: rgba(30, 41, 59, 0.4);
           border: 1px solid rgba(255, 255, 255, 0.05);
           border-radius: 20px;
           text-decoration: none;
           padding: 1.8rem;
           position: relative;
           overflow: hidden;
           transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        .primary-card {
           display: flex; flex-direction: column; height: 240px;
           justify-content: space-between;
           z-index: 1;
        }
        
        .tool-card:hover {
           background: rgba(30, 41, 59, 0.6);
           border-color: rgba(255, 255, 255, 0.15);
           transform: translateY(-4px);
           box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.4);
        }

        .card-bg-gradient {
           position: absolute; top: 0; right: 0; width: 200px; height: 200px;
           filter: blur(90px); opacity: 0.1; transition: opacity 0.3s;
        }
        .group:hover .card-bg-gradient { opacity: 0.2; }
        .cyan-grad { background: #06b6d4; }
        .purple-grad { background: #a855f7; }

        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
        .relative-z { position: relative; z-index: 2; }

        .icon-box {
           width: 50px; height: 50px; border-radius: 12px;
           display: flex; align-items: center; justify-content: center;
           background: rgba(255,255,255,0.05);
           border: 1px solid rgba(255,255,255,0.05);
           color: white;
        }
        .cyan { color: #22d3ee; } 
        .purple { color: #c084fc; }

        .arrow-btn {
           width: 36px; height: 36px; border-radius: 50%;
           display: flex; align-items: center; justify-content: center;
           border: 1px solid rgba(255,255,255,0.1);
           color: #94a3b8; opacity: 0.6;
           transform: rotate(-45deg); transition: all 0.3s;
        }
        .group:hover .arrow-btn { 
           opacity: 1; transform: rotate(0deg); 
           background: white; color: #020617; border-color: white;
        }

        .card-body h3 { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem; color: white; }
        .card-body p { font-size: 0.95rem; color: #94a3b8; line-height: 1.5; }

        .card-body h3 { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem; color: white; }
        .card-body p { font-size: 0.95rem; color: #94a3b8; line-height: 1.5; }

        /* SECONDARY GRID */
        .section-label {
           font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;
           color: #64748b; margin-bottom: 1rem; font-weight: 600;
        }

        .secondary-grid {
           display: grid;
           grid-template-columns: repeat(3, 1fr);
           gap: 1rem;
           margin-bottom: 3rem;
        }

        .secondary-card {
           padding: 1.5rem 1.2rem;
           display: flex; flex-direction: column; align-items: center; justify-content: center;
           gap: 0.8rem; text-align: center;
           background: transparent;
           border: 1px dashed rgba(255,255,255,0.1);
           opacity: 0.8;
           position: relative;
        }
        .secondary-card:hover { opacity: 1; border-style: solid; border-color: rgba(255,255,255,0.15); background: rgba(30, 41, 59, 0.3); transform: none; box-shadow: none; }

        .coming-soon-pill {
           position: absolute; top: 10px; right: 10px;
           font-size: 0.6rem; text-transform: uppercase;
           background: rgba(255,255,255,0.05); color: #94a3b8;
           padding: 2px 6px; border-radius: 4px; font-weight: 700;
           letter-spacing: 0.05em;
        }

        .icon-mini {
           width: 44px; height: 44px; border-radius: 12px;
           display: flex; align-items: center; justify-content: center;
           background: rgba(255,255,255,0.05);
           margin-bottom: 0.2rem;
        }
        .secondary-card span { font-size: 0.95rem; font-weight: 600; color: #cbd5e1; }
        .blue { color: #60a5fa; }
        .rose { color: #f43f5e; }
        .amber { color: #fbbf24; }

        /* PROMO */
        .promo-banner {
           background: linear-gradient(90deg, #1e3a8a 0%, #172554 100%);
           border: 1px solid #1e40af;
           border-radius: 16px;
           padding: 1.5rem 2rem;
           display: flex; align-items: center; justify-content: space-between;
           box-shadow: 0 10px 30px -10px rgba(30, 58, 138, 0.4);
        }

        .promo-left { display: flex; align-items: center; gap: 1rem; }
        .crown-icon {
           width: 48px; height: 48px; background: rgba(0,0,0,0.2); border-radius: 12px;
           display: flex; align-items: center; justify-content: center;
        }
        .promo-left h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.2rem; }
        .promo-left p { color: #bfdbfe; font-size: 0.9rem; }

        .invite-btn {
           background: white; color: #1e3a8a; border: none;
           padding: 0.8rem 1.4rem; border-radius: 10px; font-weight: 700; font-size: 0.9rem;
           cursor: pointer; transition: transform 0.2s;
        }
        .invite-btn:hover { transform: scale(1.05); }

        @media (max-width: 768px) {
           .primary-grid { grid-template-columns: 1fr; }
        @media (max-width: 768px) {
           .dashboard-wrapper { padding-top: 80px; }
           .dashboard-main { padding: 0 1.25rem 3rem; }

           /* Hero Mobile */
           .hero-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; margin-bottom: 2rem; }
           .left-hero h1 { font-size: 1.6rem; line-height: 1.2; }
           .right-hero { width: 100%; overflow-x: auto; padding-bottom: 4px; }
           .usage-pill, .plan-pill { flex-shrink: 0; }

           /* Primary Grid Mobile */
           .primary-grid { grid-template-columns: 1fr; gap: 1rem; margin-bottom: 2rem; }
           .primary-card { height: auto; min-height: 160px; }
           
           /* Secondary Grid Mobile - List Style */
           .secondary-grid { grid-template-columns: 1fr; gap: 0.8rem; }
           .secondary-card { 
              flex-direction: row; 
              justify-content: flex-start; 
              padding: 1rem; 
              text-align: left;
              gap: 1rem;
           }
           .secondary-card .icon-mini { margin-bottom: 0; width: 36px; height: 36px; }
           .secondary-card span { font-size: 1rem; }
           .coming-soon-pill { 
              position: static; 
              margin-left: auto; /* Push to right */
           }

           /* Promo Mobile */
           .promo-banner { flex-direction: column; text-align: center; gap: 1.5rem; padding: 1.5rem; }
           .promo-left { flex-direction: column; gap: 1rem; }
           .invite-btn { width: 100%; padding: 1rem; font-size: 1rem; }
        }
      `}</style>
    </div>
  );
}
