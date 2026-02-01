"use client";

import { Check, Copy, Edit3, FileUp, Search, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface EditorProps {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  wordCount?: number;
  score?: string;
  onClear?: () => void;
  onScan?: () => void;
  onEdit?: () => void;
  onFileUpload?: (file: File) => void;
  onPaste?: (val: string) => void;
  highlightedSentences?: string[];
  diffHtml?: string | null;
}

export const Editor: React.FC<EditorProps> = ({
  label,
  value,
  onChange,
  readOnly = false,
  placeholder = "Start typing...",
  wordCount = 0,
  score,
  onClear,
  onScan,
  onEdit,
  onFileUpload,
  onPaste,
  highlightedSentences = [],
  diffHtml = null
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Only sync if NOT highlighting and NOT diffing, otherwise we handle innerHTML
    const isShowingHtml = highlightedSentences.length > 0 || !!diffHtml;
    if (!isShowingHtml && editorRef.current && editorRef.current.innerText !== value) {
      editorRef.current.innerText = value;
    }
  }, [value, highlightedSentences, diffHtml]);

  const getHighlightedContent = () => {
    if (!highlightedSentences.length) return value;
    let html = value;
    // Escape HTML first to prevent XSS if we were handling raw input, 
    // but here value is text. We should escape it.
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    highlightedSentences.forEach(sentence => {
       if (!sentence || sentence.length < 5) return;
       // Escape sentence for regex
       const escaped = sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
       // Replace matching sentence with highlight
       const regex = new RegExp(`(${escaped})`, 'g');
       html = html.replace(regex, '<mark class="ai-highlight">$1</mark>');
    });
    return html;
  };

  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerText);
    }
  };

  const handleCopy = async () => {
    if (!value) return;
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch (err) {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed"; 
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(textarea);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    // Insert text at cursor position, stripping all formatting
    document.execCommand("insertText", false, text);
    if (onPaste) onPaste(editorRef.current?.innerText || text);
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="header-left">
          <span className="label-text">{label}</span>
          {onFileUpload && (
            <label className="icon-btn-label">
              <FileUp size={14} />
              <span>Upload</span>
              <input 
                type="file" 
                style={{ display: "none" }} 
                onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0])}
                accept=".txt,.md,.docx,.pdf"
              />
            </label>
          )}
        </div>
        <div className="header-right">
          <span className="stat-badge">{wordCount} words</span>
          {score && <span className="score-badge">Human: {score}</span>}
          
          <div className="header-actions">
           {onScan && (
              <button className="action-btn scan-btn" onClick={onScan} title="Run ML Detection">
                <Search size={14} />
              </button>
            )}
            {onClear && (
              <button className="action-btn" onClick={onClear} title="Clear text">
                <Trash2 size={14} />
              </button>
            )}
            {onEdit && (
              <button className="action-btn" onClick={onEdit} title="Send to input for editing">
                <Edit3 size={14} />
              </button>
            )}
            <button 
              className="action-btn" 
              onClick={handleCopy} 
              title="Copy to clipboard"
              style={isCopied ? { color: 'var(--success)', borderColor: 'var(--success)' } : {}}
            >
              {isCopied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>

      <div className="editor-wrapper">
        <div
          ref={editorRef}
          contentEditable={!readOnly}
          onInput={handleInput}
          onPaste={handlePaste}
          className="editor-content"
          data-placeholder={placeholder}
          spellCheck={false}
          suppressContentEditableWarning={true}
          dangerouslySetInnerHTML={
             diffHtml ? { __html: diffHtml } : 
             highlightedSentences.length > 0 ? { __html: getHighlightedContent() } : undefined
          }
        />
        
        {/* Actions ... */}
        {/* Floating actions removed - moved to header */}
      </div>

      <style jsx>{`
        /* ... existing styles ... */
        .editor-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 0;
        }

        :global(mark.ai-highlight) {
           background-color: rgba(234, 179, 8, 0.2);
           color: inherit;
           border-bottom: 2px solid #eab308;
           padding: 2px 0;
        }

        :global(ins) {
           background-color: rgba(16, 185, 129, 0.15);
           color: #10b981;
           text-decoration: none;
           border-bottom: 2px solid #10b981;
           padding: 0 2px;
        }

        :global(del) {
           background-color: rgba(239, 68, 68, 0.15);
           color: #ef4444;
           text-decoration: line-through;
           opacity: 0.8;
           padding: 0 2px;
        }

        /* ... rest of styles ... */


        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 0.5rem;
        }

        .header-left, .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .label-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-badge {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .score-badge {
          font-size: 0.75rem;
          color: var(--primary);
          background: var(--primary-faint);
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
        }

        .editor-wrapper {
          flex: 1;
          position: relative;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: border-color 0.2s;
          display: flex;
          flex-direction: column;
        }

        .editor-wrapper:focus-within {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 1px var(--border-focus);
        }

        .editor-content {
          flex: 1;
          padding: 1rem;
          outline: none;
          overflow-y: auto;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-primary);
          white-space: pre-wrap;
        }
        
        .editor-content:empty::before {
          content: attr(data-placeholder);
          color: var(--text-tertiary);
          pointer-events: none;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: 0.5rem;
          padding-left: 0.5rem;
          border-left: 1px solid var(--border-subtle);
        }

        .action-btn {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          color: var(--text-tertiary);
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          color: var(--text-primary);
          background: var(--bg-hover);
        }
        
        .scan-btn {
           color: var(--primary);
           background: var(--primary-faint);
        }
        .scan-btn:hover {
           background: var(--primary);
           color: #fff;
        }
          justify-content: center;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-tertiary);
          transition: all 0.2s;
        }
        .action-btn:hover {
          color: var(--text-primary);
          border-color: var(--primary);
          background: var(--bg-panel);
        }
        
        .scan-btn {
          color: #3b82f6 !important;
          border-color: rgba(59, 130, 246, 0.3) !important;
          background: rgba(59, 130, 246, 0.05) !important;
        }
        .scan-btn:hover {
          border-color: #3b82f6 !important;
          background: rgba(59, 130, 246, 0.15) !important;
          transform: scale(1.05);
        }

        .icon-btn-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-tertiary);
          cursor: pointer;
          transition: color 0.2s;
        }
        .icon-btn-label:hover {
          color: var(--primary);
        }

        .readonly {
          background-color: rgba(0,0,0,0.2); 
        }
      `}</style>
    </div>
  );
};
