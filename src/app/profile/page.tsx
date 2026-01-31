"use client";

import { WebsiteNavbar } from "@/components/WebsiteNavbar";
import Cookies from "js-cookie";
import { Bell, Camera, ChevronLeft, CreditCard, Lock, LogOut, Mail, MapPin, Shield, User, Zap } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="settings-wrapper animate-fade-in">
      <WebsiteNavbar />
      
      <main className="settings-container">
        
        {/* Left Sidebar Navigation */}
        <aside className="settings-sidebar">
           <div className="sidebar-header">
              <Link href="/dashboard" className="back-btn">
                 <ChevronLeft size={20} />
              </Link>
              <div className="header-text">
                 <h1>Settings</h1>
                 <p>Manage your account preferences</p>
              </div>
           </div>

           <nav className="settings-nav">
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                 <div className="nav-icon"><User size={20} /></div>
                 <div className="nav-label">
                    <span>Profile</span>
                    <small>Manage account info</small>
                 </div>
              </button>
              
              <button 
                className={`nav-item ${activeTab === 'billing' ? 'active' : ''}`}
                onClick={() => setActiveTab('billing')}
              >
                 <div className="nav-icon"><CreditCard size={20} /></div>
                 <div className="nav-label">
                    <span>Plan & Billing</span>
                    <small>Usage & credits</small>
                 </div>
              </button>

              <button 
                className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                 <div className="nav-icon"><Bell size={20} /></div>
                 <div className="nav-label">
                    <span>Notifications</span>
                    <small>Email & push preferences</small>
                 </div>
              </button>

              <button 
                className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                 <div className="nav-icon"><Shield size={20} /></div>
                 <div className="nav-label">
                    <span>Security</span>
                    <small>Password & 2FA</small>
                 </div>
              </button>

              <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                 <button 
                   className="nav-item"
                   onClick={() => {
                      Cookies.remove('auth_token');
                      window.location.href = '/';
                   }}
                   style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                 >
                    <div className="nav-icon" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}>
                       <LogOut size={20} />
                    </div>
                    <div className="nav-label">
                       <span style={{ color: '#ef4444' }}>Log Out</span>
                       <small style={{ color: 'rgba(239, 68, 68, 0.7)' }}>End session</small>
                    </div>
                 </button>
              </div>
           </nav>
        </aside>

        {/* Right Content Area */}
        <div className="settings-content">
           
           {/* PROFILE TAB */}
           {activeTab === 'profile' && (
             <div className="content-pane animate-fade-in">
                <div className="pane-header">
                   <h2>Profile Settings</h2>
                   <p>Update your personal information and public profile</p>
                </div>

                <div className="card-section">
                   <h3 className="card-title">Profile Information</h3>
                   <p className="card-subtitle">Update your personal information and how it appears on your profile</p>
                   


                   <form className="settings-form">
                      <div className="form-row">
                         <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" defaultValue="Bernard" className="text-input" />
                         </div>
                         <div className="input-group">
                            <label>Email Address</label>
                            <input type="email" defaultValue="b@gmail.com" className="text-input" />
                         </div>
                      </div>

                      <div className="form-row">
                         <div className="input-group">
                            <label>Phone Number</label>
                            <input type="tel" defaultValue="+1 (555) 000-0000" className="text-input" />
                         </div>
                         <div className="input-group">
                            <label>Language Preference</label>
                            <div className="select-wrapper">
                               <select className="text-input">
                                  <option>English (US)</option>
                                  <option>English (UK)</option>
                                  <option>Spanish</option>
                               </select>
                            </div>
                         </div>
                      </div>
                      
                      <div className="form-actions">
                         <button type="button" className="btn-save">Save Changes</button>
                      </div>
                   </form>
                </div>
             </div>
           )}

           {/* BILLING TAB */}
           {activeTab === 'billing' && (
             <div className="content-pane animate-fade-in">
                <div className="pane-header">
                   <h2>Plan & Billing</h2>
                   <p>Manage your subscription and view usage history</p>
                </div>

                <div className="card-section gradient-border">
                   <div className="billing-summary">
                      <div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <h3 className="card-title" style={{ margin: 0 }}>Current Plan: Pro</h3>
                            <div className="status-badge">
                                <span className="dot"></span> Active
                            </div>
                         </div>
                         <p className="card-subtitle">Next billing date: July 24, 2026</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                          <span className="price-tag">$12/mo</span>
                          <Link href="/pricing" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>
                              Manage Subscription
                          </Link>
                      </div>
                   </div>
                </div>



                {/* Credit History Card (Blue) */}
                <div className="credit-history-card">
                    <h3 className="ch-title">Words History Overview</h3>
                    <div className="ch-row">
                        <span>Today</span>
                        <div className="ch-badge">0</div>
                    </div>
                    <div className="ch-row">
                        <span>This Week</span>
                        <div className="ch-badge">0</div>
                    </div>
                    <div className="ch-row last">
                        <span>This Month</span>
                        <div className="ch-badge">314</div>
                    </div>
                </div>

                <div className="card-section">
                    <h3 className="card-title">Token Usage</h3>
                    <div className="usage-bars ">
                       <div className="usage-item">
                          <div className="usage-label">
                             <span>Words Humanized</span>
                             <span>124k / Unlimited</span>
                          </div>
                          <div className="progress-bg"><div className="progress-fill" style={{ width: '25%' }}></div></div>
                       </div>
                       <div className="usage-item">
                          <div className="usage-label">
                             <span>AI Checks</span>
                             <span>42 / 100 per day</span>
                          </div>
                          <div className="progress-bg"><div className="progress-fill-warn" style={{ width: '42%' }}></div></div>
                       </div>
                    </div>
                </div>
             </div>
           )}

           {/* NOTIFICATIONS TAB */}
           {activeTab === 'notifications' && (
              <div className="content-pane animate-fade-in">
                 <div className="pane-header">
                    <h2>Notifications</h2>
                    <p>Choose what we communicate to you</p>
                 </div>

                 <div className="card-section">
                    <h3 className="card-title">Email Preferences</h3>
                    <div className="notification-list">
                       <div className="notification-item">
                          <div className="notif-info">
                             <h4>Product Updates</h4>
                             <p>Be the first to know about new features and improvements.</p>
                          </div>
                          <label className="switch">
                             <input type="checkbox" defaultChecked />
                             <span className="slider round"></span>
                          </label>
                       </div>
                       <div className="notification-item">
                          <div className="notif-info">
                             <h4>Weekly Activity Report</h4>
                             <p>A summary of your humanization usage and stats.</p>
                          </div>
                          <label className="switch">
                             <input type="checkbox" defaultChecked />
                             <span className="slider round"></span>
                          </label>
                       </div>
                       <div className="notification-item">
                          <div className="notif-info">
                             <h4>Tips & Tutorials</h4>
                             <p>Helpful advice on how to get the most out of the tool.</p>
                          </div>
                          <label className="switch">
                             <input type="checkbox" />
                             <span className="slider round"></span>
                          </label>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {/* SECURITY TAB */}
           {activeTab === 'security' && (
              <div className="content-pane animate-fade-in">
                 <div className="pane-header">
                   <h2>Security</h2>
                   <p>Ensure your account remains safe</p>
                </div>
                
                <div className="card-section">
                   <h3 className="card-title">Password</h3>
                   <form className="settings-form">
                      <div className="input-group">
                          <label>Current Password</label>
                          <input type="password" placeholder="••••••••" className="text-input" />
                      </div>
                      <div className="input-group">
                          <label>New Password</label>
                          <input type="password" placeholder="••••••••" className="text-input" />
                      </div>
                      <div className="form-actions">
                         <button type="button" className="btn-save">Update Password</button>
                      </div>
                   </form>
                </div>
              </div>
           )}

        </div>
      </main>

      <style jsx>{`
        .settings-wrapper {
          min-height: 100vh;
          background: #020617; /* Deepest Navy */
          padding-top: 100px;
        }

        .settings-container {
           max-width: 1200px;
           margin: 0 auto;
           display: flex;
           gap: 2rem;
           padding: 0 2rem 4rem;
        }

        /* SIDEBAR */
        .settings-sidebar {
           width: 280px;
           flex-shrink: 0;
           display: flex;
           flex-direction: column;
        }

        .sidebar-header {
           display: flex;
           align-items: center;
           gap: 1rem;
           margin-bottom: 2rem;
        }
        .back-btn {
           width: 36px; height: 36px; 
           background: rgba(255,255,255,0.05);
           border-radius: 10px;
           display: flex; align-items: center; justify-content: center;
           color: var(--text-secondary);
           transition: all 0.2s;
        }
        .back-btn:hover { background: rgba(255,255,255,0.1); color: white; }
        
        .header-text h1 { font-size: 1.2rem; color: white; font-weight: 700; margin: 0; }
        .header-text p { font-size: 0.75rem; color: var(--text-tertiary); margin: 0; }

        .settings-nav {
           display: flex;
           flex-direction: column;
           gap: 1rem;
           background: rgba(15, 23, 42, 0.6);
           padding: 1rem;
           border-radius: 20px;
           border: 1px solid rgba(255,255,255,0.05);
        }

        .nav-item {
           display: flex;
           align-items: center;
           gap: 1rem;
           padding: 1rem;
           border-radius: 12px;
           background: transparent;
           border: 1px solid transparent;
           transition: all 0.2s;
           text-align: left;
           cursor: pointer;
        }

        .nav-item.active {
           background: #3b82f6;
           box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
           border-color: #3b82f6;
        }
        .nav-item:hover:not(.active) {
           background: rgba(255,255,255,0.03);
        }

        .nav-icon {
           width: 36px; height: 36px;
           border-radius: 50%;
           background: rgba(255,255,255,0.1);
           display: flex; align-items: center; justify-content: center;
           color: white;
           flex-shrink: 0;
        }
        .nav-item.active .nav-icon { background: rgba(255,255,255,0.2); }
        .nav-item:not(.active) .nav-icon { color: var(--text-secondary); background: transparent; border: 1px solid rgba(255,255,255,0.1); }

        .nav-label { display: flex; flex-direction: column; }
        .nav-label span { font-size: 0.95rem; font-weight: 600; color: white; }
        .nav-label small { font-size: 0.75rem; color: rgba(255,255,255,0.6); }

        
        /* CONTENT AREA */
        .settings-content {
           flex: 1;
        }

        .content-pane {
           display: flex;
           flex-direction: column;
           gap: 1.5rem;
        }

        .pane-header h2 { font-size: 1.5rem; color: white; margin-bottom: 0.2rem; }
        .pane-header p { color: var(--text-tertiary); font-size: 0.9rem; }

        .card-section {
           background: rgba(15, 23, 42, 0.6);
           border: 1px solid rgba(255,255,255,0.05);
           border-radius: 20px;
           padding: 2rem;
        }
        
        .card-title { font-size: 1.1rem; color: white; margin-bottom: 0.2rem; }
        .card-subtitle { font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 2rem; }

        .avatar-section {
           display: flex;
           align-items: center;
           gap: 1.5rem;
           margin-bottom: 2rem;
           padding-bottom: 2rem;
           border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .avatar-circle {
           width: 80px; height: 80px; border-radius: 50%;
           background: #e2e8f0; color: #1e293b;
           font-size: 2rem; font-weight: 700;
           display: flex; align-items: center; justify-content: center;
        }
        .avatar-preview { position: relative; }
        .cam-badge {
           position: absolute; bottom: 0; right: 0;
           width: 28px; height: 28px; background: #0f172a;
           border: 1px solid rgba(255,255,255,0.1); border-radius: 50%;
           color: white; display: flex; align-items: center; justify-content: center;
        }
        .btn-secondary-sm {
           background: rgba(255,255,255,0.05);
           border: 1px solid rgba(255,255,255,0.1);
           color: white;
           padding: 0.4rem 0.8rem;
           border-radius: 8px; /* Fixed: was '6xx' */
           font-size: 0.8rem;
           margin-top: 0.5rem;
           cursor: pointer;
        }

        .settings-form { display: flex; flex-direction: column; gap: 1.5rem; }
        
        .form-row {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 1.5rem;
        }

        .input-group label {
           display: block;
           font-size: 0.8rem;
           color: var(--text-secondary);
           margin-bottom: 0.5rem;
        }
        .text-input, .text-area {
           width: 100%;
           background: rgba(2, 6, 23, 0.5); /* Darker input bg */
           border: 1px solid rgba(255,255,255,0.08); /* Subtle border */
           padding: 0.8rem 1rem;
           border-radius: 10px;
           color: white;
           font-size: 0.95rem;
           transition: all 0.2s;
        }
        .text-input:focus, .text-area:focus {
           border-color: #3b82f6;
           background: rgba(2, 6, 23, 0.8);
           box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        .text-area { min-height: 100px; resize: vertical; }

        .helper-text { font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.4rem; display: block; }

        .form-actions {
           display: flex;
           justify-content: flex-end;
           margin-top: 1rem;
        }
        .btn-save {
           background: #3b82f6;
           color: white;
           padding: 0.8rem 2rem;
           border-radius: 99px;
           font-weight: 600;
           font-size: 0.95rem;
           transition: all 0.2s;
        }
        .btn-save:hover { background: #2563eb; transform: translateY(-1px); }

        /* BILLING SPECIFIC */
        .billing-summary {
           display: flex;
           justify-content: space-between;
           align-items: center;
        }
        .price-tag {
           font-size: 1.5rem; font-weight: 700; color: white;
        }
        .usage-item { margin-bottom: 1.5rem; }
        .usage-label { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
        .progress-bg { width: 100%; height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: #3b82f6; }
        .progress-fill-warn { height: 100%; background: #f59e0b; }

        .progress-fill-warn { height: 100%; background: #f59e0b; }

        .status-badge {
            font-size: 0.7rem;
            color: #10b981;
            background: rgba(16, 185, 129, 0.1);
            padding: 2px 8px;
            border-radius: 99px;
            display: flex;
            align-items: center;
            gap: 4px;
            font-weight: 600;
        }
        .dot { width: 6px; height: 6px; background: currentColor; border-radius: 50%; }

        /* CREDIT HISTORY CARD */
        .credit-history-card {
            background: #1e3a8a; /* Strong Blue */
            border-radius: 16px;
            padding: 1.5rem;
            color: white;
            margin-bottom: 1.5rem;
            box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.4);
        }
        .ch-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; }
        .ch-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.8rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.2);
            font-weight: 600;
        }
        .ch-row.last { border-bottom: none; }
        .ch-badge {
            background: white;
            color: #1e3a8a;
            padding: 0.2rem 0.8rem;
            border-radius: 6px;
            font-weight: 700;
            min-width: 40px;
            text-align: center;
        }

        /* TOGGLE SWITCH & NOTIF LIST */
        .notification-list { display: flex; flex-direction: column; }
        .notification-item {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 1.5rem 0;
           border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .notification-item:last-child { border-bottom: none; padding-bottom: 0; }
        .notification-item:first-child { padding-top: 0; }
        
        .notif-info h4 { font-size: 0.95rem; color: white; margin-bottom: 0.3rem; }
        .notif-info p { font-size: 0.8rem; color: var(--text-tertiary); max-width: 80%; }

        .switch { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #334155; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #3b82f6; }
        input:checked + .slider:before { transform: translateX(20px); }

        @media (max-width: 900px) {
           .settings-container { flex-direction: column; }
           .settings-sidebar { width: 100%; }
           .form-row { grid-template-columns: 1fr; }
        }

        @media (max-width: 600px) {
           .settings-container { padding: 0 1rem 4rem; }
           .card-section { padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
