"use client";

import { WebsiteNavbar } from "@/components/WebsiteNavbar";
import { Bell, CheckCircle, Clock, Info, MessageSquare, ShieldAlert, Trash2, X } from "lucide-react";
import React, { useState } from "react";

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "system", // system, success, alert, info
      title: "Welcome to Student Humanizer Plus!",
      message: "Get started by uploading your first document or pasting text in the editor.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "success",
      title: "Subscription Updated",
      message: "You have successfully upgraded to the Pro Plan. Enjoy unlimited generations.",
      time: "1 day ago",
      read: true,
    },
    {
      id: 3,
      type: "info",
      title: "New Feature: PDF Export",
      message: "You can now export your humanized text directly to PDF format with proper formatting.",
      time: "3 days ago",
      read: true,
    },
    {
      id: 4,
      type: "alert",
      title: "Maintenance Scheduled",
      message: "We will be performing system maintenance on Saturday at 2 AM EST. Service may be intermittent.",
      time: "1 week ago",
      read: true,
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifs = filter === "all" 
    ? notifications 
    : filter === "unread" 
      ? notifications.filter(n => !n.read) 
      : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle size={20} color="#10b981" />;
      case "alert": return <ShieldAlert size={20} color="#f59e0b" />;
      case "info": return <Info size={20} color="#3b82f6" />;
      default: return <MessageSquare size={20} color="#a8a29e" />;
    }
  };

  return (
    <div className="notif-page-wrapper animate-fade-in">
      <WebsiteNavbar />
      
      <main className="notif-container">
        <div className="notif-header">
           <div className="header-left">
              <h1>Notifications</h1>
              {unreadCount > 0 && <span className="unread-badge">{unreadCount} new</span>}
           </div>
           
           <div className="header-actions">
              <div className="filter-tabs">
                 <button 
                   className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                   onClick={() => setFilter("all")}
                 >
                   All
                 </button>
                 <button 
                   className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                   onClick={() => setFilter("unread")}
                 >
                   Unread
                 </button>
              </div>
              <button className="mark-read-btn" onClick={handleMarkAllRead}>
                 <CheckCircle size={14} /> Mark all as read
              </button>
           </div>
        </div>

        <div className="notif-list">
           {filteredNotifs.length === 0 ? (
             <div className="empty-state">
                <Bell size={48} />
                <h3>No notifications found</h3>
                <p>We'll notify you when something important happens.</p>
             </div>
           ) : (
             filteredNotifs.map((notif) => (
               <div key={notif.id} className={`notif-item glass-panel ${!notif.read ? 'unread' : ''}`}>
                  <div className="notif-icon-area">
                     {getIcon(notif.type)}
                  </div>
                  <div className="notif-content">
                     <div className="notif-top">
                        <h4>{notif.title}</h4>
                        <span className="notif-time">{notif.time}</span>
                     </div>
                     <p>{notif.message}</p>
                  </div>
                  <div className="notif-actions">
                     <button 
                       className="delete-btn"
                       onClick={() => handleDelete(notif.id)}
                       title="Remove notification"
                     >
                        <Trash2 size={16} />
                     </button>
                     {!notif.read && <div className="unread-dot"></div>}
                  </div>
               </div>
             ))
           )}
        </div>
      </main>

      <style jsx>{`
        .notif-page-wrapper {
          min-height: 100vh;
          background: var(--bg-app);
          padding-top: 100px;
        }

        .notif-container {
           max-width: 800px;
           margin: 0 auto;
           padding: 0 2rem 4rem;
        }

        .notif-header {
           display: flex;
           justify-content: space-between;
           align-items: flex-end;
           margin-bottom: 2rem;
           padding-bottom: 1rem;
           border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .header-left h1 {
           font-size: 1.8rem;
           font-weight: 700;
           color: white;
           margin-right: 1rem;
           display: inline-block;
        }
        
        .unread-badge {
           background: #ef4444;
           color: white;
           font-size: 0.7rem;
           font-weight: 700;
           padding: 2px 8px;
           border-radius: 99px;
           vertical-align: middle;
        }

        .header-actions {
           display: flex;
           gap: 1.5rem;
           align-items: center;
        }

        .filter-tabs {
           background: rgba(255,255,255,0.05);
           padding: 4px;
           border-radius: 8px;
           display: flex;
           gap: 4px;
        }

        .filter-btn {
           background: transparent;
           border: none;
           padding: 6px 16px;
           border-radius: 6px;
           color: var(--text-secondary);
           font-size: 0.85rem;
           cursor: pointer;
           font-weight: 500;
           transition: all 0.2s;
        }
        .filter-btn:hover { color: white; }
        .filter-btn.active {
           background: #3b82f6;
           color: white;
        }

        .mark-read-btn {
           display: flex;
           align-items: center;
           gap: 6px;
           background: transparent;
           border: none;
           color: var(--text-secondary);
           font-size: 0.85rem;
           cursor: pointer;
        }
        .mark-read-btn:hover { color: white; }

        /* LIST */
        .notif-list {
           display: flex;
           flex-direction: column;
           gap: 1rem;
        }

        .glass-panel {
           background: rgba(15, 23, 42, 0.6);
           backdrop-filter: blur(12px);
           border: 1px solid rgba(255, 255, 255, 0.05);
           border-radius: 16px;
        }

        .notif-item {
           display: flex;
           padding: 1.5rem;
           gap: 1.5rem;
           transition: all 0.2s;
           position: relative;
        }
        
        .notif-item.unread {
           background: rgba(30, 58, 138, 0.3); /* Blue tint for unread */
           border-color: rgba(59, 130, 246, 0.3);
           box-shadow: 0 4px 20px -5px rgba(59, 130, 246, 0.15);
        }

        .notif-icon-area {
           width: 40px; height: 40px;
           border-radius: 50%;
           background: rgba(255,255,255,0.05);
           display: flex; align-items: center; justify-content: center;
           flex-shrink: 0;
        }
        .unread .notif-icon-area { background: rgba(59, 130, 246, 0.1); }

        .notif-content { flex: 1; }
        .notif-top {
           display: flex; justify-content: space-between; align-items: flex-start;
           margin-bottom: 0.4rem;
        }
        
        .notif-top h4 {
           color: white;
           font-weight: 600;
           font-size: 1rem;
        }
        
        .notif-time {
           color: var(--text-tertiary);
           font-size: 0.75rem;
        }
        
        .notif-content p {
           color: var(--text-secondary);
           font-size: 0.9rem;
           line-height: 1.5;
        }
        
        .unread .notif-content p { color: #cbd5e1; }

        .notif-actions {
           display: flex;
           flex-direction: column;
           align-items: center;
           justify-content: space-between;
        }

        .delete-btn {
           color: var(--text-tertiary);
           background: transparent;
           border: none;
           cursor: pointer;
           opacity: 0;
           transition: opacity 0.2s;
        }
        .notif-item:hover .delete-btn { opacity: 1; }
        .delete-btn:hover { color: #ef4444; }

        .unread-dot {
           width: 8px; height: 8px;
           background: #3b82f6;
           border-radius: 50%;
        }

        .empty-state {
           text-align: center;
           padding: 4rem;
           color: var(--text-tertiary);
           display: flex;
           flex-direction: column;
           align-items: center;
           gap: 1rem;
        }
        .empty-state svg { opacity: 0.3; }

        @media (max-width: 600px) {
           .notif-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
           .header-actions { width: 100%; justify-content: space-between; }
        }
      `}</style>
    </div>
  );
}
