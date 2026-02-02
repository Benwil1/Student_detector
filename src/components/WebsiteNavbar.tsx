"use client";

import Cookies from "js-cookie";
import { Bell, Crown, LogIn, LogOut, Menu, Moon, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const WebsiteNavbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const token = Cookies.get('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
     Cookies.remove('auth_token');
     window.location.href = '/';
  }

  return (
    <nav className="web-navbar">
      <div className="nav-container glass-effect">
        {/* Logo Left */}
        <Link href="/" className="nav-brand">
          <div className="brand-inner">
            <Image src="/final-logo-v2.png" alt="HumanizerAI" width={32} height={32} className="brand-logo-img" />
            <span className="brand-name">Humanizer<span className="blue">AI</span></span>
          </div>
        </Link>

        {/* Links Center */}
        <div className="nav-links">
          <Link href="/" className={pathname === "/" ? "active" : ""}>Home</Link>
          <Link href="/pricing" className={pathname === "/pricing" ? "active" : ""}>Pricing</Link>
          <Link href="/editor" className={pathname === "/editor" ? "active" : ""}>Editor</Link>
          <div className="pro-badge">
             <Crown size={10} />
             <span>Pro</span>
          </div>
        </div>

        {/* Icons Right */}
        <div className="nav-right">
           <div className="icon-group">
              <Link href="/notifications" className="nav-icon-btn"><Bell size={16} /></Link>
              <button className="nav-icon-btn"><Moon size={16} /></button>
           </div>
            {isLoggedIn ? (
              <>
                <Link href="/profile" className="user-profile-circle">
                  <User size={18} />
                </Link>
                <button onClick={handleLogout} className="logout-nav-btn" title="Log out">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <div className="guest-actions">
                <Link href="/login" className="login-link-btn">Sign In</Link>
                <Link href="/login" className="signup-nav-btn">Get Started</Link>
              </div>
            )}
           <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
           </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu animate-fade-in">
           <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`mobile-link ${pathname === "/" ? "active" : ""}`}>Home</Link>
           <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className={`mobile-link ${pathname === "/pricing" ? "active" : ""}`}>Pricing</Link>
           <Link href="/editor" onClick={() => setIsMobileMenuOpen(false)} className={`mobile-link ${pathname === "/editor" ? "active" : ""}`}>Editor</Link>
           <div className="mobile-pro-badge">
             <Crown size={14} /> <span>Pro Plan Active</span>
           </div>
           
           <button onClick={handleLogout} className="mobile-link logout-btn">
              <LogOut size={18} />
              <span>Log Out</span>
           </button>
        </div>
      )}

      <style jsx>{`
        .web-navbar {
          height: 80px;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 2rem;
        }

        .nav-container {
          width: 100%;
          max-width: 1100px;
          height: 56px;
          padding: 0 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 99px;
        }

        .glass-effect {
           background: rgba(15, 23, 42, 0.7);
           backdrop-filter: blur(16px);
           border: 1px solid rgba(255, 255, 255, 0.1);
           box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
        }

        .nav-brand {
          text-decoration: none !important;
          color: white;
          display: flex;
          align-items: center;
        }

        .brand-inner {
           display: flex;
           align-items: center;
           gap: 0.7rem;
           line-height: 1;
        }
        
        .nav-brand:hover {
           text-decoration: none !important;
        }

        .brand-logo-img {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .brand-name {
          font-size: 1.15rem;
          font-weight: 850;
          color: white;
          letter-spacing: -0.04em;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          height: 32px; /* Set height to match icon */
        }
        .blue { color: #3b82f6; margin-left: 2px; }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.8rem;
          height: 100%;
        }

        .nav-links :global(a) {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s;
          display: flex;
          align-items: center;
        }

        .nav-links :global(a:hover), .nav-links :global(a.active) {
          color: white;
        }

        .pro-badge {
           display: flex;
           align-items: center;
           gap: 4px;
           background: linear-gradient(135deg, #f59e0b, #ea580c);
           padding: 4px 10px;
           border-radius: 99px;
           font-size: 0.65rem;
           font-weight: 950;
           color: white;
           text-transform: uppercase;
           box-shadow: 0 4px 15px rgba(234, 88, 12, 0.3);
           margin-left: -0.5rem;
           cursor: default;
        }

        .nav-right {
           display: flex;
           justify-content: flex-end;
           align-items: center;
           gap: 1.2rem;
        }

        .icon-group { display: flex; gap: 0.8rem; align-items: center; }
        .nav-icon-btn {
           width: 36px;
           height: 36px;
           display: flex;
           align-items: center;
           justify-content: center;
           color: #94a3b8;
           border-radius: 10px;
           transition: all 0.2s;
           position: relative;
           border: 1px solid transparent;
           background: transparent;
           cursor: pointer;
        }
        .nav-icon-btn:hover {
           background: rgba(255,255,255,0.05);
           color: white;
           border-color: rgba(255,255,255,0.1);
        }
        
        /* Specific fix for the 'moon' border shown in user image */
        .nav-icon-btn:focus, .nav-icon-btn:active {
           outline: none;
           border-color: transparent;
        }
        .dot {
           position: absolute;
           top: 6px;
           right: 6px;
           width: 6px;
           height: 6px;
           background: #ef4444;
           border-radius: 50%;
           border: 2px solid #0f172a;
        }

        .divider-v { width: 1px; height: 16px; background: rgba(255,255,255,0.1); }

        .user-profile-circle {
           width: 32px;
           height: 32px;
           background: #1e293b;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           color: #94a3b8;
           border: 1px solid rgba(255,255,255,0.05);
           transition: all 0.2s;
        }
        .user-profile-circle:hover {
           border-color: #3b82f6;
           color: white;
        }


         .logout-nav-btn {
            width: 32px;
            height: 32px;
            background: transparent;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
            border: 1px solid rgba(255,255,255,0.05);
            transition: all 0.2s;
            cursor: pointer;
         }
         .logout-nav-btn:hover {
            background: rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.3);
            color: #ef4444;
         }
         
         .guest-actions {
            display: flex;
            align-items: center;
            gap: 1.5rem;
         }
         .login-link-btn {
            font-size: 0.85rem;
            font-weight: 600;
            color: #94a3b8;
            transition: color 0.2s;
         }
         .login-link-btn:hover { color: white; }
         .signup-nav-btn {
            font-size: 0.8rem;
            font-weight: 700;
            background: #3b82f6;
            color: white;
            padding: 0.5rem 1.2rem;
            border-radius: 99px;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
            transition: all 0.2s;
         }
         .signup-nav-btn:hover {
            background: #2563eb;
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
         }

        @media (max-width: 900px) {
           .nav-links { display: none; }
           .mobile-menu-btn { display: flex; }
           .icon-group { display: none; }
           .guest-actions { gap: 0.8rem; }
           .login-link-btn { display: none; }
           .signup-nav-btn { padding: 0.4rem 1rem; font-size: 0.75rem; }
           .logout-nav-btn { width: 28px; height: 28px; }
           .user-profile-circle { width: 28px; height: 28px; }
        }

        @media (max-width: 600px) {
           .web-navbar { padding: 0 1rem; height: 70px; }
           .nav-container { 
             height: 48px; 
             padding: 0 1rem;
             max-width: 100%;
           }
           .brand-logo-img { width: 28px; height: 28px; }
           .brand-name { font-size: 1rem; }
           .mobile-menu-btn { width: 32px; height: 32px; }
           .signup-nav-btn { display: none; }
           .guest-actions { gap: 0.5rem; }
        }

        .mobile-menu-btn {
           display: none;
           align-items: center; justify-content: center;
           width: 36px; height: 36px;
           background: transparent; border: none;
           color: white; cursor: pointer;
        }

        .mobile-menu {
           position: fixed;
           top: 70px; left: 0; right: 0;
           bottom: 0;
           background: #020617;
           border-top: 1px solid rgba(255,255,255,0.05);
           padding: 1.5rem;
           display: flex;
           flex-direction: column;
           gap: 0;
           z-index: 1999;
           overflow-y: auto;
           -webkit-overflow-scrolling: touch;
        }

        .mobile-link {
           font-size: 1.1rem;
           font-weight: 600;
           color: var(--text-secondary);
           text-decoration: none;
           padding: 1rem 0;
           border-bottom: 1px solid rgba(255,255,255,0.05);
           display: flex;
           align-items: center;
           min-height: 56px;
        }
        .mobile-link.active { color: white; border-color: #3b82f6; }

        .mobile-pro-badge {
           display: flex; align-items: center; gap: 0.5rem;
           color: #f59e0b; font-weight: 700; font-size: 0.9rem;
           margin-top: 1.5rem;
           padding: 1rem;
           background: rgba(245, 158, 11, 0.1);
           border-radius: 12px;
        }

        .logout-btn {
           display: flex; align-items: center; gap: 0.8rem;
           color: #ef4444; border-color: rgba(239, 68, 68, 0.2);
           margin-top: auto;
           width: 100%; text-align: left; background: transparent; border: none;
           border-top: 1px solid rgba(255,255,255,0.05); padding: 1.5rem 0;
           cursor: pointer;
           min-height: 56px;
        }

        /* Mobile CTA in menu */
        .mobile-menu::after {
           content: '';
           display: block;
           padding-bottom: env(safe-area-inset-bottom, 20px);
        }
      `}</style>
    </nav>
  );
};
