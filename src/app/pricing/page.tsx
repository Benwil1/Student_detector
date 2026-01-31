"use client";

import { WebsiteNavbar } from "@/components/WebsiteNavbar";
import { ArrowRight, Check, Crown, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Basic sanity check for small assignments.",
      features: ["300 words per scan", "Standard Engine", "Diff History", "Community Support"],
      cta: "Continue Free",
      featured: false
    },
    {
      name: "Student Pro",
      price: "12",
      description: "Everything you need for finals week and beyond.",
      features: [
        "Unlimited words",
        "ESL Engine 2.0",
        "Citation Shield™",
        "Bulk Scan Mode",
        "Priority bypass"
      ],
      cta: "Go Pro Now",
      featured: true
    },
    {
      name: "Research",
      price: "29",
      description: "Tailored for Thesis and PhD candidates.",
      features: [
        "Everything in Pro",
        "LaTeX Integration",
        "API / Data Privacy",
        "Custom Personas",
        "24/7 Priority Support"
      ],
      cta: "Upgrade to Research",
      featured: false
    }
  ];

  return (
    <div className="pricing-wrapper">
      <div className="bg-glow"></div>
      <WebsiteNavbar />
      
      <div className="content container">
        <header className="page-head">
           <div className="mini-tag">Plans & Pricing</div>
           <h1>Choose your <span className="gradient-text">Writing Power</span></h1>
           <p>Stop worrying about detectors. Start focusing on your content.</p>
        </header>

        <div className="pricing-grid">
           {plans.map((plan, i) => (
             <div key={i} className={`p-card glass-effect ${plan.featured ? 'featured-card' : ''} animate-fade-in`} style={{ animationDelay: `${i * 0.1}s` }}>
               {plan.featured && (
                  <div className="popular-tag">
                     <Sparkles size={12} />
                     <span>Most Popular</span>
                  </div>
               )}
               
               <div className="card-top">
                  <div className="plan-name">{plan.name}</div>
                  <div className="plan-price">
                     <span className="unit">$</span>
                     <span className="val">{plan.price}</span>
                     <span className="dur">/mo</span>
                  </div>
                  <p className="plan-desc">{plan.description}</p>
               </div>

               <div className="plan-features">
                  {plan.features.map((f, j) => (
                    <div key={j} className="f-row">
                       <Check size={14} className="check" />
                       <span>{f}</span>
                    </div>
                  ))}
               </div>

               <Link href="/editor" className="p-cta">
                  {plan.cta}
                  <ArrowRight size={16} />
               </Link>
             </div>
           ))}
        </div>
      </div>

      <style jsx>{`
        .pricing-wrapper {
          min-height: 100vh;
          background: var(--bg-app);
          color: white;
          overflow: hidden;
          position: relative;
        }

        .bg-glow {
           position: absolute;
           top: -10%;
           left: 50%;
           transform: translateX(-50%);
           width: 800px;
           height: 400px;
           background: radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 60%);
           filter: blur(80px);
           z-index: 0;
        }

        .container { max-width: 1000px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 10; }

        .content { padding: 10rem 0 6rem; }

        .page-head { text-align: center; margin-bottom: 5rem; }
        .mini-tag { color: #3b82f6; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 1rem; letter-spacing: 0.1em; }
        .page-head h1 { font-size: 3rem; font-weight: 800; margin-bottom: 1.2rem; }
        .page-head p { color: #94a3b8; font-size: 1rem; }
        
        .gradient-text {
           background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
        }

        .pricing-grid {
           display: grid;
           grid-template-columns: repeat(3, 1fr);
           gap: 1.5rem;
           align-items: flex-start;
        }

        .glass-effect {
           background: rgba(15, 23, 42, 0.4);
           backdrop-filter: blur(12px);
           border: 1px solid rgba(255, 255, 255, 0.05);
           box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        }

        .p-card {
           padding: 2.5rem 2rem;
           border-radius: 20px;
           display: flex;
           flex-direction: column;
           position: relative;
           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .p-card:hover { transform: translateY(-10px); border-color: rgba(59, 130, 246, 0.3); }

        .featured-card {
           background: rgba(30, 41, 59, 0.5);
           border-color: rgba(59, 130, 246, 0.3);
           box-shadow: 0 20px 50px rgba(59, 130, 246, 0.1);
        }

        .popular-tag {
           position: absolute;
           top: -12px;
           left: 50%;
           transform: translateX(-50%);
           background: #3b82f6;
           padding: 4px 12px;
           border-radius: 99px;
           font-size: 0.65rem;
           font-weight: 800;
           display: flex;
           align-items: center;
           gap: 5px;
           text-transform: uppercase;
           box-shadow: 0 8px 16px rgba(59, 130, 246, 0.4);
        }

        .plan-name { font-size: 0.9rem; font-weight: 600; color: #94a3b8; margin-bottom: 1.5rem; }
        
        .plan-price { display: flex; align-items: baseline; margin-bottom: 1rem; }
        .unit { font-size: 1.5rem; font-weight: 600; color: #f1f5f9; }
        .val { font-size: 3.5rem; font-weight: 800; color: white; letter-spacing: -0.02em; }
        .dur { font-size: 1.1rem; color: #475569; margin-left: 4px; }

        .plan-desc { font-size: 0.85rem; color: #475569; line-height: 1.5; margin-bottom: 3rem; }

        .plan-features { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 3rem; flex: 1; }
        .f-row { display: flex; align-items: center; gap: 0.8rem; font-size: 0.9rem; color: #cbd5e1; }
        .check { color: #3b82f6; }

        .p-cta {
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 0.6rem;
           padding: 1rem;
           border-radius: 12px;
           background: rgba(255,255,255,0.03);
           border: 1px solid rgba(255,255,255,0.08);
           color: white;
           text-decoration: none;
           font-weight: 700;
           font-size: 0.9rem;
           transition: all 0.2s;
        }
        .featured-card .p-cta {
           background: #3b82f6;
           border: none;
           box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }
        .p-cta:hover { background: rgba(255,255,255,0.08); }
        .featured-card .p-cta:hover { background: #2563eb; transform: scale(1.02); }

        @media (max-width: 900px) {
           .pricing-grid { grid-template-columns: 1fr; }
           .page-head h1 { font-size: 2.2rem; }
        }
      `}</style>
    </div>
  );
}
