import re

css_append = """
/* NOVAS CLASSES ESTRUTURAIS (FIX LAYOUT/GRIDS) */
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-row { display: flex; flex-direction: row; align-items: center; }
.gap-10 { gap: 10px; }
.gap-20 { gap: 20px; }
.mt-10 { margin-top: 10px; }
.mt-15 { margin-top: 15px; }
.mt-20 { margin-top: 20px; }
.mt-40 { margin-top: 40px; }
.text-center { text-align: center; }
.font-bold { font-weight: bold; }
.badge-success { background:#00bb55; color:#000; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:bold; font-family:var(--fm); margin-left:10px }
.badge-warning { background:#f0a000; color:#000; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:bold; font-family:var(--fm); margin-left:10px }
.mx-auto { margin-left: auto; margin-right: auto; }

/* FIX DOS GRIDS */
.lp-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }
.lp-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.lp-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
@media(max-width:1024px) {
  .lp-grid-4 { grid-template-columns: repeat(2, 1fr); }
}
@media(max-width:768px) {
  .lp-grid-2, .lp-grid-3, .lp-grid-4 { grid-template-columns: 1fr; }
  .lp-steps.flex-layout { flex-direction: column; }
  .demo-cards { grid-template-columns: 1fr; }
  .ad-cards { grid-template-columns: 1fr; }
}

/* UTILITÁRIOS VISUAIS */
.bg-red-dim { background: rgba(232,0,45,0.1); border: 1px solid rgba(232,0,45,0.2); width: 60px; height: 60px; display:flex; align-items:center; justify-content:center; border-radius:50%; margin-right:20px; flex-shrink:0 }
.lp-pain-txt { font-size: 18px; color: #8888a0; line-height: 1.5; }
.lp-pain-txt b { color: #f0f0f5; }

.sol-card { padding: 40px; }
.sol-icon { width: 50px; height: 50px; border-radius:8px; background:rgba(0,187,85,0.1); color:#00bb55; display:flex; align-items:center; justify-content:center; font-size:24px; margin-bottom:20px }

.tags-cloud .nice-pill { background: rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:10px 20px; border-radius:30px; font-family:var(--fb); font-size:16px; color:#c0c0c0 }
.tags-cloud .hl-acc.glow-border { border-color:#e8002d; color:#e8002d; box-shadow:0 0 15px rgba(232,0,45,0.2); font-weight:bold }

/* DEMOS E MOCKUPS (FIX CARD HEIGHTS) */
.demo-cards .lp-card { padding: 50px 30px 40px; }
.mock-pnl-header { display:flex; align-items:center; margin-bottom: 20px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:20px }
.mock-avatar { width: 50px; height: 50px; border-radius:50%; background:#e8002d; flex-shrink:0 }
.mock-stat-box { flex:1; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:6px; padding:10px; text-align:center; }
.mock-stat-box b { font-size:18px; color:#f0a000; font-family:var(--fd) }
.mock-stat-box span { font-size:11px; color:var(--dim); text-transform:uppercase; font-family:var(--fm) }
.mock-list-item { background:rgba(255,255,255,0.02); padding:12px; margin-bottom:10px; border-radius:4px; font-family:var(--fb); font-size:14px; display:flex; justify-content:space-between; align-items:center; border:1px solid rgba(255,255,255,0.03) }

.bg-soft-red { background: rgba(232,0,45,0.03) !important; border-color: rgba(232,0,45,0.2) !important; }
.bg-soft-green { background: rgba(0,187,85,0.03) !important; border-color: rgba(0,187,85,0.3) !important; }
.color-red { color: #ff4a4a !important; }
.color-green { color: #00bb55 !important; }

.compare-table .ad-col { padding: 50px; border-radius: 12px; }

/* FIX SCALES E ANIMACOES */
.whatsapp-float:hover { transform: scale(1.1); box-shadow:0 8px 30px rgba(37,211,102,0.6) !important; }
"""

with open('public/css/plans.css', 'r', encoding='utf-8') as f:
    text = f.read()

# Only add if not already there
if "/* NOVAS CLASSES ESTRUTURAIS (FIX LAYOUT/GRIDS) */" not in text:
    with open('public/css/plans.css', 'a', encoding='utf-8') as f:
        f.write(css_append)
        print("CSS classes added successfully.")
else:
    print("CSS classes already exist.")
