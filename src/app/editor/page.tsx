"use client";

import { Editor } from "@/components/Editor";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Sidebar } from "@/components/Sidebar";
import { calculateHumanScore } from "@/lib/detector";
import { detectAIHybrid } from "@/lib/hybrid-detector";
import { diffWords } from "diff";
import Cookies from "js-cookie";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface HistoryItem { 
  id: string; 
  timestamp: string; 
  preview: string; 
  input: string; 
  output: string; 
  persona: string;
  score: number | null; 
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [humanScore, setHumanScore] = useState<number | null>(null);
  const [aiSentences, setAiSentences] = useState<string[]>([]);
  const [inputAiSentences, setInputAiSentences] = useState<string[]>([]);
  
  // New State
  const [persona, setPersona] = useState("standard");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showDiff, setShowDiff] = useState(false);
  
  // Hybrid Detection State
  const [isMLDetecting, setIsMLDetecting] = useState(false);
  const [detectionConfidence, setDetectionConfidence] = useState<number | null>(null);
  const [detectionMethod, setDetectionMethod] = useState<'heuristic' | 'ml' | 'hybrid'>('heuristic');

  const [settings, setSettings] = useState({
    vocab: true,
    grammar: true,
    structure: true,
    burst: true,
    intensity: 75,
    fluff: false,
    typo: false,
    simplifier: false,
  });

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem("humanizer_history");
    if (saved) {
        try {
            setHistory(JSON.parse(saved));
        } catch (e) {
            console.error("Failed to parse history", e);
        }
    }
  }, []);

  const saveToHistory = (input: string, output: string, score: number | null) => {
     const newItem: HistoryItem = {
         id: Date.now().toString(),
         timestamp: new Date().toLocaleString(),
         preview: output.substring(0, 60) + "...",
         input,
         output,
         persona,
         score
     };
     const updated = [newItem, ...history].slice(0, 10); // keep last 10
     setHistory(updated);
     localStorage.setItem("humanizer_history", JSON.stringify(updated));
  };

  const handleRestore = (item: HistoryItem) => {
      setInputText(item.input);
      setOutputText(item.output);
      setHumanScore(item.score);
      setPersona(item.persona);
  };

  const handleClearHistory = () => {
      setHistory([]);
      localStorage.removeItem("humanizer_history");
  };

  const handleDeleteHistoryItem = (id: string) => {
      const updated = history.filter(item => item.id !== id);
      setHistory(updated);
      localStorage.setItem("humanizer_history", JSON.stringify(updated));
  };

  const diffHtml = useMemo(() => {
    if (!showDiff || !inputText || !outputText) return null;
    const diff = diffWords(inputText, outputText);
    return diff.map(part => {
      if (part.added) return `<ins>${part.value}</ins>`;
      if (part.removed) return `<del>${part.value}</del>`;
      return part.value;
    }).join("");
  }, [showDiff, inputText, outputText]);

  // Auto-scan effect removed to prevent distracting jumps/processing until requested.

  const handleHumanize = useCallback(async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    try {
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            text: inputText, 
            persona, // Pass persona
            ...settings 
        }),
      });
      
      const data = await response.json();
      if (data.text) {
        setOutputText(data.text);
        
        // 🚨 REAL SCAN TRIGGER 🚨
        // The API no longer lies. We must scan this ourselves to get the TRUTH.
        setIsMLDetecting(true);
        try {
           // We use the client-side logic wrapper to fetch the API
           const scanRes = await fetch("/api/detect", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ text: data.text, forceML: true })
           });
           const scanData = await scanRes.json();
           
           if (scanData.success && scanData.data) {
               const realScore = scanData.data.humanScore;
               setHumanScore(realScore);
               setAiSentences(scanData.data.aiSentences || []);
               saveToHistory(inputText, data.text, realScore); // Save confirmed truth
           }
        } catch (e) {
           console.error("Auto-scan failed", e);
           // Fallback if scan fails
           setHumanScore(null); 
           saveToHistory(inputText, data.text, null);
        } finally {
           setIsMLDetecting(false);
        }
      }
    } catch (error) {
      console.error("Failed to humanize:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [inputText, settings, persona, history]); // updated deps

  const handleInputChange = useCallback((val: string) => {
    setInputText(val);
    if (outputText) setOutputText(""); 
    if (inputAiSentences.length > 0) setInputAiSentences([]); // Clear highlights while typing
  }, [outputText, inputAiSentences]);

  const handleInputPaste = useCallback((val: string) => {
    setInputText(val);
    // Auto-scan disabled on paste per user request
  }, []);

  const handleSettingChange = useCallback((key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleClearInput = useCallback(() => {
    setInputText("");
    setHumanScore(null);
    setOutputText("");
    setInputAiSentences([]);
    setAiSentences([]);
  }, []);

  const handleScan = useCallback(async () => {
    const textToScan = outputText || inputText;
    if (!textToScan || textToScan.trim().length < 50) {
      alert("Please enter at least 50 characters to scan.");
      return;
    }
    
    setIsMLDetecting(true);
    try {
      // Call the hybrid detection API
      const response = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: textToScan,
          forceML: true // Force ML detection for manual scan
        }),
      });
      
      const result = await response.json();
      
      console.log("🔍 Full API Response:", result);
      
      if (result.success && result.data) {
        const { humanScore, aiScore, confidence, method, aiSentences, mlDetails } = result.data;
        
        console.log("📊 Detection Results:", {
          humanScore,
          aiScore,
          confidence,
          method,
          mlDetails
        });
        
        console.log("🔬 ML Details Breakdown:", {
          aiProbability: mlDetails?.aiProbability,
          humanProbability: mlDetails?.humanProbability,
          mlConfidence: mlDetails?.confidence,
          modelUsed: mlDetails?.modelUsed
        });
        
        setHumanScore(humanScore);
        setDetectionConfidence(confidence);
        setDetectionMethod(method);
        setAiSentences(aiSentences || []);
        if (!outputText) setInputAiSentences(aiSentences || []); // Also highlight input if we scanned it
        
        console.log("ML Detection complete:", {
          humanScore,
          aiScore,
          confidence,
          method
        });
      }
    } catch (error) {
      console.error("ML detection failed:", error);
      alert("Detection failed. Please try again.");
    } finally {
      setIsMLDetecting(false);
    }
  }, [inputText, outputText]);

  const handleExport = useCallback(() => {
    const textToExport = outputText || inputText;
    if (!textToExport) {
        alert("No text to export!");
        return;
    }
    
    // Open a new window
    const printWindow = window.open('', '_blank', 'width=1000,height=1200');
    if (!printWindow) {
        alert("Please allow popups to use the export feature.");
        return;
    }

    // Calculations
    const aiScore = humanScore !== null ? Math.max(0, 100 - Math.round(humanScore)) : 0;
    const submissionId = "oid:" + Math.floor(1000000000 + Math.random() * 9000000000);
    const dateStr = new Date().toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    
    // Highlight Logic
    let contentHtml = textToExport;
    contentHtml = contentHtml.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    if (aiSentences.length > 0) {
        aiSentences.forEach(sentence => {
            if (!sentence || sentence.length < 5) return;
            const escaped = sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escaped})`, 'g');
            contentHtml = contentHtml.replace(regex, '<mark>$1</mark>');
        });
    }

    contentHtml = contentHtml.replace(/\n/g, '<br/>');

    const html = `
      <html>
        <head>
          <title>AI Writing Overview</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              color: #2d2d2d;
              margin: 0;
              padding: 0;
              background: #fff;
              -webkit-print-color-adjust: exact;
            }
            .page-sheet {
                max-width: 210mm;
                margin: 0 auto;
                padding: 20px;
                position: relative;
            }
            @media print {
                .page-sheet { width: 100%; max-width: none; padding: 0; }
                .break-before { page-break-before: always; }
            }

            /* --- HEADER --- */
            .top-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 40px;
                font-size: 11px;
                color: #666;
                font-weight: 500;
            }
            .brand-logo {
                font-size: 16px;
                font-weight: 700;
                color: #3b82f6; 
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .brand-logo svg { width: 20px; height: 20px; }
            
            /* --- OVERVIEW SECTION --- */
            .overview-container {
                border-top: 1px solid #e5e7eb;
                padding-top: 40px;
                display: flex;
                gap: 50px;
                margin-bottom: 60px;
            }
            .score-main {
                flex: 1;
            }
            .percentage-large {
                font-size: 42px;
                font-weight: 800;
                line-height: 1;
                margin-bottom: 12px;
                color: #111;
            }
            .desc-text {
                font-size: 14px;
                color: #4b5563;
                line-height: 1.5;
                font-weight: 400;
            }
            
            .info-box {
                width: 380px;
                background: #e0f2fe; 
                border-radius: 6px;
                padding: 24px;
                font-size: 12px;
                color: #1e3a8a;
                line-height: 1.5;
            }
            .info-box strong { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 700; }

            /* --- DETECTION GROUPS --- */
            .groups-header {
                font-size: 16px;
                font-weight: 700;
                margin-bottom: 25px;
                color: #111;
            }
            .group-item {
                display: flex;
                gap: 16px;
                margin-bottom: 24px;
            }
            .group-icon {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 18px;
                flex-shrink: 0;
            }
            /* Colors matching the reference image */
            .icon-ai { background: #f59e0b; } /* Orange/Amber for AI */
            .icon-mixed { background: #8b5cf6; } /* Purple sparkles */
            
            .group-details { font-size: 13px; color: #4b5563; }
            .group-title { font-weight: 700; color: #111; font-size: 14px; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
            .highlight-badge {
                font-size: 9px;
                text-transform: uppercase;
                background: #fffbeb;
                color: #b45309;
                border: 1px solid #fcd34d;
                padding: 1px 4px;
                border-radius: 3px;
                letter-spacing: 0.5px;
            }

            /* --- PAGE 2 CONTENT --- */
            .doc-header-row {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                margin-bottom: 15px;
                margin-top: 20px;
            }
            .doc-title { font-size: 28px; font-weight: 700; color: #111; }
            .doc-meta { font-size: 12px; color: #666; font-weight: 500; }
            
            .legend-row {
                display: flex;
                gap: 20px;
                margin-bottom: 20px;
                font-size: 11px;
                color: #555;
            }
            .legend-item { display: flex; align-items: center; gap: 6px; }
            .legend-dot { width: 10px; height: 10px; border-radius: 2px; }
            
            .doc-divider {
                border: 0;
                border-top: 2px solid #111;
                margin: 0 0 30px 0;
            }

            .content-body {
                font-family: 'Times New Roman', serif;
                font-size: 12pt;
                line-height: 2;
                color: #000;
                text-align: left;
            }
            mark {
                background-color: rgba(245, 158, 11, 0.25); /* Light Orange */
                border-bottom: 2px solid #f59e0b;
                color: inherit;
                padding: 0;
                border-radius: 2px;
            }
          </style>
        </head>
        <body>
          
          <!-- PAGE 1: OVERVIEW -->
          <div class="page-sheet">
             <div class="top-bar">
                <div class="brand-logo">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                    Student Humanizer +
                </div>
                <div>Page 1 of 2 - AI Writing Overview</div>
                <div>Submission ID ${submissionId}</div>
             </div>

             <div class="overview-container">
                <div class="score-main">
                    <div class="percentage-large">${aiScore}% detected as AI</div>
                    <div class="desc-text">
                       The percentage indicates the combined amount of likely AI-generated text as well as likely AI-generated text that was also AI-paraphrased.
                    </div>
                </div>
                <div class="info-box">
                    <strong>Caution: Review required.</strong>
                    It is essential to understand the limitations of AI detection before making decisions about a student's work. We encourage you to learn more about our AI detection capabilities before using the tool.
                </div>
             </div>

             <div class="groups-header">Detection Groups</div>
             
             <div class="group-item">
                <div class="group-icon icon-ai">🤖</div>
                <div>
                   <div class="group-title">
                       ${aiScore}% AI-generated only
                       <span class="highlight-badge">Highlighted</span>
                   </div>
                   <div class="group-details">Likely AI-generated text from a large-language model.</div>
                </div>
             </div>
             
             <div class="group-item">
                <div class="group-icon icon-mixed">✨</div>
                <div>
                   <div class="group-title">0% AI-generated text that was AI-paraphrased</div>
                   <div class="group-details">Likely AI-generated text that was likely revised using an AI-paraphrase tool or word spinner.</div>
                </div>
             </div>
          </div>

          <!-- PAGE 2: CONTENT -->
          <div class="page-sheet break-before">
             <div class="top-bar">
                <div class="brand-logo">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                    Student Humanizer +
                </div>
                <div>Page 2 of 2 - Submission Content</div>
                <div>Submission ID ${submissionId}</div>
             </div>
             
             <div class="doc-header-row">
                <div class="doc-title">Submission Content</div>
                <div class="doc-meta">${dateStr} | ${submissionId}</div>
             </div>
             
             <div class="legend-row">
                <div class="legend-item">
                    <div class="legend-dot icon-ai"></div>
                    <span>Likely AI-generated (Orange)</span>
                </div>
             </div>

             <hr class="doc-divider">
             
             <div class="content-body">
                ${contentHtml}
             </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                 window.print();
              }, 800);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  }, [outputText, inputText, humanScore, aiSentences]);

  const handleFileUpload = useCallback(async (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    
    if (extension === "docx") {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setInputText(result.value);
    } else if (extension === "pdf") {
      // Basic PDF text extraction using pdfjs-dist
      // We import it dynamically to avoid SSR issues
      try {
        const pdfjs = await import("pdfjs-dist");
        // Set worker
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = "";
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(" ");
          fullText += pageText + "\n";
        }
        setInputText(fullText);
      } catch (err) {
        console.error("PDF parsing failed:", err);
        // Fallback or message
      }
    } else {
      // Default for text-based files
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInputText(text);
      };
      reader.readAsText(file);
    }
  }, []);

  const wordCount = (text: string) => text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <main className="app-container">
      <div className="mesh-bg"></div>
      {/* Left Panel: Settings */}
      <Sidebar 
        mode="settings"
        humanScore={humanScore} 
        settings={settings} 
        onSettingChange={handleSettingChange} 
        history={history}
        onRestore={handleRestore}
        onClearHistory={handleClearHistory}
        onDeleteHistory={handleDeleteHistoryItem}
      />
      
      {/* Center Panel: Workspace */}
      <div className="workspace-section">
        <header className="workspace-header">
           <Link href="/" className="brand">
              <h1>Humanizer<span style={{ color: "var(--accent-orange)" }}>AI</span></h1>
           </Link>
           <div className="actions">
              {outputText && (
                <button 
                  className={`action-btn outline ${showDiff ? 'active' : ''}`} 
                  onClick={() => setShowDiff(!showDiff)}
                  style={showDiff ? { background: 'var(--primary-faint)', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 600 } : {}}
                >
                   {showDiff ? "Show Original" : "Compare Changes"}
                </button>
              )}
              <button className="action-btn primary" onClick={handleHumanize} disabled={isProcessing}>
                 {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" color="white" />
                      <span>Optimizing...</span>
                    </span>
                 ) : "Humanize Text"}
              </button>
              <button 
                className="action-btn ml-scan" 
                onClick={handleScan} 
                disabled={isMLDetecting || (!inputText && !outputText)}
                title="Check for AI"
              >
                 {isMLDetecting ? "Checking..." : "🛡️ Check for AI"}
              </button>
              <button className="action-btn outline" onClick={handleExport}>Export</button>
              
              <div className="v-divider" />
              
              <Link href="/profile" className="profile-btn" title="Profile">
                <User size={18} />
              </Link>
              
              <button 
                className="logout-icon-btn" 
                onClick={() => {
                   Cookies.remove('auth_token');
                   window.location.href = '/';
                }}
                title="Log out"
              >
                 <LogOut size={18} />
              </button>
           </div>
        </header>

        <div className="editors-grid">
          <Editor 
            label="Input Source" 
            value={inputText} 
            onChange={handleInputChange} 
            onPaste={handleInputPaste}
            wordCount={wordCount(inputText)}
            onClear={handleClearInput}
            onFileUpload={handleFileUpload}
            placeholder="Paste text or upload file..."
            highlightedSentences={inputAiSentences}
          />
          <Editor 
            label="Humanized Output" 
            value={outputText} 
            readOnly
            wordCount={wordCount(outputText)}
            onEdit={() => setInputText(outputText)}
            placeholder="Result will appear here..."
            score={humanScore ? `${humanScore.toFixed(1)}%` : undefined}
            highlightedSentences={aiSentences}
            diffHtml={diffHtml}
          />
        </div>
      </div>

      {/* Right Panel: Analysis */}
      <Sidebar 
        mode="analysis"
        humanScore={humanScore} 
        settings={settings} 
        onSettingChange={handleSettingChange}
        aiSentencesCount={aiSentences.length}
        persona={persona}
        onPersonaChange={setPersona}
        detectionConfidence={detectionConfidence}
        detectionMethod={detectionMethod}
      />

      {isProcessing && (
        <div className="loading-overlay">
           <div className="loader">
              <div className="spinner" />
              <span>Humanizing...</span>
           </div>
        </div>
      )}
      
      {isMLDetecting && (
        <div className="loading-overlay">
           <div className="loader">
              <div className="spinner" />
              <span>Running ML Detection...</span>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                Using RoBERTa AI Detector
              </p>
           </div>
        </div>
      )}

      <style jsx>{`
        .app-container {
          height: 100vh;
          display: flex;
          background: var(--bg-app);
          overflow: hidden;
          position: relative;
        }

        .mesh-bg {
           position: absolute;
           top: 0; left: 0; right: 0; bottom: 0;
           background: radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 60%);
           z-index: 0;
           pointer-events: none;
        }

        .workspace-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          position: relative;
          z-index: 1;
        }

        .workspace-header {
          height: var(--nav-height);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(10px);
        }

        .brand h1 {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .actions {
           display: flex;
           gap: 1rem;
        }

        .action-btn {
           padding: 0.6rem 1.2rem;
           border-radius: var(--radius-sm);
           font-size: 0.9rem;
           font-weight: 500;
           cursor: pointer;
           transition: all 0.2s;
        }
        .action-btn.primary {
            background: var(--primary);
            color: white;
            border: none;
        }
        .action-btn.primary:hover {
            background: var(--primary-hover);
        }
        .action-btn.primary:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        .action-btn.outline {
           background: transparent;
           border: 1px solid var(--border-subtle);
           color: var(--text-secondary);
        }
        .action-btn.outline:hover {
           color: var(--text-primary);
           border-color: var(--text-primary);
        }
        
        .action-btn.ml-scan {
           background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
           border: 1px solid rgba(59, 130, 246, 0.3);
           color: #3b82f6;
           font-weight: 600;
        }
        .action-btn.ml-scan:hover {
           background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
           border-color: #3b82f6;
           transform: translateY(-1px);
           box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .action-btn.ml-scan:disabled {
           opacity: 0.5;
           cursor: not-allowed;
           transform: none;
        }

        .v-divider {
           width: 1px;
           height: 20px;
           background: rgba(255,255,255,0.1);
           margin: 0 0.5rem;
        }

        .profile-btn, .logout-icon-btn {
           width: 36px;
           height: 36px;
           display: flex;
           align-items: center;
           justify-content: center;
           border-radius: 9px;
           color: var(--text-secondary);
           transition: all 0.2s;
           border: 1px solid transparent;
        }
        .profile-btn:hover {
           background: var(--primary-faint);
           color: var(--primary);
           border-color: rgba(59, 130, 246, 0.2);
        }
        .logout-icon-btn:hover {
           background: rgba(239, 68, 68, 0.1);
           color: #ef4444;
           border-color: rgba(239, 68, 68, 0.2);
        }

        .editors-grid {
          flex: 1;
          display: flex;
          gap: 1rem; /* Gap between editors */
          padding: 1.5rem;
          overflow: hidden;
        }

        .loading-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-subtle);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loader span {
          font-family: var(--font-sans);
          font-weight: 500;
          color: white;
        }

        @media (max-width: 1200px) {
           .app-container {
              flex-direction: column;
              height: auto;
           }
           .editors-grid {
              flex-direction: column;
              height: 800px;
           }
        }
      `}</style>
    </main>
  );
}
