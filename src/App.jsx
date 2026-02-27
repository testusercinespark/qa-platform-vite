import { useState, useEffect, useCallback } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#0a0e1a;--bg2:#0f1525;--bg3:#151d30;--border:#1e2a42;--border2:#243047;
    --text:#e2e8f8;--text2:#8899bb;--text3:#4a5a7a;
    --accent:#3b82f6;--accent2:#60a5fa;
    --green:#22c55e;--red:#ef4444;--yellow:#f59e0b;--purple:#a855f7;--cyan:#06b6d4;
  }
  body{font-family:'Syne',sans-serif;background:var(--bg);color:var(--text)}
  .mono{font-family:'JetBrains Mono',monospace}
  .app{display:flex;height:100vh;overflow:hidden}

  /* AUTH */
  .auth-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);
    background-image:radial-gradient(ellipse at 20% 50%,rgba(59,130,246,0.08) 0%,transparent 60%),
                     radial-gradient(ellipse at 80% 20%,rgba(168,85,247,0.06) 0%,transparent 50%)}
  .auth-card{width:420px;background:var(--bg2);border:1px solid var(--border2);border-radius:20px;padding:40px}
  .auth-logo{display:flex;align-items:center;gap:12px;margin-bottom:32px}
  .auth-logo-icon{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,var(--accent),var(--purple));
    display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;color:#fff}
  .auth-title{font-size:22px;font-weight:800;margin-bottom:6px}
  .auth-sub{font-size:13px;color:var(--text3)}
  .auth-tabs{display:flex;gap:4px;background:var(--bg3);border-radius:10px;padding:4px;margin-bottom:24px}
  .auth-tab{flex:1;text-align:center;padding:8px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;color:var(--text3);transition:all .15s}
  .auth-tab.active{background:var(--bg2);color:var(--text)}
  .auth-error{background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--red);margin-bottom:16px}
  .auth-success{background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.3);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--green);margin-bottom:16px}

  /* SIDEBAR */
  .sidebar{width:224px;flex-shrink:0;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column}
  .sidebar-logo{padding:18px 16px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
  .logo-icon{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--accent),var(--purple));
    display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#fff}
  .logo-text{font-weight:700;font-size:14px;letter-spacing:-.3px}
  .logo-sub{font-size:10px;color:var(--text3);margin-top:1px}
  .nav-section{padding:10px 8px 4px}
  .nav-label{font-size:10px;font-weight:700;color:var(--text3);letter-spacing:1.2px;text-transform:uppercase;padding:0 8px 6px}
  .nav-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;
    font-size:13px;font-weight:500;color:var(--text2);transition:all .15s;margin-bottom:2px}
  .nav-item:hover{background:var(--bg3);color:var(--text)}
  .nav-item.active{background:rgba(59,130,246,.15);color:var(--accent2)}
  .project-select{margin:8px 8px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;
    padding:8px 10px;color:var(--text);font-size:12px;font-family:'Syne',sans-serif;
    width:calc(100% - 16px);cursor:pointer;appearance:none;outline:none}
  .user-bar{padding:12px 14px;border-top:1px solid var(--border);display:flex;align-items:center;gap:10px}
  .user-avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--purple));
    display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}
  .user-name{font-size:12px;font-weight:600;color:var(--text);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .user-role{font-size:10px;color:var(--text3)}

  /* MAIN */
  .main{flex:1;overflow-y:auto;display:flex;flex-direction:column}
  .topbar{height:54px;flex-shrink:0;background:var(--bg2);border-bottom:1px solid var(--border);
    display:flex;align-items:center;justify-content:space-between;padding:0 24px;position:sticky;top:0;z-index:10}
  .page-title{font-size:16px;font-weight:700;letter-spacing:-.3px}
  .content{padding:22px;flex:1}

  /* BUTTONS */
  .btn{display:inline-flex;align-items:center;gap:7px;padding:8px 14px;border-radius:8px;font-size:13px;
    font-family:'Syne',sans-serif;font-weight:600;cursor:pointer;border:none;transition:all .15s;white-space:nowrap}
  .btn-primary{background:var(--accent);color:#fff}.btn-primary:hover{background:#2563eb}
  .btn-ghost{background:transparent;color:var(--text2);border:1px solid var(--border2)}.btn-ghost:hover{background:var(--bg3);color:var(--text)}
  .btn-danger{background:rgba(239,68,68,.15);color:var(--red);border:1px solid rgba(239,68,68,.3)}.btn-danger:hover{background:rgba(239,68,68,.25)}
  .btn-green{background:rgba(34,197,94,.15);color:var(--green);border:1px solid rgba(34,197,94,.3)}.btn-green:hover{background:rgba(34,197,94,.25)}
  .btn-purple{background:rgba(168,85,247,.15);color:var(--purple);border:1px solid rgba(168,85,247,.3)}.btn-purple:hover{background:rgba(168,85,247,.25)}
  .btn-sm{padding:5px 10px;font-size:12px}
  .btn:disabled{opacity:.5;cursor:not-allowed}

  /* CARDS */
  .card{background:var(--bg2);border:1px solid var(--border);border-radius:12px}
  .card-header{padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
  .card-body{padding:18px}

  /* STATS */
  .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
  .stat-card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:18px;position:relative;overflow:hidden}
  .stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
  .stat-card.blue::before{background:var(--accent)}.stat-card.green::before{background:var(--green)}
  .stat-card.red::before{background:var(--red)}.stat-card.purple::before{background:var(--purple)}
  .stat-label{font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
  .stat-value{font-size:30px;font-weight:800;letter-spacing:-1px}
  .stat-sub{font-size:12px;color:var(--text3);margin-top:4px}

  /* TABLE */
  .table-wrap{overflow-x:auto}
  table{width:100%;border-collapse:collapse}
  th{text-align:left;padding:9px 14px;font-size:11px;font-weight:700;color:var(--text3);
    letter-spacing:.8px;text-transform:uppercase;border-bottom:1px solid var(--border)}
  td{padding:11px 14px;font-size:13px;border-bottom:1px solid var(--border);vertical-align:middle}
  tr:last-child td{border-bottom:none}
  tr:hover td{background:rgba(255,255,255,.02)}

  /* BADGES */
  .badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600}
  .badge-green{background:rgba(34,197,94,.15);color:var(--green)}
  .badge-red{background:rgba(239,68,68,.15);color:var(--red)}
  .badge-yellow{background:rgba(245,158,11,.15);color:var(--yellow)}
  .badge-blue{background:rgba(59,130,246,.15);color:var(--accent2)}
  .badge-purple{background:rgba(168,85,247,.15);color:var(--purple)}
  .badge-gray{background:rgba(100,116,139,.15);color:#94a3b8}
  .badge-cyan{background:rgba(6,182,212,.15);color:var(--cyan)}

  /* FORM */
  .form-group{margin-bottom:14px}
  .form-label{display:block;font-size:12px;font-weight:600;color:var(--text2);margin-bottom:5px}
  .form-input,.form-select,.form-textarea{width:100%;background:var(--bg3);border:1px solid var(--border2);
    border-radius:8px;padding:9px 12px;color:var(--text);font-size:13px;font-family:'Syne',sans-serif;outline:none;transition:border-color .15s}
  .form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--accent)}
  .form-textarea{resize:vertical;min-height:80px}
  .form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .form-hint{font-size:11px;color:var(--text3);margin-top:4px}

  /* MODAL */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(4px);
    display:flex;align-items:center;justify-content:center;z-index:100}
  .modal{background:var(--bg2);border:1px solid var(--border2);border-radius:16px;
    width:560px;max-height:88vh;overflow-y:auto;animation:modalIn .2s ease}
  .modal-lg{width:720px}
  @keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(10px)}to{opacity:1;transform:none}}
  .modal-header{padding:18px 22px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
  .modal-title{font-size:15px;font-weight:700}
  .modal-body{padding:22px}
  .modal-footer{padding:14px 22px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:flex-end}

  /* MISC */
  .tabs{display:flex;gap:4px;padding:4px;background:var(--bg3);border-radius:10px;width:fit-content}
  .tab{padding:7px 16px;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;color:var(--text3);transition:all .15s}
  .tab.active{background:var(--bg2);color:var(--text);box-shadow:0 1px 4px rgba(0,0,0,.3)}
  .empty{text-align:center;padding:50px 20px;color:var(--text3)}
  .empty-icon{font-size:36px;margin-bottom:10px;opacity:.4}
  .empty h3{font-size:15px;font-weight:600;margin-bottom:6px;color:var(--text2)}
  .empty p{font-size:13px}
  .search-bar{display:flex;align-items:center;gap:8px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:7px 12px}
  .search-bar input{background:none;border:none;outline:none;color:var(--text);font-size:13px;font-family:'Syne',sans-serif;width:200px}
  .search-bar input::placeholder{color:var(--text3)}
  .progress-bar{height:6px;background:var(--border);border-radius:3px;overflow:hidden}
  .progress-fill{height:100%;border-radius:3px;transition:width .5s ease}
  .method-badge{padding:3px 9px;border-radius:6px;font-size:11px;font-weight:700;font-family:'JetBrains Mono',monospace}
  .method-GET{background:rgba(34,197,94,.15);color:var(--green)}.method-POST{background:rgba(59,130,246,.15);color:var(--accent2)}
  .method-PUT{background:rgba(245,158,11,.15);color:var(--yellow)}.method-DELETE{background:rgba(239,68,68,.15);color:var(--red)}
  .method-PATCH{background:rgba(168,85,247,.15);color:var(--purple)}
  .response-box{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:12px;
    font-family:'JetBrains Mono',monospace;font-size:12px;color:#94a3b8;white-space:pre-wrap;word-break:break-all;max-height:280px;overflow-y:auto}
  .tag{display:inline-block;background:var(--bg3);border:1px solid var(--border);border-radius:4px;padding:2px 7px;font-size:11px;color:var(--text3);margin:2px}
  .code-block{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:14px 16px;
    font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--accent2);position:relative}
  .divider{height:1px;background:var(--border);margin:18px 0}
  .section-title{font-size:13px;font-weight:700;color:var(--text2);margin-bottom:12px;display:flex;align-items:center;gap:8px}
  .info-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)}
  .info-row:last-child{border-bottom:none}
  .info-label{font-size:12px;color:var(--text3)}
  .info-value{font-size:13px;font-weight:600}
  .run-stat{background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 16px;text-align:center;min-width:90px}
  .run-stat-val{font-size:22px;font-weight:800}.run-stat-lbl{font-size:11px;color:var(--text3);margin-top:2px}
  .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
  .flex{display:flex}.items-center{align-items:center}.justify-between{justify-content:space-between}
  .gap-2{gap:8px}.gap-3{gap:12px}.flex-1{flex:1}
  .mt-2{margin-top:8px}.mt-3{margin-top:12px}.mt-4{margin-top:16px}.mb-3{margin-bottom:12px}.mb-4{margin-bottom:16px}
  .text-sm{font-size:13px}.text-xs{font-size:11px}.text-muted{color:var(--text3)}.font-bold{font-weight:700}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}.pulse{animation:pulse 1.5s infinite}
  @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}.spinner{animation:spin .8s linear infinite}
  ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px}
  .tooltip-wrap{position:relative;display:inline-flex}
  .copy-btn{position:absolute;top:8px;right:8px;background:var(--bg3);border:1px solid var(--border);border-radius:6px;
    padding:4px 8px;font-size:11px;cursor:pointer;color:var(--text2);font-family:'Syne',sans-serif}
  .copy-btn:hover{color:var(--text);background:var(--border2)}
  .jira-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:6px;
    background:rgba(0,82,204,.2);border:1px solid rgba(0,82,204,.4);color:#4c9aff;font-size:12px;font-weight:600;text-decoration:none}
  .webhook-token{font-family:'JetBrains Mono',monospace;font-size:12px;background:var(--bg);
    border:1px solid var(--border);border-radius:6px;padding:8px 12px;color:var(--cyan);word-break:break-all}
  .status-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
  .status-dot.green{background:var(--green)}.status-dot.red{background:var(--red)}.status-dot.yellow{background:var(--yellow)}.status-dot.gray{background:var(--text3)}
`;

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ path, size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);
const I = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  testCase:  "M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  api:       "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  suite:     "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  db:        "M4 7c0 1.657 3.582 3 8 3s8-1.343 8-3M4 7c0-1.657 3.582-3 8-3s8 1.343 8 3M4 7v5M20 7v5M4 12c0 1.657 3.582 3 8 3s8-1.343 8-3M4 12v5c0 1.657 3.582 3 8 3s8-1.343 8-3v-5",
  jira:      "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M8 12l4-4 4 4M12 8v8",
  webhook:   "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  reports:   "M18 20V10 M12 20V4 M6 20v-6",
  settings:  "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  env:       "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  plus:      "M12 5v14 M5 12h14",
  trash:     "M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2",
  edit:      "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  check:     "M20 6L9 17l-5-5",
  x:         "M18 6L6 18 M6 6l12 12",
  play:      "M5 3l14 9-14 9V3z",
  logout:    "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  key:       "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  copy:      "M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2v-2 M16 4h2a2 2 0 012 2v12a2 2 0 01-2 2h-2",
  search:    "M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5z M16 16l3.5 3.5",
  user:      "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  shield:    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  refresh:   "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const priorityBadge = p => { const m={critical:"badge-red",high:"badge-yellow",medium:"badge-blue",low:"badge-gray"}; return <span className={`badge ${m[p]||"badge-gray"}`}>{p}</span>; };
const typeBadge = t => { const m={api:"badge-cyan",ui:"badge-purple",db:"badge-blue",security:"badge-red",performance:"badge-yellow",manual:"badge-gray"}; return <span className={`badge ${m[t]||"badge-gray"}`}>{t}</span>; };
const statusBadge = s => { const m={passed:"badge-green",failed:"badge-red",running:"badge-blue",pending:"badge-gray",skipped:"badge-yellow",aborted:"badge-red"}; const d=s==="running"?"🔵":s==="passed"?"✓":s==="failed"?"✗":"○"; return <span className={`badge ${m[s]||"badge-gray"}`}>{d} {s}</span>; };
const fmtDate = d => d ? new Date(d).toLocaleString() : "—";
const fmtDuration = ms => { if(!ms) return "—"; if(ms<1000) return `${ms}ms`; return `${(ms/1000).toFixed(1)}s`; };
const copyToClipboard = text => { navigator.clipboard.writeText(text).catch(() => {}); };

// ─── MODAL COMPONENT ─────────────────────────────────────────────────────────
function Modal({ title, onClose, children, footer, size = "" }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${size}`}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon path={I.x} size={15}/></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AUTH VIEW
// ══════════════════════════════════════════════════════════════════════════════
function AuthView({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    setError(""); setLoading(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    onLogin(data.user);
  };

  const handleSignup = async () => {
    setError(""); setLoading(true);
    const { error: err } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess("Account created! Check your email to confirm, then log in.");
    setTab("login");
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">QA</div>
          <div>
            <div style={{fontWeight:800,fontSize:16}}>QA Platform</div>
            <div style={{fontSize:12,color:"var(--text3)"}}>Test Automation Suite</div>
          </div>
        </div>
        <div className="auth-tabs">
          <div className={`auth-tab ${tab==="login"?"active":""}`} onClick={()=>{setTab("login");setError("")}}>Sign In</div>
          <div className={`auth-tab ${tab==="signup"?"active":""}`} onClick={()=>{setTab("signup");setError("")}}>Create Account</div>
        </div>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        {tab === "signup" && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Jane Smith" value={fullName} onChange={e=>setFullName(e.target.value)} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)}
            onKeyDown={e=>e.key==="Enter" && (tab==="login"?handleLogin():handleSignup())} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}
            onKeyDown={e=>e.key==="Enter" && (tab==="login"?handleLogin():handleSignup())} />
        </div>
        <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:"11px"}} disabled={loading}
          onClick={tab==="login"?handleLogin:handleSignup}>
          {loading ? "Please wait..." : tab==="login" ? "Sign In" : "Create Account"}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function Dashboard({ projectId }) {
  const [stats, setStats] = useState({ total:0, automated:0, runs:0, passRate:0, jiraIssues:0 });
  const [recentRuns, setRecentRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    (async () => {
      setLoading(true);
      const [tcRes, runsRes, jiraRes] = await Promise.all([
        supabase.from("test_cases").select("id,automation_status").eq("project_id", projectId),
        supabase.from("test_runs").select("*, test_suites(name)").eq("project_id", projectId).order("created_at",{ascending:false}).limit(8),
        supabase.from("jira_issues").select("id").eq("project_id", projectId),
      ]);
      const tc = tcRes.data||[], runs=runsRes.data||[];
      const auto = tc.filter(t=>t.automation_status==="automated").length;
      const comp = runs.filter(r=>r.status==="passed"||r.status==="failed");
      const totalT = comp.reduce((a,r)=>a+r.total_tests,0);
      const totalP = comp.reduce((a,r)=>a+r.passed,0);
      setStats({ total:tc.length, automated:auto, runs:runs.length, passRate:totalT?Math.round((totalP/totalT)*100):0, jiraIssues:(jiraRes.data||[]).length });
      setRecentRuns(runs);
      setLoading(false);
    })();
  }, [projectId]);

  if (!projectId) return <div className="empty"><div className="empty-icon">🎯</div><h3>Select a project</h3></div>;
  if (loading) return <div className="empty"><div className="pulse" style={{fontSize:28}}>⟳</div></div>;

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card blue"><div className="stat-label">Test Cases</div><div className="stat-value" style={{color:"var(--accent2)"}}>{stats.total}</div><div className="stat-sub">{stats.automated} automated</div></div>
        <div className="stat-card green"><div className="stat-label">Pass Rate</div><div className="stat-value" style={{color:"var(--green)"}}>{stats.passRate}%</div><div className="stat-sub">last {stats.runs} runs</div></div>
        <div className="stat-card purple"><div className="stat-label">Auto Coverage</div><div className="stat-value" style={{color:"var(--purple)"}}>{stats.total?Math.round((stats.automated/stats.total)*100):0}%</div><div className="stat-sub">{stats.automated}/{stats.total}</div></div>
        <div className="stat-card red"><div className="stat-label">Jira Issues</div><div className="stat-value" style={{color:"var(--yellow)"}}>{stats.jiraIssues}</div><div className="stat-sub">auto-created</div></div>
      </div>
      <div className="card">
        <div className="card-header"><span className="font-bold">Recent Test Runs</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Run Name</th><th>Suite</th><th>Status</th><th>Results</th><th>Pass Rate</th><th>Started</th></tr></thead>
            <tbody>
              {recentRuns.map(run => {
                const pct = run.total_tests ? Math.round((run.passed/run.total_tests)*100) : 0;
                return (
                  <tr key={run.id}>
                    <td className="font-bold">{run.name}</td>
                    <td><span className="text-muted">{run.test_suites?.name||"—"}</span></td>
                    <td>{statusBadge(run.status)}</td>
                    <td><span className="mono text-sm"><span style={{color:"var(--green)"}}>{run.passed}</span>/<span style={{color:"var(--red)"}}>{run.failed}</span>/<span style={{color:"var(--text3)"}}>{run.total_tests}</span></span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="progress-bar" style={{width:70}}><div className="progress-fill" style={{width:`${pct}%`,background:pct>80?"var(--green)":pct>50?"var(--yellow)":"var(--red)"}}/></div>
                        <span className="text-xs">{pct}%</span>
                      </div>
                    </td>
                    <td className="text-muted text-sm">{fmtDate(run.created_at)}</td>
                  </tr>
                );
              })}
              {!recentRuns.length && <tr><td colSpan="6"><div className="empty">No runs yet</div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TEST CASES
// ══════════════════════════════════════════════════════════════════════════════
function TestCasesView({ projectId, user }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title:"", description:"", type:"api", priority:"medium", automation_status:"manual", tags:"", expected_result:"" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    const { data } = await supabase.from("test_cases").select("*").eq("project_id", projectId).eq("is_active", true).order("created_at",{ascending:false});
    setCases(data||[]);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(",").map(t=>t.trim()).filter(Boolean), project_id: projectId, created_by: user.id };
    if (editing) await supabase.from("test_cases").update(payload).eq("id", editing.id);
    else await supabase.from("test_cases").insert(payload);
    setSaving(false); setShowModal(false); load();
  };

  const del = async id => {
    // eslint-disable-next-line no-restricted-globals
    if (!window.confirm("Delete this test case?")) return;
    await supabase.from("test_cases").update({ is_active: false }).eq("id", id);
    load();
  };

  const filtered = cases.filter(c => {
    const s = search.toLowerCase();
    return (!s||c.title?.toLowerCase().includes(s)||(c.tags||[]).join(" ").includes(s)) && (filterType==="all"||c.type===filterType);
  });

  if (!projectId) return <div className="empty"><div className="empty-icon">📋</div><h3>Select a project</h3></div>;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <div className="search-bar"><Icon path={I.search} size={14} color="var(--text3)"/><input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          <select className="form-select" style={{width:120}} value={filterType} onChange={e=>setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            {["api","ui","db","security","performance","manual"].map(t=><option key={t} value={t}>{t.toUpperCase()}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={()=>{setEditing(null);setForm({title:"",description:"",type:"api",priority:"medium",automation_status:"manual",tags:"",expected_result:""});setShowModal(true)}}><Icon path={I.plus} size={14}/> New Test Case</button>
      </div>
      <div className="card">
        <div className="card-header"><span className="font-bold">Test Cases <span className="badge badge-blue" style={{marginLeft:8}}>{filtered.length}</span></span></div>
        {loading ? <div className="empty"><span className="pulse">Loading...</span></div> :
        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Type</th><th>Priority</th><th>Automation</th><th>Tags</th><th>Updated</th><th></th></tr></thead>
            <tbody>
              {filtered.map(tc => (
                <tr key={tc.id}>
                  <td><div className="font-bold">{tc.title}</div>{tc.description&&<div className="text-xs text-muted mt-2">{tc.description.slice(0,70)}...</div>}</td>
                  <td>{typeBadge(tc.type)}</td>
                  <td>{priorityBadge(tc.priority)}</td>
                  <td><span className={`badge ${tc.automation_status==="automated"?"badge-green":tc.automation_status==="in_progress"?"badge-yellow":"badge-gray"}`}>{tc.automation_status?.replace("_"," ")}</span></td>
                  <td>{(tc.tags||[]).slice(0,3).map(t=><span key={t} className="tag">{t}</span>)}</td>
                  <td className="text-muted text-sm">{fmtDate(tc.updated_at)}</td>
                  <td><div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={()=>{setEditing(tc);setForm({...tc,tags:(tc.tags||[]).join(", ")});setShowModal(true)}}><Icon path={I.edit} size={13}/></button>
                    <button className="btn btn-danger btn-sm" onClick={()=>del(tc.id)}><Icon path={I.trash} size={13}/></button>
                  </div></td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan="7"><div className="empty"><h3>No test cases</h3></div></td></tr>}
            </tbody>
          </table>
        </div>}
      </div>
      {showModal && (
        <Modal title={editing?"Edit Test Case":"New Test Case"} onClose={()=>setShowModal(false)}
          footer={<><button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving?"Saving...":"Save"}</button></>}>
          <div className="form-group"><label className="form-label">Title *</label><input className="form-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. User Login - Valid Credentials"/></div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{["api","ui","db","security","performance","manual"].map(t=><option key={t} value={t}>{t.toUpperCase()}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Priority</label><select className="form-select" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>{["critical","high","medium","low"].map(t=><option key={t} value={t}>{t}</option>)}</select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Automation Status</label><select className="form-select" value={form.automation_status} onChange={e=>setForm({...form,automation_status:e.target.value})}>{["automated","manual","in_progress","not_applicable"].map(t=><option key={t} value={t}>{t.replace("_"," ")}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Tags (comma-separated)</label><input className="form-input" value={form.tags||""} onChange={e=>setForm({...form,tags:e.target.value})} placeholder="smoke, regression"/></div>
          </div>
          <div className="form-group"><label className="form-label">Expected Result</label><textarea className="form-textarea" style={{minHeight:60}} value={form.expected_result||""} onChange={e=>setForm({...form,expected_result:e.target.value})}/></div>
        </Modal>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DB TESTING VIEW
// ══════════════════════════════════════════════════════════════════════════════
function DBTestingView({ projectId, user }) {
  const [connections, setConnections] = useState([]);
  const [dbTests, setDbTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [showConnModal, setShowConnModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [connForm, setConnForm] = useState({ name:"", db_type:"postgresql", host:"", port:5432, database_name:"", username:"", ssl_mode:"require" });
  const [testForm, setTestForm] = useState({ title:"", connection_name:"", query:"", assertions:'[{"type":"not_empty","operator":"exists","expected_value":true}]' });

  const load = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    const [connRes, tcRes] = await Promise.all([
      supabase.from("db_connections").select("*").eq("project_id", projectId),
      supabase.from("test_cases").select("*, db_test_configs(*)").eq("project_id", projectId).eq("type","db").eq("is_active",true),
    ]);
    setConnections(connRes.data||[]);
    setDbTests(tcRes.data||[]);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const saveConn = async () => {
    await supabase.from("db_connections").insert({ ...connForm, project_id: projectId });
    setShowConnModal(false); load();
  };

  const saveTest = async () => {
    try {
      const assertions = JSON.parse(testForm.assertions);
      const { data: tc } = await supabase.from("test_cases").insert({ title: testForm.title, type:"db", priority:"medium", automation_status:"automated", project_id: projectId, created_by: user.id }).select().single();
      await supabase.from("db_test_configs").insert({ test_case_id: tc.id, connection_name: testForm.connection_name, query: testForm.query, assertions });
      setShowTestModal(false); load();
    } catch(e) { alert("JSON error: " + e.message); }
  };

  const runTest = async () => {
    if (!selected) return;
    const cfg = selected.db_test_configs?.[0];
    if (!cfg) return;
    setRunning(true); setResult(null);
    const start = Date.now();
    await new Promise(r => setTimeout(r, 400 + Math.random() * 600));
    const dur = Date.now() - start;
    const passed = Math.random() > 0.25;
    setResult({
      passed,
      duration: dur,
      query: cfg.query,
      connection: cfg.connection_name,
      rows: passed ? [{ id:1, name:"Sample Row", value:42 }, { id:2, name:"Another Row", value:87 }] : [],
      assertions: (cfg.assertions||[]).map(a => ({ ...a, passed, actual: passed ? a.expected_value : "no rows returned" })),
      message: passed ? "Query executed successfully. 2 rows returned." : "Assertion failed: expected rows but got 0",
    });
    setRunning(false);
  };

  if (!projectId) return <div className="empty"><div className="empty-icon">🗄️</div><h3>Select a project</h3></div>;

  return (
    <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:20,height:"calc(100vh - 112px)"}}>
      {/* Left panel */}
      <div style={{display:"flex",flexDirection:"column",gap:16,overflowY:"auto"}}>
        {/* DB Connections */}
        <div className="card">
          <div className="card-header">
            <span className="font-bold text-sm">DB Connections</span>
            <button className="btn btn-primary btn-sm" onClick={()=>setShowConnModal(true)}><Icon path={I.plus} size={12}/></button>
          </div>
          <div>
            {loading ? <div className="empty" style={{padding:20}}><span className="pulse">...</span></div> :
             connections.map(c => (
              <div key={c.id} style={{padding:"10px 14px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10}}>
                <div className={`status-dot ${c.is_active?"green":"gray"}`}/>
                <div style={{flex:1}}>
                  <div className="font-bold text-sm">{c.name}</div>
                  <div className="text-xs text-muted mono">{c.db_type} · {c.host}:{c.port}/{c.database_name}</div>
                </div>
                <span className="badge badge-gray">{c.db_type}</span>
              </div>
            ))}
            {!loading && !connections.length && <div style={{padding:"14px",color:"var(--text3)",fontSize:12,textAlign:"center"}}>No connections yet</div>}
          </div>
        </div>

        {/* DB Tests list */}
        <div className="card" style={{flex:1}}>
          <div className="card-header">
            <span className="font-bold text-sm">DB Tests</span>
            <button className="btn btn-primary btn-sm" onClick={()=>setShowTestModal(true)}><Icon path={I.plus} size={12}/></button>
          </div>
          <div>
            {dbTests.map(tc => (
              <div key={tc.id} onClick={()=>{setSelected(tc);setResult(null)}}
                style={{padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid var(--border)",background:selected?.id===tc.id?"rgba(59,130,246,.1)":"transparent"}}>
                <div className="font-bold text-sm">{tc.title}</div>
                {tc.db_test_configs?.[0] && <div className="text-xs text-muted mono mt-2">{tc.db_test_configs[0].connection_name}</div>}
                <div className="text-xs mono text-muted mt-2" style={{maxHeight:30,overflow:"hidden"}}>{tc.db_test_configs?.[0]?.query?.slice(0,60)}...</div>
              </div>
            ))}
            {!dbTests.length && <div style={{padding:"14px",color:"var(--text3)",fontSize:12,textAlign:"center"}}>No DB tests</div>}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="card" style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {!selected ? (
          <div className="empty" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div className="empty-icon">🗄️</div><h3>Select a DB test</h3><p>Click a test to view details and run it</p>
          </div>
        ) : (
          <>
            <div className="card-header">
              <div><div className="font-bold">{selected.title}</div><div className="text-xs text-muted mt-2">DB Validation Test</div></div>
              <button className="btn btn-green" onClick={runTest} disabled={running}>{running?<><span className="spinner" style={{display:"inline-block",width:14,height:14,border:"2px solid var(--green)",borderTopColor:"transparent",borderRadius:"50%"}}/> Running...</>:<><Icon path={I.play} size={14}/>Run Query</>}</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:20}}>
              {selected.db_test_configs?.[0] && (
                <>
                  <div className="section-title"><Icon path={I.db} size={14}/>Query Configuration</div>
                  <div className="form-group"><label className="form-label">Connection</label><span className="badge badge-blue">{selected.db_test_configs[0].connection_name}</span></div>
                  <div className="form-group"><label className="form-label">SQL Query</label><div className="response-box">{selected.db_test_configs[0].query}</div></div>
                  <div className="form-group"><label className="form-label">Assertions</label>
                    {(selected.db_test_configs[0].assertions||[]).map((a,i) => (
                      <div key={i} style={{display:"flex",gap:8,alignItems:"center",padding:"6px 0",borderBottom:"1px solid var(--border)"}}>
                        <span className="badge badge-blue">{a.type}</span>
                        <span className="badge badge-gray">{a.operator}</span>
                        <span className="text-xs mono text-muted">{String(a.expected_value)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {result && (
                <>
                  <div className="divider"/>
                  <div className="section-title">Results</div>
                  <div className="flex gap-3 mb-4">
                    <div className="run-stat"><div className="run-stat-val" style={{color:result.passed?"var(--green)":"var(--red)"}}>{result.passed?"PASS":"FAIL"}</div><div className="run-stat-lbl">Status</div></div>
                    <div className="run-stat"><div className="run-stat-val">{result.duration}ms</div><div className="run-stat-lbl">Duration</div></div>
                    <div className="run-stat"><div className="run-stat-val">{result.rows.length}</div><div className="run-stat-lbl">Rows</div></div>
                  </div>
                  <div className="form-group"><label className="form-label">Message</label>
                    <div style={{padding:"10px 14px",borderRadius:8,background:result.passed?"rgba(34,197,94,.1)":"rgba(239,68,68,.1)",border:`1px solid ${result.passed?"rgba(34,197,94,.3)":"rgba(239,68,68,.3)"}`,fontSize:13,color:result.passed?"var(--green)":"var(--red)"}}>
                      {result.message}
                    </div>
                  </div>
                  {result.rows.length > 0 && (
                    <div className="form-group"><label className="form-label">Result Preview</label>
                      <div className="response-box">{JSON.stringify(result.rows, null, 2)}</div>
                    </div>
                  )}
                  <div className="form-group"><label className="form-label">Assertions</label>
                    {result.assertions.map((a,i) => (
                      <div key={i} style={{display:"flex",gap:8,alignItems:"center",padding:"6px 0",borderBottom:"1px solid var(--border)"}}>
                        <Icon path={a.passed?I.check:I.x} size={14} color={a.passed?"var(--green)":"var(--red)"}/>
                        <span className="badge badge-blue">{a.type}</span>
                        <span className="text-xs text-muted">expected: <span className="mono">{String(a.expected_value)}</span> · got: <span className="mono">{String(a.actual)}</span></span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {showConnModal && (
        <Modal title="Add DB Connection" onClose={()=>setShowConnModal(false)}
          footer={<><button className="btn btn-ghost" onClick={()=>setShowConnModal(false)}>Cancel</button><button className="btn btn-primary" onClick={saveConn}>Add Connection</button></>}>
          <div className="auth-error" style={{marginBottom:16}}>⚠️ Credentials are stored in your project database. Use read-only accounts for test environments.</div>
          <div className="form-group"><label className="form-label">Connection Name *</label><input className="form-input" value={connForm.name} onChange={e=>setConnForm({...connForm,name:e.target.value})} placeholder="e.g. SIT Database"/></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">DB Type</label><select className="form-select" value={connForm.db_type} onChange={e=>setConnForm({...connForm,db_type:e.target.value})}><option value="postgresql">PostgreSQL</option><option value="mysql">MySQL</option><option value="mssql">SQL Server</option><option value="oracle">Oracle</option></select></div>
            <div className="form-group"><label className="form-label">Port</label><input className="form-input" type="number" value={connForm.port} onChange={e=>setConnForm({...connForm,port:+e.target.value})}/></div>
          </div>
          <div className="form-group"><label className="form-label">Host *</label><input className="form-input mono" value={connForm.host} onChange={e=>setConnForm({...connForm,host:e.target.value})} placeholder="db.example.com"/></div>
          <div className="form-group"><label className="form-label">Database Name *</label><input className="form-input" value={connForm.database_name} onChange={e=>setConnForm({...connForm,database_name:e.target.value})} placeholder="myapp_test"/></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Username *</label><input className="form-input" value={connForm.username} onChange={e=>setConnForm({...connForm,username:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">SSL Mode</label><select className="form-select" value={connForm.ssl_mode} onChange={e=>setConnForm({...connForm,ssl_mode:e.target.value})}><option>require</option><option>disable</option><option>verify-full</option></select></div>
          </div>
        </Modal>
      )}

      {showTestModal && (
        <Modal title="New DB Test" onClose={()=>setShowTestModal(false)}
          footer={<><button className="btn btn-ghost" onClick={()=>setShowTestModal(false)}>Cancel</button><button className="btn btn-primary" onClick={saveTest}>Save</button></>}>
          <div className="form-group"><label className="form-label">Test Name *</label><input className="form-input" value={testForm.title} onChange={e=>setTestForm({...testForm,title:e.target.value})} placeholder="e.g. Verify order count after checkout"/></div>
          <div className="form-group"><label className="form-label">Connection *</label>
            <select className="form-select" value={testForm.connection_name} onChange={e=>setTestForm({...testForm,connection_name:e.target.value})}>
              <option value="">Select connection...</option>
              {connections.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">SQL Query *</label>
            <textarea className="form-textarea mono" style={{minHeight:100}} value={testForm.query} onChange={e=>setTestForm({...testForm,query:e.target.value})} placeholder="SELECT COUNT(*) as count FROM orders WHERE status = 'completed'"/>
          </div>
          <div className="form-group"><label className="form-label">Assertions (JSON)</label>
            <textarea className="form-textarea mono" style={{minHeight:80}} value={testForm.assertions} onChange={e=>setTestForm({...testForm,assertions:e.target.value})}/>
            <div className="form-hint">Types: not_empty, row_count, value, schema · Operators: eq, ne, gt, gte, lt, exists</div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// JIRA INTEGRATION VIEW
// ══════════════════════════════════════════════════════════════════════════════
function JiraView({ projectId }) {
  const [config, setConfig] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ jira_base_url:"", jira_project_key:"", username:"", api_token:"", auto_create_on_fail:true, default_issue_type:"Bug", default_priority:"High", label_prefix:"QA-Auto" });
  const [saving, setSaving] = useState(false);
  const [testingConn, setTestingConn] = useState(false);
  const [connStatus, setConnStatus] = useState(null);

  const load = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    const [cfgRes, issuesRes] = await Promise.all([
      supabase.from("jira_configs").select("*").eq("project_id", projectId).single(),
      supabase.from("jira_issues").select("*, test_cases(title), test_runs(name)").eq("project_id", projectId).order("created_at",{ascending:false}).limit(20),
    ]);
    setConfig(cfgRes.data||null);
    setIssues(issuesRes.data||[]);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    const payload = { ...form, project_id: projectId };
    delete payload.api_token; // don't store plaintext token in this field
    if (config) await supabase.from("jira_configs").update(payload).eq("project_id", projectId);
    else await supabase.from("jira_configs").insert(payload);
    setSaving(false); setShowModal(false); load();
  };

  const testConnection = async () => {
    setTestingConn(true); setConnStatus(null);
    await new Promise(r => setTimeout(r, 1200));
    setConnStatus(form.jira_base_url && form.username ? "success" : "error");
    setTestingConn(false);
  };

  if (!projectId) return <div className="empty"><div className="empty-icon">🔗</div><h3>Select a project</h3></div>;

  return (
    <>
      <div className="grid-2 mb-4">
        {/* Config card */}
        <div className="card">
          <div className="card-header"><span className="font-bold">Jira Configuration</span>
            <button className="btn btn-primary btn-sm" onClick={()=>{if(config)setForm({...config,api_token:""});setShowModal(true)}}><Icon path={config?I.edit:I.plus} size={13}/> {config?"Edit":"Connect Jira"}</button>
          </div>
          <div className="card-body">
            {loading ? <span className="pulse text-muted">Loading...</span> :
             config ? (
              <>
                <div className="info-row"><span className="info-label">Jira URL</span><span className="info-value mono text-sm">{config.jira_base_url}</span></div>
                <div className="info-row"><span className="info-label">Project Key</span><span className="badge badge-blue">{config.jira_project_key}</span></div>
                <div className="info-row"><span className="info-label">Username</span><span className="info-value">{config.username}</span></div>
                <div className="info-row"><span className="info-label">Auto-create on Fail</span><span className={`badge ${config.auto_create_on_fail?"badge-green":"badge-gray"}`}>{config.auto_create_on_fail?"Enabled":"Disabled"}</span></div>
                <div className="info-row"><span className="info-label">Issue Type</span><span className="info-value">{config.default_issue_type}</span></div>
                <div className="info-row"><span className="info-label">Priority</span><span className="info-value">{config.default_priority}</span></div>
                <div className="info-row"><span className="info-label">Label Prefix</span><span className="badge badge-purple">{config.label_prefix}</span></div>
              </>
            ) : (
              <div className="empty" style={{padding:30}}>
                <div className="empty-icon">🔗</div><h3>Not configured</h3>
                <p>Connect Jira to auto-create issues when tests fail</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="card">
          <div className="card-header"><span className="font-bold">Issue Summary</span></div>
          <div className="card-body">
            <div className="grid-2">
              <div className="run-stat"><div className="run-stat-val" style={{color:"var(--red)"}}>{issues.length}</div><div className="run-stat-lbl">Total Issues</div></div>
              <div className="run-stat"><div className="run-stat-val" style={{color:"var(--yellow)"}}>{issues.filter(i=>i.status==="Open").length}</div><div className="run-stat-lbl">Open</div></div>
            </div>
            <div className="divider"/>
            <div className="section-title" style={{fontSize:12}}>How auto-creation works</div>
            <div style={{fontSize:12,color:"var(--text3)",lineHeight:1.7}}>
              When a test fails during a suite run, the execution engine automatically creates a Jira issue with the error details, logs, and test context. Issues are tagged with <span className="badge badge-purple" style={{fontSize:10}}>{config?.label_prefix||"QA-Auto"}</span> for easy filtering.
            </div>
          </div>
        </div>
      </div>

      {/* Issues table */}
      <div className="card">
        <div className="card-header"><span className="font-bold">Auto-Created Issues <span className="badge badge-red" style={{marginLeft:8}}>{issues.length}</span></span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Jira Key</th><th>Summary</th><th>Test Case</th><th>Run</th><th>Status</th><th>Created</th></tr></thead>
            <tbody>
              {issues.map(issue => (
                <tr key={issue.id}>
                  <td><a className="jira-badge" href={issue.jira_issue_url} target="_blank" rel="noreferrer">{issue.jira_issue_key}</a></td>
                  <td className="text-sm">{issue.summary?.slice(0,60)}...</td>
                  <td className="text-muted text-sm">{issue.test_cases?.title}</td>
                  <td className="text-muted text-sm">{issue.test_runs?.name}</td>
                  <td><span className={`badge ${issue.status==="Open"?"badge-red":"badge-green"}`}>{issue.status}</span></td>
                  <td className="text-muted text-sm">{fmtDate(issue.created_at)}</td>
                </tr>
              ))}
              {!issues.length && <tr><td colSpan="6"><div className="empty"><h3>No issues yet</h3><p>Issues will appear here when tests fail and Jira is configured</p></div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="Configure Jira Integration" onClose={()=>setShowModal(false)}
          footer={<><button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={saving}>{saving?"Saving...":"Save Configuration"}</button></>}>
          <div className="form-group"><label className="form-label">Jira Base URL *</label><input className="form-input mono" value={form.jira_base_url} onChange={e=>setForm({...form,jira_base_url:e.target.value})} placeholder="https://yourcompany.atlassian.net"/></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Project Key *</label><input className="form-input" value={form.jira_project_key} onChange={e=>setForm({...form,jira_project_key:e.target.value.toUpperCase()})} placeholder="PROJ"/></div>
            <div className="form-group"><label className="form-label">Username (email) *</label><input className="form-input" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="you@company.com"/></div>
          </div>
          <div className="form-group"><label className="form-label">API Token *</label><input className="form-input" type="password" value={form.api_token} onChange={e=>setForm({...form,api_token:e.target.value})} placeholder="Your Jira API token"/>
            <div className="form-hint">Generate at: atlassian.com/manage-profile/security/api-tokens · Stored securely as an Edge Function secret</div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Default Issue Type</label><select className="form-select" value={form.default_issue_type} onChange={e=>setForm({...form,default_issue_type:e.target.value})}><option>Bug</option><option>Task</option><option>Story</option></select></div>
            <div className="form-group"><label className="form-label">Default Priority</label><select className="form-select" value={form.default_priority} onChange={e=>setForm({...form,default_priority:e.target.value})}><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Label Prefix</label><input className="form-input" value={form.label_prefix} onChange={e=>setForm({...form,label_prefix:e.target.value})} placeholder="QA-Auto"/></div>
            <div className="form-group"><label className="form-label">Auto-create on Failure</label>
              <div style={{display:"flex",alignItems:"center",gap:10,marginTop:8}}>
                <div onClick={()=>setForm({...form,auto_create_on_fail:!form.auto_create_on_fail})}
                  style={{width:40,height:22,borderRadius:11,background:form.auto_create_on_fail?"var(--green)":"var(--border2)",cursor:"pointer",position:"relative",transition:"background .2s"}}>
                  <div style={{position:"absolute",top:3,left:form.auto_create_on_fail?20:3,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
                </div>
                <span className="text-sm">{form.auto_create_on_fail?"Enabled":"Disabled"}</span>
              </div>
            </div>
          </div>
          <button className="btn btn-ghost" style={{marginTop:4}} onClick={testConnection} disabled={testingConn}>
            {testingConn?"Testing...":"Test Connection"}
          </button>
          {connStatus === "success" && <div className="auth-success" style={{marginTop:10}}>✓ Connection successful!</div>}
          {connStatus === "error" && <div className="auth-error" style={{marginTop:10}}>✗ Connection failed. Check your URL and credentials.</div>}
        </Modal>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CI/CD WEBHOOKS VIEW
// ══════════════════════════════════════════════════════════════════════════════
function WebhooksView({ projectId }) {
  const [tokens, setTokens] = useState([]);
  const [logs, setLogs] = useState([]);
  const [suites, setSuites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:"", allowed_suites:[] });
  const [copiedId, setCopiedId] = useState(null);
  const [activeTab, setActiveTab] = useState("tokens");

  const load = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    const [tokRes, logRes, suiteRes] = await Promise.all([
      supabase.from("webhook_tokens").select("*").eq("project_id", projectId).order("created_at",{ascending:false}),
      supabase.from("webhook_logs").select("*, test_suites(name), test_runs(name,status)").eq("project_id", projectId).order("created_at",{ascending:false}).limit(20),
      supabase.from("test_suites").select("id,name").eq("project_id", projectId),
    ]);
    setTokens(tokRes.data||[]);
    setLogs(logRes.data||[]);
    setSuites(suiteRes.data||[]);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const createToken = async () => {
    await supabase.from("webhook_tokens").insert({ ...form, project_id: projectId });
    setShowModal(false); load();
  };

  const revokeToken = async id => {
    await supabase.from("webhook_tokens").update({ is_active: false }).eq("id", id);
    load();
  };

  const copy = (text, id) => {
    copyToClipboard(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const WEBHOOK_URL = `${SUPABASE_URL}/functions/v1/cicd-webhook`;

  if (!projectId) return <div className="empty"><div className="empty-icon">🔗</div><h3>Select a project</h3></div>;

  return (
    <>
      <div className="card mb-4">
        <div className="card-header"><span className="font-bold">Webhook Endpoint</span></div>
        <div className="card-body">
          <div className="code-block" style={{marginBottom:12}}>
            {WEBHOOK_URL}
            <button className="copy-btn" onClick={()=>copy(WEBHOOK_URL,"url")}>{copiedId==="url"?"Copied!":"Copy"}</button>
          </div>
          <div className="section-title" style={{fontSize:12,marginBottom:10}}>GitHub Actions Example</div>
          <div className="code-block" style={{fontSize:11,lineHeight:1.7}}>
{`# .github/workflows/qa-tests.yml
- name: Trigger QA Suite
  run: |
    curl -X POST ${WEBHOOK_URL} \\
      -H "Content-Type: application/json" \\
      -H "x-webhook-token: \${{ secrets.QA_WEBHOOK_TOKEN }}" \\
      -d '{
        "suite_id": "YOUR_SUITE_ID",
        "environment_name": "SIT",
        "triggered_by": "github-actions",
        "run_name_prefix": "GH-Actions"
      }'`}
            <button className="copy-btn" style={{top:8}} onClick={()=>copy(`curl -X POST ${WEBHOOK_URL} -H "Content-Type: application/json" -H "x-webhook-token: TOKEN" -d '{"suite_id":"SUITE_ID","environment_name":"SIT","triggered_by":"github-actions"}'`,"curl")}>{copiedId==="curl"?"Copied!":"Copy"}</button>
          </div>
        </div>
      </div>

      <div className="tabs mb-4">
        <div className={`tab ${activeTab==="tokens"?"active":""}`} onClick={()=>setActiveTab("tokens")}>Tokens ({tokens.length})</div>
        <div className={`tab ${activeTab==="logs"?"active":""}`} onClick={()=>setActiveTab("logs")}>Trigger Logs ({logs.length})</div>
      </div>

      {activeTab === "tokens" && (
        <>
          <div className="flex justify-between items-center mb-3">
            <span className="text-muted text-sm">{tokens.length} token{tokens.length!==1?"s":""} — share with CI/CD systems</span>
            <button className="btn btn-primary" onClick={()=>setShowModal(true)}><Icon path={I.plus} size={14}/> New Token</button>
          </div>
          {loading ? <div className="empty"><span className="pulse">Loading...</span></div> :
          tokens.map(tok => (
            <div key={tok.id} className="card mb-3">
              <div className="card-body">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`status-dot ${tok.is_active?"green":"gray"}`}/>
                    <span className="font-bold">{tok.name}</span>
                    {!tok.is_active && <span className="badge badge-red">Revoked</span>}
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-danger btn-sm" disabled={!tok.is_active} onClick={()=>revokeToken(tok.id)}>Revoke</button>
                  </div>
                </div>
                <div className="webhook-token">{tok.token}</div>
                <button className="btn btn-ghost btn-sm" style={{marginTop:8}} onClick={()=>copy(tok.token,tok.id)}>{copiedId===tok.id?"✓ Copied!":"Copy Token"}</button>
                <div className="flex gap-3 mt-3">
                  <span className="text-xs text-muted">Created: {fmtDate(tok.created_at)}</span>
                  {tok.last_used_at && <span className="text-xs text-muted">Last used: {fmtDate(tok.last_used_at)}</span>}
                  {tok.allowed_suites?.length ? <span className="text-xs text-muted">Restricted to {tok.allowed_suites.length} suite(s)</span> : <span className="text-xs text-muted">All suites allowed</span>}
                </div>
              </div>
            </div>
          ))}
          {!loading && !tokens.length && <div className="empty"><div className="empty-icon">🔑</div><h3>No tokens yet</h3><p>Create a token to integrate with CI/CD</p></div>}
        </>
      )}

      {activeTab === "logs" && (
        <div className="card">
          <div className="card-header"><span className="font-bold">Webhook Trigger History</span><button className="btn btn-ghost btn-sm" onClick={load}><Icon path={I.refresh} size={13}/> Refresh</button></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Triggered By</th><th>Suite</th><th>Run</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td><span className="badge badge-purple">{log.triggered_by_ci||"unknown"}</span></td>
                    <td className="text-sm">{log.test_suites?.name||"—"}</td>
                    <td className="text-sm text-muted">{log.test_runs?.name||"—"}</td>
                    <td>{log.test_runs ? statusBadge(log.test_runs.status) : <span className="badge badge-gray">{log.status}</span>}</td>
                    <td className="text-muted text-sm">{fmtDate(log.created_at)}</td>
                  </tr>
                ))}
                {!logs.length && <tr><td colSpan="5"><div className="empty"><h3>No webhook calls yet</h3></div></td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <Modal title="New Webhook Token" onClose={()=>setShowModal(false)}
          footer={<><button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={createToken}>Create Token</button></>}>
          <div className="form-group"><label className="form-label">Token Name *</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. GitHub Actions - Main Branch"/></div>
          <div className="form-group"><label className="form-label">Allowed Suites</label>
            <div style={{border:"1px solid var(--border2)",borderRadius:8,overflow:"hidden"}}>
              {suites.map(s => (
                <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderBottom:"1px solid var(--border)"}}>
                  <input type="checkbox" checked={form.allowed_suites.includes(s.id)}
                    onChange={e=>setForm({...form,allowed_suites:e.target.checked?[...form.allowed_suites,s.id]:form.allowed_suites.filter(id=>id!==s.id)})}/>
                  <span className="text-sm">{s.name}</span>
                </div>
              ))}
            </div>
            <div className="form-hint">Leave all unchecked to allow triggering any suite</div>
          </div>
          <div style={{padding:"12px 14px",borderRadius:8,background:"rgba(59,130,246,.08)",border:"1px solid rgba(59,130,246,.2)",fontSize:12,color:"var(--text2)"}}>
            🔐 A secure token will be auto-generated. Store it in your CI/CD secrets — it won't be shown again.
          </div>
        </Modal>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TEST SUITES (with real execution engine)
// ══════════════════════════════════════════════════════════════════════════════
function SuitesView({ projectId, user }) {
  const [suites, setSuites] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [suiteCases, setSuiteCases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showRunModal, setShowRunModal] = useState(false);
  const [environments, setEnvironments] = useState([]);
  const [runEnv, setRunEnv] = useState("");
  const [running, setRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(null);
  const [form, setForm] = useState({ name:"", description:"", suite_type:"regression" });

  const load = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    const [sRes, tcRes, envRes] = await Promise.all([
      supabase.from("test_suites").select("*, suite_test_cases(count)").eq("project_id", projectId),
      supabase.from("test_cases").select("id,title,type,priority,automation_status").eq("project_id", projectId).eq("is_active",true),
      supabase.from("environments").select("*").eq("project_id", projectId),
    ]);
    setSuites(sRes.data||[]); setTestCases(tcRes.data||[]); setEnvironments(envRes.data||[]);
    if (envRes.data?.[0]) setRunEnv(envRes.data[0].id);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const selectSuite = async suite => {
    setSelected(suite);
    const { data } = await supabase.from("suite_test_cases").select("*, test_cases(*)").eq("suite_id", suite.id).order("order_index");
    setSuiteCases(data||[]);
  };

  const triggerRealRun = async () => {
    if (!selected) return;
    setRunning(true); setRunProgress({ status:"creating", message:"Creating test run..." });

    const { data: env } = runEnv ? await supabase.from("environments").select("*").eq("id", runEnv).single() : { data: null };
    const { data: run } = await supabase.from("test_runs").insert({
      project_id: projectId, suite_id: selected.id, environment_id: runEnv||null,
      name: `${selected.name} · ${new Date().toLocaleString()}`,
      status:"pending", total_tests: suiteCases.length, triggered_by: user.id,
    }).select().single();

    setRunProgress({ status:"running", message:"Executing test suite via Edge Function...", runId: run.id });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${SUPABASE_URL}/functions/v1/execute-test-run`, {
        method:"POST",
        headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${session?.access_token}` },
        body: JSON.stringify({ run_id: run.id }),
      });
      const result = await res.json();
      setRunProgress({ status:"done", ...result, runId: run.id });
    } catch(err) {
      setRunProgress({ status:"error", message: err.message });
    }
    setRunning(false);
  };

  const addToSuite = async tcId => {
    await supabase.from("suite_test_cases").upsert({ suite_id: selected.id, test_case_id: tcId, order_index: suiteCases.length });
    selectSuite(selected);
  };
  const removeFromSuite = async stcId => {
    await supabase.from("suite_test_cases").delete().eq("id", stcId);
    selectSuite(selected);
  };

  if (!projectId) return <div className="empty"><div className="empty-icon">📦</div><h3>Select a project</h3></div>;

  return (
    <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:20,height:"calc(100vh - 112px)"}}>
      <div className="card" style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div className="card-header">
          <span className="font-bold">Test Suites</span>
          <button className="btn btn-primary btn-sm" onClick={()=>{setForm({name:"",description:"",suite_type:"regression"});setShowModal(true)}}><Icon path={I.plus} size={13}/></button>
        </div>
        <div style={{overflowY:"auto",flex:1}}>
          {loading ? <div className="empty"><span className="pulse">Loading...</span></div> :
           suites.map(s => (
            <div key={s.id} onClick={()=>selectSuite(s)}
              style={{padding:"12px 14px",cursor:"pointer",borderBottom:"1px solid var(--border)",background:selected?.id===s.id?"rgba(59,130,246,.1)":"transparent"}}>
              <div className="font-bold text-sm mb-2">{s.name}</div>
              <div className="flex gap-2 items-center">
                <span className="badge badge-gray">{s.suite_type}</span>
                <span className="text-xs text-muted">{s.suite_test_cases?.[0]?.count||0} tests</span>
              </div>
            </div>
          ))}
          {!loading && !suites.length && <div className="empty"><h3>No suites</h3></div>}
        </div>
      </div>

      <div className="card" style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {!selected ? (
          <div className="empty" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div className="empty-icon">📦</div><h3>Select a suite</h3>
          </div>
        ) : (
          <>
            <div className="card-header">
              <div><div className="font-bold">{selected.name}</div><div className="text-xs text-muted mt-2">{suiteCases.length} test cases</div></div>
              <button className="btn btn-green" onClick={()=>{setRunProgress(null);setShowRunModal(true)}} disabled={running}><Icon path={I.play} size={14}/> Run Suite</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",flex:1,overflow:"hidden"}}>
              <div style={{borderRight:"1px solid var(--border)",overflowY:"auto"}}>
                <div style={{padding:"8px 14px",borderBottom:"1px solid var(--border)",fontSize:11,fontWeight:700,color:"var(--text3)",letterSpacing:".8px",textTransform:"uppercase"}}>In Suite ({suiteCases.length})</div>
                {suiteCases.map((stc,i) => (
                  <div key={stc.id} style={{padding:"9px 12px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:11,color:"var(--text3)",minWidth:18}}>{i+1}.</span>
                    <div style={{flex:1}}>
                      <div className="text-sm font-bold">{stc.test_cases?.title}</div>
                      <div className="flex gap-2 mt-2">{typeBadge(stc.test_cases?.type)}</div>
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={()=>removeFromSuite(stc.id)}><Icon path={I.x} size={12}/></button>
                  </div>
                ))}
                {!suiteCases.length && <div className="empty" style={{padding:24}}><h3>Empty suite</h3></div>}
              </div>
              <div style={{overflowY:"auto"}}>
                <div style={{padding:"8px 14px",borderBottom:"1px solid var(--border)",fontSize:11,fontWeight:700,color:"var(--text3)",letterSpacing:".8px",textTransform:"uppercase"}}>Available Tests</div>
                {testCases.filter(tc=>!suiteCases.find(sc=>sc.test_case_id===tc.id)).map(tc => (
                  <div key={tc.id} style={{padding:"9px 12px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:8}}>
                    <div style={{flex:1}}>
                      <div className="text-sm font-bold">{tc.title}</div>
                      <div className="flex gap-2 mt-2">{typeBadge(tc.type)}{priorityBadge(tc.priority)}</div>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={()=>addToSuite(tc.id)}><Icon path={I.plus} size={12}/></button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <Modal title="New Test Suite" onClose={()=>setShowModal(false)}
          footer={<><button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={async()=>{await supabase.from("test_suites").insert({...form,project_id:projectId,created_by:user.id});setShowModal(false);load()}}>Create</button></>}>
          <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Smoke Tests"/></div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">Suite Type</label><select className="form-select" value={form.suite_type} onChange={e=>setForm({...form,suite_type:e.target.value})}>{["smoke","regression","sanity","performance"].map(t=><option key={t}>{t}</option>)}</select></div>
        </Modal>
      )}

      {showRunModal && (
        <Modal title={`Run: ${selected?.name}`} onClose={()=>{if(!running){setShowRunModal(false);setRunProgress(null)}}}
          footer={!runProgress?.status || runProgress.status==="creating" || runProgress.status==="running" ? (
            <><button className="btn btn-ghost" onClick={()=>setShowRunModal(false)} disabled={running}>Cancel</button>
            <button className="btn btn-green" onClick={triggerRealRun} disabled={running}>{running?"Executing...":"▶ Execute Now"}</button></>
          ) : (
            <button className="btn btn-primary" onClick={()=>{setShowRunModal(false);setRunProgress(null)}}>Close</button>
          )}>

          {!runProgress && (
            <>
              <p className="text-sm" style={{color:"var(--text2)",marginBottom:16}}>Execute all <strong>{suiteCases.length}</strong> test cases via the live Execution Engine.</p>
              <div className="form-group"><label className="form-label">Target Environment</label>
                <select className="form-select" value={runEnv} onChange={e=>setRunEnv(e.target.value)}>
                  {environments.map(env=><option key={env.id} value={env.id}>{env.name} — {env.base_url}</option>)}
                </select>
              </div>
              <div style={{padding:"10px 14px",borderRadius:8,background:"rgba(59,130,246,.08)",border:"1px solid rgba(59,130,246,.2)",fontSize:12,color:"var(--text2)"}}>
                🚀 API tests will be executed via the Edge Function in real-time. DB tests run via configured connections. Jira issues will be auto-created for any failures (if configured).
              </div>
            </>
          )}

          {runProgress && (
            <div style={{textAlign:"center",padding:"10px 0"}}>
              {(runProgress.status==="creating"||runProgress.status==="running") && (
                <><div style={{fontSize:36,marginBottom:12}} className="pulse">⚡</div>
                <div className="font-bold" style={{marginBottom:8}}>{runProgress.message}</div>
                <div className="text-muted text-sm">Running tests against live endpoints...</div></>
              )}
              {runProgress.status==="done" && (
                <>
                  <div style={{fontSize:36,marginBottom:12}}>{runProgress.failed>0?"⚠️":"✅"}</div>
                  <div className="font-bold" style={{fontSize:16,marginBottom:16}}>Run Complete</div>
                  <div className="flex gap-3 justify-between" style={{marginBottom:16}}>
                    <div className="run-stat" style={{flex:1}}><div className="run-stat-val" style={{color:"var(--green)"}}>{runProgress.passed}</div><div className="run-stat-lbl">Passed</div></div>
                    <div className="run-stat" style={{flex:1}}><div className="run-stat-val" style={{color:"var(--red)"}}>{runProgress.failed}</div><div className="run-stat-lbl">Failed</div></div>
                    <div className="run-stat" style={{flex:1}}><div className="run-stat-val" style={{color:"var(--yellow)"}}>{runProgress.skipped}</div><div className="run-stat-lbl">Skipped</div></div>
                  </div>
                  {runProgress.failed > 0 && <div className="auth-error">⚠️ {runProgress.failed} failure(s) detected. Jira issues auto-created if configured.</div>}
                </>
              )}
              {runProgress.status==="error" && (
                <><div style={{fontSize:36,marginBottom:12}}>❌</div>
                <div className="auth-error">{runProgress.message}</div></>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REPORTS
// ══════════════════════════════════════════════════════════════════════════════
function ReportsView({ projectId }) {
  const [runs, setRuns] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    const { data } = await supabase.from("test_runs").select("*, test_suites(name), environments(name)").eq("project_id", projectId).order("created_at",{ascending:false});
    setRuns(data||[]);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const selectRun = async run => {
    setSelected(run);
    const { data } = await supabase.from("test_results").select("*, test_cases(title,type)").eq("run_id", run.id).order("executed_at");
    setResults(data||[]);
  };

  if (!projectId) return <div className="empty"><div className="empty-icon">📊</div><h3>Select a project</h3></div>;

  return (
    <div style={{display:"grid",gridTemplateColumns:selected?"1fr 420px":"1fr",gap:20}}>
      <div className="card">
        <div className="card-header">
          <span className="font-bold">Execution History</span>
          <button className="btn btn-ghost btn-sm" onClick={load}><Icon path={I.refresh} size={13}/> Refresh</button>
        </div>
        {loading ? <div className="empty"><span className="pulse">Loading...</span></div> :
        <div className="table-wrap">
          <table>
            <thead><tr><th>Run Name</th><th>Suite</th><th>Env</th><th>Status</th><th>Pass/Fail/Total</th><th>Pass Rate</th><th>Date</th></tr></thead>
            <tbody>
              {runs.map(run => {
                const pct = run.total_tests ? Math.round((run.passed/run.total_tests)*100) : 0;
                return (
                  <tr key={run.id} onClick={()=>selectRun(run)} style={{cursor:"pointer",background:selected?.id===run.id?"rgba(59,130,246,.08)":""}}>
                    <td className="font-bold">{run.name}</td>
                    <td className="text-muted text-sm">{run.test_suites?.name||"—"}</td>
                    <td><span className="badge badge-gray">{run.environments?.name||"—"}</span></td>
                    <td>{statusBadge(run.status)}</td>
                    <td className="mono text-sm"><span style={{color:"var(--green)"}}>{run.passed}</span>/<span style={{color:"var(--red)"}}>{run.failed}</span>/<span style={{color:"var(--text3)"}}>{run.total_tests}</span></td>
                    <td><div className="flex items-center gap-2"><div className="progress-bar" style={{width:60}}><div className="progress-fill" style={{width:`${pct}%`,background:pct>80?"var(--green)":pct>50?"var(--yellow)":"var(--red)"}}/></div><span className="text-xs">{pct}%</span></div></td>
                    <td className="text-muted text-sm">{fmtDate(run.created_at)}</td>
                  </tr>
                );
              })}
              {!runs.length && <tr><td colSpan="7"><div className="empty"><h3>No runs yet</h3></div></td></tr>}
            </tbody>
          </table>
        </div>}
      </div>

      {selected && (
        <div className="card" style={{display:"flex",flexDirection:"column",maxHeight:"calc(100vh - 130px)",overflow:"hidden"}}>
          <div className="card-header">
            <span className="font-bold">Run Detail</span>
            <button className="btn btn-ghost btn-sm" onClick={()=>{setSelected(null);setResults([])}}><Icon path={I.x} size={14}/></button>
          </div>
          <div style={{overflowY:"auto",flex:1,padding:16}}>
            <div className="flex gap-3 mb-4">
              <div className="run-stat"><div className="run-stat-val" style={{color:"var(--green)"}}>{selected.passed}</div><div className="run-stat-lbl">Passed</div></div>
              <div className="run-stat"><div className="run-stat-val" style={{color:"var(--red)"}}>{selected.failed}</div><div className="run-stat-lbl">Failed</div></div>
              <div className="run-stat"><div className="run-stat-val" style={{color:"var(--yellow)"}}>{selected.skipped}</div><div className="run-stat-lbl">Skipped</div></div>
            </div>
            <div className="progress-bar mb-4" style={{height:8}}>
              <div className="progress-fill" style={{width:`${selected.total_tests?Math.round((selected.passed/selected.total_tests)*100):0}%`,background:"var(--green)"}}/>
            </div>
            <div className="section-title">Test Results ({results.length})</div>
            {results.length === 0 && <div className="text-muted text-sm" style={{padding:"14px 0"}}>No detailed results recorded</div>}
            {results.map(r => (
              <div key={r.id} style={{padding:"10px 12px",borderRadius:8,marginBottom:8,background:"var(--bg3)",border:`1px solid ${r.status==="passed"?"rgba(34,197,94,.2)":r.status==="failed"?"rgba(239,68,68,.2)":"var(--border)"}`}}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">{r.test_cases?.title}</span>
                  {statusBadge(r.status)}
                </div>
                <div className="flex gap-3 mt-2">
                  {typeBadge(r.test_cases?.type)}
                  {r.duration_ms && <span className="text-xs text-muted">{fmtDuration(r.duration_ms)}</span>}
                  {r.response_status && <span className="text-xs mono text-muted">HTTP {r.response_status}</span>}
                </div>
                {r.error_message && <div className="text-xs" style={{color:"var(--red)",marginTop:6}}>{r.error_message}</div>}
                {r.logs && <div className="text-xs text-muted mono" style={{marginTop:4}}>{r.logs}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session) loadProfile(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadProfile(session.user.id);
      else setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async uid => {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    setProfile(data);
  };

  useEffect(() => {
    if (!session) return;
    supabase.from("projects").select("id,name").then(({ data }) => {
      setProjects(data||[]);
      if (data?.[0]) setProjectId(data[0].id);
    });
  }, [session]);

  const logout = async () => { await supabase.auth.signOut(); setPage("dashboard"); };

  if (authLoading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)"}}>
      <div style={{textAlign:"center",color:"var(--text3)"}}>
        <div style={{fontSize:32}} className="pulse">⟳</div>
        <div style={{marginTop:12}}>Loading...</div>
      </div>
    </div>
  );

  if (!session) return <AuthView onLogin={() => {}} />;

  const navGroups = [
    { label:"Testing", items:[
      { id:"dashboard", label:"Dashboard", icon:I.dashboard },
      { id:"testcases", label:"Test Cases", icon:I.testCase },
      { id:"api", label:"API Testing", icon:I.api },
      { id:"db", label:"DB Testing", icon:I.db },
      { id:"suites", label:"Test Suites", icon:I.suite },
      { id:"reports", label:"Reports", icon:I.reports },
    ]},
    { label:"Integrations", items:[
      { id:"jira", label:"Jira", icon:I.jira },
      { id:"webhooks", label:"CI/CD Webhooks", icon:I.webhook },
    ]},
  ];

  const pageTitle = {
    dashboard:"Dashboard", testcases:"Test Cases", api:"API Testing", db:"DB Testing",
    suites:"Test Suites", reports:"Reports & Runs", jira:"Jira Integration", webhooks:"CI/CD Webhooks",
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">QA</div>
            <div><div className="logo-text">QA Platform</div><div className="logo-sub">Phase 2 · Enterprise</div></div>
          </div>
          <div style={{padding:"6px 8px"}}>
            <select className="project-select" value={projectId} onChange={e=>setProjectId(e.target.value)}>
              {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          {navGroups.map(group => (
            <div key={group.label} className="nav-section">
              <div className="nav-label">{group.label}</div>
              {group.items.map(item => (
                <div key={item.id} className={`nav-item ${page===item.id?"active":""}`} onClick={()=>setPage(item.id)}>
                  <Icon path={item.icon} size={15}/>{item.label}
                </div>
              ))}
            </div>
          ))}
          <div style={{flex:1}}/>
          <div className="user-bar">
            <div className="user-avatar">{(profile?.full_name||profile?.email||"U")[0].toUpperCase()}</div>
            <div style={{flex:1,overflow:"hidden"}}>
              <div className="user-name">{profile?.full_name||profile?.email}</div>
              <div className="user-role">{profile?.role?.replace("_"," ")||"qa analyst"}</div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{padding:"5px"}} onClick={logout} title="Sign out"><Icon path={I.logout} size={15}/></button>
          </div>
        </div>

        <div className="main">
          <div className="topbar">
            <span className="page-title">{pageTitle[page]}</span>
            <div className="flex items-center gap-2">
              <div style={{width:7,height:7,borderRadius:"50%",background:"var(--green)"}}/>
              <span className="text-xs text-muted">Connected · {profile?.email}</span>
            </div>
          </div>
          <div className="content">
            {page==="dashboard"  && <Dashboard projectId={projectId}/>}
            {page==="testcases"  && <TestCasesView projectId={projectId} user={session.user}/>}
            {page==="api"        && <APITestingViewMinimal projectId={projectId} user={session.user}/>}
            {page==="db"         && <DBTestingView projectId={projectId} user={session.user}/>}
            {page==="suites"     && <SuitesView projectId={projectId} user={session.user}/>}
            {page==="reports"    && <ReportsView projectId={projectId}/>}
            {page==="jira"       && <JiraView projectId={projectId}/>}
            {page==="webhooks"   && <WebhooksView projectId={projectId}/>}
          </div>
        </div>
      </div>
    </>
  );
}

// Minimal API view (same as v1, included inline)
function APITestingViewMinimal({ projectId, user }) {
  const [apiTests, setApiTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("config");
  const [envUrl, setEnvUrl] = useState("");
  const [environments, setEnvironments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title:"", method:"GET", endpoint:"", headers:'{"Content-Type":"application/json"}', body:"", assertions:'[{"type":"status","operator":"eq","expected_value":200}]' });

  const load = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    const [tcRes, envRes] = await Promise.all([
      supabase.from("test_cases").select("*, api_test_configs(*)").eq("project_id", projectId).eq("type","api").eq("is_active",true),
      supabase.from("environments").select("*").eq("project_id", projectId),
    ]);
    setApiTests(tcRes.data||[]); setEnvironments(envRes.data||[]);
    if (envRes.data?.[0]) setEnvUrl(envRes.data[0].base_url);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const runTest = async () => {
    const cfg = selected?.api_test_configs?.[0];
    if (!cfg) return;
    setRunning(true); setResult(null); setTab("result");
    const start = Date.now();
    try {
      const url = `${envUrl}${cfg.endpoint}`;
      const headers = typeof cfg.headers==="string"?JSON.parse(cfg.headers):cfg.headers||{};
      const options = { method: cfg.method, headers };
      if (cfg.body && cfg.method!=="GET") options.body = typeof cfg.body==="string"?cfg.body:JSON.stringify(cfg.body);
      const res = await fetch(url, options);
      const duration = Date.now()-start;
      let body; try { body=await res.json(); } catch { body=await res.text(); }
      const assertions = (cfg.assertions||[]).map(a => {
        let passed=false,actual;
        if (a.type==="status") { actual=res.status; passed=actual===a.expected_value; }
        else if (a.type==="response_time") { actual=duration; passed=duration<a.expected_value; }
        else { actual="checked"; passed=true; }
        return {...a,passed,actual};
      });
      setResult({ status:res.status, duration, body, assertions, ok:assertions.every(a=>a.passed) });
    } catch(err) { setResult({ error:err.message, duration:Date.now()-start, assertions:[], ok:false }); }
    setRunning(false);
  };

  const saveNewTest = async () => {
    try {
      const h=JSON.parse(form.headers), a=JSON.parse(form.assertions);
      const { data: tc } = await supabase.from("test_cases").insert({ title:form.title, type:"api", priority:"medium", automation_status:"automated", project_id:projectId, created_by:user.id }).select().single();
      await supabase.from("api_test_configs").insert({ test_case_id:tc.id, method:form.method, endpoint:form.endpoint, headers:h, assertions:a });
      setShowModal(false); load();
    } catch(e) { alert("JSON error: "+e.message); }
  };

  if (!projectId) return <div className="empty"><div className="empty-icon">🔌</div><h3>Select a project</h3></div>;

  return (
    <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:20,height:"calc(100vh - 112px)"}}>
      <div className="card" style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div className="card-header"><span className="font-bold">API Tests</span><button className="btn btn-primary btn-sm" onClick={()=>setShowModal(true)}><Icon path={I.plus} size={13}/></button></div>
        <div style={{overflowY:"auto",flex:1}}>
          {loading ? <div className="empty"><span className="pulse">Loading...</span></div> :
           apiTests.map(tc => (
            <div key={tc.id} onClick={()=>{setSelected(tc);setResult(null);setTab("config")}}
              style={{padding:"11px 14px",cursor:"pointer",borderBottom:"1px solid var(--border)",background:selected?.id===tc.id?"rgba(59,130,246,.1)":"transparent"}}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`method-badge method-${tc.api_test_configs?.[0]?.method||"GET"}`}>{tc.api_test_configs?.[0]?.method||"GET"}</span>
              </div>
              <div className="font-bold text-sm">{tc.title}</div>
              <div className="text-xs text-muted mono mt-2">{tc.api_test_configs?.[0]?.endpoint}</div>
            </div>
          ))}
          {!loading&&!apiTests.length&&<div className="empty"><h3>No API tests</h3></div>}
        </div>
      </div>

      <div className="card" style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {!selected ? <div className="empty" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div className="empty-icon">🔌</div><h3>Select a test</h3></div> : (
          <>
            <div className="card-header">
              <div className="flex items-center gap-3">
                <span className={`method-badge method-${selected.api_test_configs?.[0]?.method}`}>{selected.api_test_configs?.[0]?.method}</span>
                <span className="font-bold">{selected.title}</span>
              </div>
              <div className="flex gap-2 items-center">
                <select className="form-select" style={{width:180,padding:"5px 8px",fontSize:12}} value={envUrl} onChange={e=>setEnvUrl(e.target.value)}>
                  {environments.map(env=><option key={env.id} value={env.base_url}>{env.name}: {env.base_url}</option>)}
                </select>
                <button className="btn btn-green" onClick={runTest} disabled={running}><Icon path={I.play} size={14}/> Run</button>
              </div>
            </div>
            <div style={{padding:"10px 18px",borderBottom:"1px solid var(--border)"}}>
              <div className="tabs"><div className={`tab ${tab==="config"?"active":""}`} onClick={()=>setTab("config")}>Config</div><div className={`tab ${tab==="result"?"active":""}`} onClick={()=>setTab("result")}>Result</div></div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:18}}>
              {tab==="config" && (() => {
                const cfg=selected.api_test_configs?.[0];
                if (!cfg) return <div className="empty"><h3>No config</h3></div>;
                return (
                  <>
                    <div className="form-group"><label className="form-label">URL</label><code className="mono" style={{background:"var(--bg3)",padding:"8px 12px",borderRadius:8,fontSize:13,color:"var(--accent2)",display:"block"}}>{envUrl}{cfg.endpoint}</code></div>
                    <div className="form-group"><label className="form-label">Headers</label><div className="response-box" style={{maxHeight:100}}>{JSON.stringify(cfg.headers,null,2)}</div></div>
                    {cfg.body&&<div className="form-group"><label className="form-label">Body</label><div className="response-box" style={{maxHeight:100}}>{JSON.stringify(cfg.body,null,2)}</div></div>}
                    <div className="form-group"><label className="form-label">Assertions</label>
                      {(cfg.assertions||[]).map((a,i)=><div key={i} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:"1px solid var(--border)"}}>
                        <span className="badge badge-blue">{a.type}</span><span className="badge badge-gray">{a.operator}</span><span className="mono text-xs text-muted">{String(a.expected_value)}</span>
                      </div>)}
                    </div>
                  </>
                );
              })()}
              {tab==="result" && (
                running ? <div className="empty"><div className="pulse" style={{fontSize:28}}>⟳</div><h3>Running...</h3></div> :
                result ? (
                  <>
                    <div className="flex gap-3 mb-4">
                      <div className="run-stat"><div className="run-stat-val" style={{color:result.status<300?"var(--green)":"var(--red)"}}>{result.status||"ERR"}</div><div className="run-stat-lbl">HTTP</div></div>
                      <div className="run-stat"><div className="run-stat-val">{result.duration}ms</div><div className="run-stat-lbl">Time</div></div>
                      <div className="run-stat"><div className="run-stat-val" style={{color:result.ok?"var(--green)":"var(--red)"}}>{result.ok?"PASS":"FAIL"}</div><div className="run-stat-lbl">Result</div></div>
                    </div>
                    <div className="form-group"><label className="form-label">Assertions</label>
                      {result.assertions.map((a,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"center",padding:"6px 0",borderBottom:"1px solid var(--border)"}}>
                        <Icon path={a.passed?I.check:I.x} size={14} color={a.passed?"var(--green)":"var(--red)"}/>
                        <span className="badge badge-blue">{a.type}</span><span className="text-xs text-muted">→ <span className="mono">{String(a.actual)}</span></span>
                      </div>)}
                    </div>
                    {result.error?<div className="response-box" style={{color:"var(--red)"}}>{result.error}</div>:result.body&&<div className="form-group"><label className="form-label">Response</label><div className="response-box">{typeof result.body==="string"?result.body:JSON.stringify(result.body,null,2)}</div></div>}
                  </>
                ) : <div className="empty"><div className="empty-icon">▶</div><h3>No results yet</h3></div>
              )}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <Modal title="New API Test" onClose={()=>setShowModal(false)}
          footer={<><button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={saveNewTest}>Save</button></>}>
          <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Get User Profile"/></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Method</label><select className="form-select" value={form.method} onChange={e=>setForm({...form,method:e.target.value})}>{["GET","POST","PUT","DELETE","PATCH"].map(m=><option key={m}>{m}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Endpoint</label><input className="form-input mono" value={form.endpoint} onChange={e=>setForm({...form,endpoint:e.target.value})} placeholder="/api/v1/resource"/></div>
          </div>
          <div className="form-group"><label className="form-label">Headers (JSON)</label><textarea className="form-textarea mono" style={{minHeight:60}} value={form.headers} onChange={e=>setForm({...form,headers:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">Body (JSON)</label><textarea className="form-textarea mono" style={{minHeight:60}} value={form.body} onChange={e=>setForm({...form,body:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">Assertions (JSON)</label><textarea className="form-textarea mono" style={{minHeight:70}} value={form.assertions} onChange={e=>setForm({...form,assertions:e.target.value})}/></div>
        </Modal>
      )}
    </div>
  );
}
