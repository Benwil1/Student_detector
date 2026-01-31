"use client";

import { WebsiteNavbar } from "@/components/WebsiteNavbar";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle, Cpu, Facebook, GraduationCap, Instagram, Landmark, Linkedin, MessageSquare, Shield, Star, TreePine, Twitter, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Only use scroll when mounted to prevent hydration errors
  const scrollConfig = isMounted ? {
    target: containerRef,
    offset: ["start start" as const, "end start" as const]
  } : undefined;
  
  const { scrollYProgress } = useScroll(scrollConfig);

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const rotateMockup = useTransform(scrollYProgress, [0, 1], [0, -10]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.observer-reveal').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, [isMounted]);

  // Show loading screen until React mounts to prevent FOUC
  if (!isMounted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#020617',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(59, 130, 246, 0.3)',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="landing-wrapper" ref={containerRef}>
      <WebsiteNavbar />
      
      {/* 1. HERO SECTION */}
      <section className="hero">
        <div className="hero-container">
          <motion.div 
            className="hero-text reveal-anim"
            style={{ y: y1 }}
          >
            <div className="hero-pill">• Secure & Academic Ready</div>
            
            <h1>
              Turn AI Text Into <br />
              <span className="accent-blue">Human Masterpieces</span>
            </h1>
            
            <p className="hero-subtitle">
              Don't just spin your text. Our engine refactors syntax and rhythm to mimic how humans actually think and write. Completely undetectable, every time.
            </p>
            
            <div className="hero-actions">
              <Link href="/editor" className="btn-primary">
                Start Humanizing
                <ArrowRight size={18} />
              </Link>
              <Link href="/editor" className="btn-secondary">
                View Personal History
              </Link>
            </div>
          </motion.div>

          {/* KEEPING FLOATING VISUALS + SCROLL PARALLAX */}
          <motion.div 
            className="hero-visual"
            style={{ y: y2, rotate: rotateMockup }}
          >
            <div className="mockup-stack">
              <motion.div 
                className="mockup-main shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="mockup-screen">
                  <div className="ms-header">
                    <span className="ms-title">Writing Assistant</span>
                  </div>
                  <div className="ms-content">
                    <motion.div 
                      className="ms-scroll-container"
                      animate={{ y: [0, -80] }}
                      transition={{ 
                        duration: 10, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                    >
                      <div className="ms-line full" />
                      <div className="ms-line med" />
                      <div className="ms-diff ins">Actually, this study proves...</div>
                      <div className="ms-diff del">In conclusion, it's good.</div>
                      <div className="ms-line short" />
                      <div className="ms-line full" />
                      <div className="ms-diff ins">Human-like rhythm detected.</div>
                      <div className="ms-line med" />
                      <div className="ms-line full" />
                      <div className="ms-line med" />
                      <div className="ms-diff ins">Actually, this study proves...</div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUSTED BY UNIVERSITIES */}
      <section className="trusted-section">
        <div className="container">
          <div className="trusted-content">
            <h2 className="trusted-title">
              Trusted by students in<br />top universities
            </h2>
            <p className="trusted-subtitle">
              Empowering intelligence and innovation across the<br />worlds top universities
            </p>
          </div>
            
          <motion.div 
            className="logos-carousel-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
                <div className="logos-track">
                  {/* FIRST SET */}
                  <div className="uni-badge-text">
                     <div className="u-shield red">VERITAS</div>
                     <div className="u-text-col">
                        <span className="u-name serif">HARVARD</span>
                        <span className="u-sub">UNIVERSITY</span>
                     </div>
                  </div>

                  <div className="uni-badge-text">
                     <TreePine size={32} color="#8C1515" fill="#8C1515" />
                     <div className="u-text-col">
                        <span className="u-name serif">Stanford</span>
                        <span className="u-sub">University</span>
                     </div>
                  </div>

                  <div className="uni-badge-text">
                     <div className="mit-logo">
                        <div className="bar"></div><div className="bar"></div><div className="bar short"></div>
                     </div>
                     <div className="u-text-col">
                        <span className="u-name slab" style={{letterSpacing: '2px'}}>MIT</span>
                        <span className="u-sub">Massachusetts Institute of Technology</span>
                     </div>
                  </div>

                  <div className="uni-badge-text">
                     <Shield size={30} fill="#ffffff" color="#ffffff" />
                     <div className="u-text-col">
                        <span className="u-name serif">Durham</span>
                        <span className="u-sub">University</span>
                     </div>
                  </div>

                  <div className="uni-badge-text">
                     <BookOpen size={30} fill="#ffffff" color="#ffffff" />
                     <div className="u-text-col">
                        <span className="u-name serif">OXFORD</span>
                        <span className="u-sub">UNIVERSITY</span>
                     </div>
                  </div>

                  <div className="uni-badge-text">
                     <Landmark size={30} fill="#A3C1AD" color="#A3C1AD" />
                     <div className="u-text-col">
                         <span className="u-name serif">Cambridge</span>
                         <span className="u-sub">UNIVERSITY</span>
                     </div>
                  </div>

                  {/* DUPLICATE FOR SCROLL */}
                  <div className="uni-badge-text">
                     <div className="u-shield red">VERITAS</div>
                     <div className="u-text-col">
                        <span className="u-name serif">HARVARD</span>
                        <span className="u-sub">UNIVERSITY</span>
                     </div>
                  </div>

                  <div className="uni-badge-text">
                     <TreePine size={32} color="#8C1515" fill="#8C1515" />
                     <div className="u-text-col">
                        <span className="u-name serif">Stanford</span>
                        <span className="u-sub">University</span>
                     </div>
                  </div>

                  <div className="uni-badge-text">
                     <div className="mit-logo">
                        <div className="bar"></div><div className="bar"></div><div className="bar short"></div>
                     </div>
                     <div className="u-text-col">
                        <span className="u-name slab" style={{letterSpacing: '2px'}}>MIT</span>
                        <span className="u-sub">Massachusetts Institute of Technology</span>
                     </div>
                  </div>

                  <div className="uni-badge-text">
                     <Shield size={30} fill="#ffffff" color="#ffffff" />
                     <div className="u-text-col">
                        <span className="u-name serif">Durham</span>
                        <span className="u-sub">University</span>
                     </div>
                  </div>

                  <div className="uni-badge-text">
                     <BookOpen size={30} fill="#ffffff" color="#ffffff" />
                     <div className="u-text-col">
                        <span className="u-name serif">OXFORD</span>
                        <span className="u-sub">UNIVERSITY</span>
                     </div>
                  </div>

                  <div className="uni-badge-text">
                     <Landmark size={30} fill="#A3C1AD" color="#A3C1AD" />
                     <div className="u-text-col">
                         <span className="u-name serif">Cambridge</span>
                         <span className="u-sub">UNIVERSITY</span>
                     </div>
                  </div>

                  {/* TRIPLICATE */}
                  <div className="uni-badge-text">
                     <div className="u-shield red">VERITAS</div>
                     <div className="u-text-col">
                        <span className="u-name serif">HARVARD</span>
                        <span className="u-sub">UNIVERSITY</span>
                     </div>
                  </div>

                  <div className="uni-badge-text">
                     <TreePine size={32} color="#8C1515" fill="#8C1515" />
                     <div className="u-text-col">
                        <span className="u-name serif">Stanford</span>
                        <span className="u-sub">University</span>
                     </div>
                  </div>

                  <div className="uni-badge-text">
                     <div className="mit-logo">
                        <div className="bar"></div><div className="bar"></div><div className="bar short"></div>
                     </div>
                     <div className="u-text-col">
                        <span className="u-name slab" style={{letterSpacing: '2px'}}>MIT</span>
                        <span className="u-sub">Massachusetts Institute of Technology</span>
                     </div>
                  </div>

                  <div className="uni-badge-text">
                     <Shield size={30} fill="#ffffff" color="#ffffff" />
                     <div className="u-text-col">
                        <span className="u-name serif">Durham</span>
                        <span className="u-sub">University</span>
                     </div>
                  </div>

                  <div className="uni-badge-text">
                     <BookOpen size={30} fill="#ffffff" color="#ffffff" />
                     <div className="u-text-col">
                        <span className="u-name serif">OXFORD</span>
                        <span className="u-sub">UNIVERSITY</span>
                     </div>
                  </div>

                  <div className="uni-badge-text">
                     <Landmark size={30} fill="#A3C1AD" color="#A3C1AD" />
                     <div className="u-text-col">
                         <span className="u-name serif">Cambridge</span>
                         <span className="u-sub">UNIVERSITY</span>
                     </div>
                  </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* HOW TO USE SECTION - "LegitWriter" style */}
      <section className="how-to-section">
        <div className="container">
          <div className="how-to-content">
            <h2 className="how-to-title">
              How to humanize AI text with <span className="brand-highlight">HumanizerAI</span>?
              <div className="title-underline"></div>
            </h2>
            <p className="how-to-desc">
              We've trained our undetectable AI rewriting algorithm with extensive human samples. 
              Convert to 100% human-like text in just 3 easy steps.
            </p>
            
            <div className="trust-indicator">
              <div className="trust-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
              <span className="trust-text">Trusted by 50,000+ users</span>
            </div>

            <Link href="/editor" className="how-to-cta">
              Start for free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE SECTION - REDESIGNED */}
      <section className="why-choose observer-reveal">
        <div className="container">
          <div className="why-content">
            {/* LEFT: THE ANALYSIS CARD (Mockup-style) */}
            <div className="why-visual-panel">
              <div className="analysis-card shadow-premium">
                <div className="ac-header">
                  <div className="ac-tabs">
                    <span className="ac-tab active">Humanizer</span>
                    <span className="ac-tab">Analysis</span>
                    <span className="ac-tab">Score</span>
                  </div>
                  <div className="ac-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
                
                <div className="ac-body">
                  <div className="ac-main-visual">
                    <div className="ac-feature-grid">
                      <div className="ac-feat-item">
                        <div className="ac-fi-icon"><Cpu size={18} /></div>
                        <h5>Linguistic DNA</h5>
                        <p>50+ unique markers analyzed</p>
                      </div>
                      <div className="ac-feat-item">
                        <div className="ac-fi-icon"><Shield size={18} /></div>
                        <h5>Fingerprint Removal</h5>
                        <p>Eliminate AI patterns</p>
                      </div>
                      <div className="ac-feat-item">
                        <div className="ac-fi-icon"><Zap size={18} /></div>
                        <h5>Bypass Plus</h5>
                        <p>Bypass GPT-Zero & Originality</p>
                      </div>
                      <div className="ac-feat-item highlight">
                        <div className="ac-fi-icon"><BookOpen size={18} /></div>
                        <h5>Citation Lock</h5>
                        <p>Reference integrity preserved</p>
                      </div>
                    </div>
                    <div className="ac-overlay-stats">
                      <div className="stat-pill pulse-glow">
                        <CheckCircle size={14} />
                        <span>98.4% Human Score</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ac-text-preview">
                    <div className="ac-text-header">
                      <div className="ac-meta">
                        <span className="meta-tag">ESL Mode</span>
                        <span className="meta-tag">Natural Flow</span>
                      </div>
                      <div className="ac-time">2m ago</div>
                    </div>
                    <h4>Advanced Linguistic Re-Engineering</h4>
                    <p>Our engine reconstructs syntactic structures to eliminate technical "fingerprints" while maintaining academic rigor. We ensure your voice remains human, opinionated, and perfectly natural.</p>
                    
                    <div className="ac-actions">
                      <div className="ac-action-icons">
                        <Zap size={18} className="text-blue" />
                        <MessageSquare size={18} />
                        <ArrowRight size={18} />
                      </div>
                      <div className="ac-play-button">
                        <div className="play-circle"><Zap size={12} fill="currentColor" /></div>
                        <span>Verify Result</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FLOATING DECO ELEMENTS */}
              <div className="deco-element de-1 shadow-lg">
                <div className="de-icon"><Shield size={16} /></div>
                <span>Encrypted Scan</span>
              </div>
            </div>

            {/* RIGHT: THE CONTENT */}
            <div className="why-text-panel">
              <h2 className="section-title-large">
                Elevate Your Writing to <br />
                <span className="accent-blue text-glow">Human Perfection</span>
              </h2>
              <p className="section-desc-premium">
                Our AI-powered engine analyzes rhythm, vocabulary, and sentence structure to ensure your work is completely indistinguishable from high-tier student writing. Perfect for essays, theses, and applications.
              </p>
              
              <Link href="/editor" className="btn-premium-large">
                <span>Start Humanizing Now</span>
                <ArrowRight size={20} />
              </Link>
              
              <div className="trust-stats-mini">
                <div className="ts-avatars">
                  <img src="https://i.pravatar.cc/150?u=1" alt="user" />
                  <img src="https://i.pravatar.cc/150?u=2" alt="user" />
                  <img src="https://i.pravatar.cc/150?u=3" alt="user" />
                  <div className="ts-more">+50k</div>
                </div>
                <p>Join thousands of students bypassing detection daily.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CUTE REVIEWS SECTION */}
      <section className="reviews-section observer-reveal">
        <div className="container">
          <div className="reviews-header text-center">
            <h2 className="section-title-cute">What students <span className="text-pink">love</span> about us</h2>
            <p className="section-subtitle-cute">Join over 50,000 students who trust HumanizerAI for their best work.</p>
          </div>
          
          <div className="reviews-grid">
            {[
              { 
                name: "Elena R.", 
                role: "Masters Student", 
                text: "The ESL mode is a total lifesaver. My professor actually complimented my 'natural' writing style for once!",
                color: "pink",
                avatar: "https://i.pravatar.cc/150?u=elena"
              },
              { 
                name: "David L.", 
                role: "PhD Candidate", 
                text: "I was terrified of my thesis being flagged. This tool kept my citations perfect while fixing the flow.",
                color: "mint",
                avatar: "https://i.pravatar.cc/150?u=david"
              },
              { 
                name: "Sophie W.", 
                role: "Undergrad", 
                text: "Finally, a tool that doesn't just swap words but actually understands student rhythm. 10/10 recommend!",
                color: "blue",
                avatar: "https://i.pravatar.cc/150?u=sophie"
              }
            ].map((review, idx) => (
              <div key={idx} className={`review-card ${review.color} hover-lift shadow-sm`}>
                <div className="quote-icon">“</div>
                <p className="review-text">{review.text}</p>
                <div className="review-footer">
                  <img src={review.avatar} alt={review.name} className="review-avatar" />
                  <div className="review-info">
                    <span className="review-name">{review.name}</span>
                    <span className="review-role">{review.role}</span>
                  </div>
                  <div className="review-stars">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="f-logo">
                <Zap size={22} fill="#3b82f6" color="#3b82f6" />
                <span>HumanizerAI</span>
              </div>
              <p>The global leader in academic humanization and AI detection bypass technology.</p>
              <div className="social-links">
                <Link href="#"><Twitter size={18} /></Link>
                <Link href="#"><Instagram size={18} /></Link>
                <Link href="#"><Facebook size={18} /></Link>
                <Link href="#"><Linkedin size={18} /></Link>
              </div>
            </div>
            
            <div className="footer-cols">
              <div className="f-col">
                <h4>Product</h4>
                <Link href="/editor">Editor</Link>
                <Link href="/pricing">Pricing</Link>
                <Link href="#">Features</Link>
              </div>
              <div className="f-col">
                <h4>Legal</h4>
                <Link href="#">Privacy Policy</Link>
                <Link href="#">Terms of Use</Link>
              </div>
            </div>

            <div className="footer-news">
              <h4>Stay Updated</h4>
              <div className="news-box">
                <input type="email" placeholder="Your email" />
                <button aria-label="Subscribe"><ArrowRight size={18} /></button>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2026 HumanizerAI Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .landing-wrapper {
          background-color: var(--bg-app);
          color: white;
          overflow-x: hidden;
        }

        .container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 4rem;
        }

        /* HERO Reveal Animation */
        .reveal-anim {
          animation: blurIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes blurIn {
          from { opacity: 0; filter: blur(20px); transform: scale(1.05); }
          to { opacity: 1; filter: blur(0); transform: scale(1); }
        }

        .hero {
          padding: 6rem 0 6rem;
          background: radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 60%);
          min-height: 100vh;
          display: flex;
          align-items: center;
        }
        
        .hero-container {
          max-width: 100%;
          margin: 0;
          padding: 0 8vw;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 6rem;
          align-items: center;
          width: 100%;
        }

        .hero-pill {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          padding: 0.5rem 1rem;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 700;
          width: fit-content;
          margin-bottom: 1.5rem;
        }

        h1 {
          font-size: 5.5rem;
          font-weight: 950;
          line-height: 1;
          letter-spacing: -0.05em;
          margin-bottom: 1.5rem;
        }
        
        .accent-blue {
          color: #3b82f6;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 540px;
          margin-bottom: 2.5rem;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .mockup-stack {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: flex-end;
        }
        .mockup-main {
          width: 95%;
          max-width: 650px;
          aspect-ratio: 4/3;
          background: #0f172a;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
          padding: 2.5rem;
        }
        .ms-header { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; margin-bottom: 2rem; }
        .ms-title { font-size: 0.85rem; color: #64748b; font-family: var(--font-mono); font-weight: 500; }
        .ms-content { overflow: hidden; }
        .ms-line { height: 12px; background: rgba(255,255,255,0.08); border-radius: 3px; margin-bottom: 1rem; }
        .ms-line.full { width: 100%; }
        .ms-line.med { width: 65%; }
        .ms-line.short { width: 40%; }
        .ms-diff { padding: 1rem 1.2rem; border-radius: 8px; font-size: 0.9rem; font-family: var(--font-mono); margin-bottom: 1rem; font-weight: 500; }
        .ms-diff.ins { background: rgba(16, 185, 129, 0.15); color: #34d399; border-left: 4px solid #10b981; }
        .ms-diff.del { background: rgba(239, 68, 68, 0.15); color: #f87171; border-left: 4px solid #ef4444; text-decoration: line-through; }

        .floating-bubble {
          position: absolute;
          padding: 0.8rem 1.2rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .b1 { top: -20px; left: -20px; }
        .b2 { bottom: 40px; right: 40px; }
        .glass { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); }
        .bubble-icon { width: 32px; height: 32px; background: rgba(59, 130, 246, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #3b82f6; }
        .bubble-info { font-size: 0.85rem; }

        .why-choose {
          padding: 12rem 0;
          background: #020617;
          position: relative;
        }
        .why-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8rem;
          align-items: center;
        }
        /* LEFT: Visual Panel */
        .why-visual-panel {
          position: relative;
          z-index: 2;
        }
        .analysis-card {
          background: #0f172a;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
          width: 100%;
          max-width: 580px;
        }
        .ac-header {
          padding: 1.2rem 2rem;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .ac-tabs { display: flex; gap: 1.5rem; }
        .ac-tab { font-size: 0.8rem; color: #64748b; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .ac-tab.active { color: #3b82f6; }
        .ac-dots { display: flex; gap: 6px; }
        .ac-dots span { width: 6px; height: 6px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); }
        
        .ac-main-visual { 
          position: relative; 
          width: 100%; 
          height: 320px; 
          overflow: hidden; 
          background: #020617;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .ac-feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          width: 100%;
          height: 100%;
        }
        .ac-feat-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 1.2rem;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .ac-feat-item:hover {
          background: rgba(59, 130, 246, 0.05);
          border-color: rgba(59, 130, 246, 0.2);
          transform: translateY(-2px);
        }
        .ac-feat-item.highlight {
          background: rgba(59, 130, 246, 0.08);
          border-color: rgba(59, 130, 246, 0.3);
        }
        .ac-fi-icon {
          width: 36px;
          height: 36px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
          margin-bottom: 0.8rem;
        }
        .ac-feat-item h5 { font-size: 0.95rem; font-weight: 700; color: white; margin-bottom: 0.2rem; }
        .ac-feat-item p { font-size: 0.75rem; color: #64748b; margin: 0; line-height: 1.3; }
        .ac-overlay-stats { 
          position: absolute; 
          top: 20px; 
          right: 20px; 
        }
        .stat-pill { 
          background: rgba(16, 185, 129, 0.9); 
          color: white; 
          padding: 0.6rem 1rem; 
          border-radius: 99px; 
          font-size: 0.85rem; 
          font-weight: 600; 
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
          backdrop-filter: blur(4px);
        }

        .ac-text-preview { padding: 2.5rem; }
        .ac-text-header { display: flex; justify-content: space-between; margin-bottom: 1.5rem; }
        .ac-meta { display: flex; gap: 0.8rem; }
        .meta-tag { background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 0.3rem 0.8rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
        .ac-time { color: #475569; font-size: 0.75rem; }
        .ac-text-preview h4 { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; }
        .ac-text-preview p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem; }

        .ac-actions { display: flex; justify-content: space-between; align-items: center; }
        .ac-action-icons { display: flex; gap: 1.5rem; color: #475569; }
        .ac-play-button { 
          display: flex; 
          align-items: center; 
          gap: 0.8rem; 
          background: #3b82f6; 
          color: white; 
          padding: 0.6rem 1.2rem; 
          border-radius: 12px; 
          font-size: 0.85rem; 
          font-weight: 600; 
          cursor: pointer;
        }
        .play-circle { width: 22px; height: 22px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; }

        .deco-element {
          position: absolute;
          background: #1e293b;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.8rem 1.2rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.85rem;
          font-weight: 600;
          z-index: 3;
        }
        .de-1 { top: -30px; left: -40px; }
        .de-icon { color: #3b82f6; }

        /* RIGHT: Text Panel */
        .section-title-large { font-size: 4rem; font-weight: 800; line-height: 1.1; margin-bottom: 2rem; }
        .section-desc-premium { font-size: 1.2rem; color: #94a3b8; line-height: 1.7; margin-bottom: 3.5rem; max-width: 580px; }
        
        .btn-premium-large {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          background: #3b82f6;
          color: white;
          padding: 1.2rem 2.8rem;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-premium-large:hover { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3); }

        .trust-stats-mini { margin-top: 4rem; display: flex; align-items: center; gap: 1.5rem; }
        .ts-avatars { display: flex; -webkit-mask-image: linear-gradient(to right, black, black); }
        .ts-avatars img { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #020617; margin-right: -12px; }
        .ts-more { width: 32px; height: 32px; border-radius: 50%; background: #1e293b; border: 2px solid #020617; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; color: #3b82f6; }
        .trust-stats-mini p { font-size: 0.9rem; color: #64748b; margin: 0; }

        .reviews-section {
          padding: 8rem 0;
          background: #020617;
        }
        .reviews-header { margin-bottom: 4rem; }
        .section-title-cute { font-size: 3rem; font-weight: 800; margin-bottom: 1rem; }
        .text-pink { color: #f472b6; }
        .section-subtitle-cute { font-size: 1.1rem; color: #64748b; }
        
        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .review-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
        }
        .review-card.pink { border-top: 4px solid #f472b6; }
        .review-card.mint { border-top: 4px solid #34d399; }
        .review-card.blue { border-top: 4px solid #3b82f6; }
        
        .quote-icon {
          font-size: 4rem;
          position: absolute;
          top: -10px;
          right: 20px;
          opacity: 0.1;
          font-family: serif;
        }
        .review-text {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #cbd5e1;
          margin-bottom: 2rem;
          position: relative;
          z-index: 2;
        }
        .review-footer {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: auto;
        }
        .review-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.1);
        }
        .review-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .review-name { font-weight: 700; color: white; font-size: 0.95rem; }
        .review-role { font-size: 0.8rem; color: #64748b; }
        .review-stars { display: flex; gap: 2px; color: #fbbf24; }
        
        @media (max-width: 992px) {
          .reviews-grid { grid-template-columns: 1fr; }
        }

        /* TRUSTED SECTION */
        .trusted-section {
          padding: 4rem 0 4rem;
          background: #020617;
        }
        .trusted-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        .trusted-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: white;
          line-height: 1.2;
        }
        .trusted-subtitle {
          color: #94a3b8;
          font-size: 0.95rem;
          margin-bottom: 4rem;
          line-height: 1.6;
        }
        .logos-carousel-wrapper {
          max-width: 850px;
          margin: 0 auto;
          overflow: hidden;
          position: relative;
          mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
        }
        
        .logos-track {
          display: flex;
          align-items: center;
          gap: 5rem;
          width: max-content;
          animation: logoScroll 40s linear infinite;
        }

        .logos-track:hover {
           animation-play-state: paused;
        }

        @keyframes logoScroll {
           0% { transform: translateX(0); }
           100% { transform: translateX(-33.33%); } /* Move exactly 1/3 of the triplicated track */
        }
        
        .uni-badge-text {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
          opacity: 1;
          filter: none;
          transition: all 0.3s ease;
          cursor: default;
        }
        
        .uni-badge-text:hover {
          transform: scale(1.05);
        }

        .u-text-col {
           display: flex;
           flex-direction: column;
           align-items: flex-start;
           line-height: 1;
        }

        .u-name { color: #ffffff; font-weight: 700; white-space: nowrap; }
        .u-name.serif { font-family: 'Times New Roman', serif; font-size: 1.4rem; letter-spacing: 0.05em; }
        .u-name.slab { font-family: 'Courier New', monospace; font-size: 1.6rem; letter-spacing: -0.05em; }
        
        .u-sub {
           font-size: 0.45em;
           font-family: sans-serif;
           font-weight: 500;
           color: #cbd5e1;
           margin-top: 4px;
           text-transform: uppercase;
           letter-spacing: 0.15em;
        }

        /* Harvard Shield w/ Text */
        .u-shield {
           width: 30px;
           height: 36px;
           background: #A51C30;
           display: flex;
           align-items: center;
           justify-content: center;
           font-family: serif;
           color: white;
           font-size: 6px;
           font-weight: bold;
           border-radius: 0 0 15px 15px;
           position: relative;
        }
        .u-shield::before {
           content: '';
           position: absolute;
           top: -2px; left: 0; right: 0; height: 4px; background: #A51C30;
        }

        /* MIT Bars */
        .mit-logo {
           display: flex;
           gap: 3px;
           align-items: flex-end;
           height: 28px;
        }
        .mit-logo .bar { width: 6px; height: 100%; background: #A31F34; }
        .mit-logo .bar.short { height: 60%; }

        /* HOW TO SECTION */
        .how-to-section {
          padding: 6rem 0 8rem;
          background: #020617;
        }
        .how-to-content {
          text-align: center;
          max-width: 750px;
          margin: 0 auto;
        }
        .how-to-title {
          font-size: 2.8rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          line-height: 1.2;
          position: relative;
          display: inline-block;
        }
        .brand-highlight {
          color: #3b82f6;
          position: relative;
        }
        .title-underline {
           width: 60px;
           height: 4px;
           background: #3b82f6;
           margin: 1.5rem auto 0;
           border-radius: 2px;
        }

        .how-to-desc {
          color: #64748b;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .trust-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
        }
        .trust-dots {
          display: flex;
          gap: 5px;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3b82f6; /* Solid Blue */
        }
        .trust-text {
          color: #94a3b8;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .how-to-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: #2563eb;
          color: white;
          padding: 0.9rem 2.2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1.05rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .how-to-cta:hover {
          background: #1d4ed8;
        }

        .partner-right h2 { font-size: 3.5rem; font-weight: 800; margin-bottom: 2rem; }

        .observer-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }
        .visible {
          opacity: 1;
          transform: translateY(0);
        }

        .footer { padding: 8rem 0 4rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .footer-top { display: grid; grid-template-columns: 1.5fr 2fr 1fr; gap: 6rem; margin-bottom: 6rem; }
        .f-logo { display:flex; align-items:center; gap:0.8rem; font-size: 1.6rem; font-weight: 900; margin-bottom: 1.5rem; }
        .footer-brand p { color: var(--text-tertiary); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem; }
        .social-links { display: flex; gap: 1.2rem; color: #475569; }
        
        .footer-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .f-col h4 { font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem; }
        .f-col :global(a) { display: block; color: #475569; margin-bottom: 1rem; font-size: 0.95rem; text-decoration: none; }
        .f-col :global(a:hover) { color: white; }

        .footer-news h4 { margin-bottom: 1.5rem; }
        .news-box { background: #0b0f1a; border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; display: flex; padding: 4px; }
        .news-box input { flex: 1; padding: 0.8rem 1rem; font-size: 0.9rem; color: white; outline: none; background: none; border: none; }
        .news-box button { background: #3b82f6; color: white; width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 3rem; text-align: center; color: #475569; font-size: 0.9rem; }

        @media (max-width: 1200px) {
          h1 { font-size: 4rem; }
          .hero-container { grid-template-columns: 1fr; text-align: center; }
          .hero-text { display: flex; flex-direction: column; align-items: center; }
          .hero-visual { margin-top: 4rem; justify-content: center; }
          .why-content, .partner-content { grid-template-columns: 1fr; gap: 4rem; text-align: center; }
          .why-right, .partner-left { justify-content: center; order: -1; }
        }
      `}</style>
    </div>
  );
}
