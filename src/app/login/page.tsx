"use client";

import { WebsiteNavbar } from "@/components/WebsiteNavbar";
import Cookies from 'js-cookie';
import { ArrowRight, Github, Lock, Mail, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      Cookies.set('auth_token', 'mock_token_12345', { expires: 7, path: '/' }); 
      setIsLoading(false);
      window.location.href = '/dashboard'; // Use full reload to fix cookie sync with middleware
    }, 1500);
  };

  return (
    <div className="login-wrapper">
      <WebsiteNavbar />
      
      <div className="auth-container animate-fade-in">
         <div className="auth-card glass-effect">
            <div className="auth-header">
               <div className="icon-surface">
                  <Lock size={20} className="lock-icon" />
               </div>
               <h2>{isLogin ? "Welcome back" : "Create an account"}</h2>
               <p>{isLogin ? "Enter your details to access your workspace." : "Start humanizing your text like a pro."}</p>
            </div>

            <form className="auth-form" onSubmit={handleLogin}>
               <div className="social-btns">
                  <button type="button" onClick={handleLogin} className="social-btn">
                     <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
                     <span>Google</span>
                  </button>
                  <button type="button" onClick={handleLogin} className="social-btn">
                     <Github size={20} />
                     <span>GitHub</span>
                  </button>
               </div>

               <div className="divider">
                  <span>OR CONTINUE WITH</span>
               </div>

               <div className="input-group">
                  <label>Email</label>
                  <div className="input-wrapper">
                     <Mail size={16} />
                     <input type="email" placeholder="student@university.edu" required />
                  </div>
               </div>

               <div className="input-group">
                  <label>Password</label>
                  <div className="input-wrapper">
                     <Lock size={16} />
                     <input type="password" placeholder="••••••••" required />
                  </div>
               </div>

               <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? "Authenticating..." : (isLogin ? "Sign In" : "Get Started Free")}
                  {!isLoading && <ArrowRight size={16} />}
               </button>
            </form>

            <div className="auth-footer">
               <p>
                 {isLogin ? "Don't have an account? " : "Already have an account? "}
                 <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
                    {isLogin ? "Sign up" : "Log in"}
                 </button>
               </p>
            </div>
         </div>
      </div>

      <style jsx>{`
        .login-wrapper {
          min-height: 100vh;
          background: var(--bg-app);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .login-wrapper::before {
           content: '';
           position: absolute;
           top: -20%;
           left: 50%;
           transform: translateX(-50%);
           width: 600px;
           height: 600px;
           background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
           filter: blur(80px);
           pointer-events: none;
           z-index: 0;
        }

        .auth-container {
           width: 100%;
           max-width: 420px;
           z-index: 10;
           padding: 1rem;
        }

        .auth-card {
           padding: 2.5rem;
           border-radius: 24px;
           background: rgba(15, 23, 42, 0.4);
           backdrop-filter: blur(16px);
           border: 1px solid rgba(255, 255, 255, 0.08);
           box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .auth-header {
           text-align: center;
           margin-bottom: 2rem;
        }

        .icon-surface {
           width: 48px;
           height: 48px;
           background: rgba(59, 130, 246, 0.1);
           border-radius: 12px;
           display: flex;
           align-items: center;
           justify-content: center;
           margin: 0 auto 1.5rem;
           border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .lock-icon { color: var(--primary); }

        .auth-header h2 {
           font-size: 1.5rem;
           font-weight: 700;
           color: white;
           margin-bottom: 0.5rem;
        }
        .auth-header p {
           font-size: 0.9rem;
           color: var(--text-secondary);
        }

        .social-btns {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 1rem;
           margin-bottom: 1.5rem;
        }

        .social-btn {
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 0.5rem;
           padding: 0.7rem;
           border-radius: 10px;
           background: rgba(255, 255, 255, 0.03);
           border: 1px solid rgba(255, 255, 255, 0.1);
           color: white;
           font-weight: 500;
           font-size: 0.9rem;
           transition: all 0.2s;
        }
        .social-btn:hover {
           background: rgba(255, 255, 255, 0.08);
           border-color: rgba(255, 255, 255, 0.2);
        }

        .divider {
           display: flex;
           align-items: center;
           margin-bottom: 1.5rem;
        }
        .divider span {
           font-size: 0.7rem;
           font-weight: 600;
           color: var(--text-tertiary);
           letter-spacing: 0.05em;
           width: 100%;
           text-align: center;
           position: relative;
        }
        .divider span::before, .divider span::after {
           content: '';
           position: absolute;
           top: 50%;
           width: 30%;
           height: 1px;
           background: rgba(255, 255, 255, 0.1);
        }
        .divider span::before { left: 0; }
        .divider span::after { right: 0; }

        .input-group { margin-bottom: 1rem; }
        .input-group label {
           display: block;
           font-size: 0.8rem;
           font-weight: 500;
           color: var(--text-secondary);
           margin-bottom: 0.5rem;
        }
        .input-wrapper {
           position: relative;
        }
        .input-wrapper svg {
           position: absolute;
           left: 1rem;
           top: 50%;
           transform: translateY(-50%);
           color: var(--text-tertiary);
           transition: color 0.2s;
        }
        .input-wrapper input {
           width: 100%;
           background: rgba(0, 0, 0, 0.2);
           border: 1px solid rgba(255, 255, 255, 0.1);
           padding: 0.8rem 1rem 0.8rem 2.8rem;
           border-radius: 10px;
           color: white;
           font-size: 0.95rem;
           transition: all 0.2s;
        }
        .input-wrapper input:focus {
           border-color: var(--primary);
           background: rgba(0, 0, 0, 0.3);
           box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        .input-wrapper input:focus + svg {
           color: var(--primary);
        }

        .submit-btn {
           width: 100%;
           background: var(--primary);
           color: white;
           padding: 0.9rem;
           border-radius: 10px;
           font-weight: 600;
           margin-top: 1rem;
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 0.5rem;
           transition: all 0.2s;
        }
        .submit-btn:hover {
           background: var(--primary-hover);
           transform: translateY(-1px);
        }

        .auth-footer {
           margin-top: 1.5rem;
           text-align: center;
           font-size: 0.9rem;
           color: var(--text-secondary);
        }
        .toggle-btn {
           color: var(--primary);
           font-weight: 600;
        }
        .toggle-btn:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
