// Static clone (UTF-8): Chinese UI, CICC theme, positions-as-percent view

// -------- Constants --------
const START_CAP_RMB = 100000; // per-agent initial capital in RMB
// FX conversion used in value calculations; keep simple for demo
const HKD_TO_RMB = 0.93; // approximate; simulation only

// -------- Stocks (HK: Semiconductor / New Consumer / Robotics) --------
// Each item: sym (code), short (short name), name (full), sector, price, change
const STOCKS = [
  // 半导体芯片
  { sym: '0981.HK', short: '中芯国际',   name: '中芯国际',           sector: '半导体芯片', price: 18.20, change: 0.0 },
  { sym: '1347.HK', short: '华虹半导体', name: '华虹半导体',         sector: '半导体芯片', price: 22.80, change: 0.0 },
  { sym: '0522.HK', short: 'ASMPT',     name: 'ASMPT',             sector: '半导体芯片', price: 71.50, change: 0.0 },
  { sym: '2382.HK', short: '舜宇光学',   name: '舜宇光学科技',       sector: '半导体芯片', price: 60.10, change: 0.0 },
  { sym: '1385.HK', short: '复旦微电',   name: '复旦微电子集团',     sector: '半导体芯片', price: 13.40, change: 0.0 },
  { sym: '2878.HK', short: '晶门科技',   name: '晶门科技',           sector: '半导体芯片', price: 0.78,  change: 0.0 },

  // 新消费
  { sym: '3690.HK', short: '美团',       name: '美团',               sector: '新消费',     price: 110.20, change: 0.0 },
  { sym: '9988.HK', short: '阿里巴巴',   name: '阿里巴巴',           sector: '新消费',     price: 78.60,  change: 0.0 },
  { sym: '9618.HK', short: '京东',       name: '京东集团',           sector: '新消费',     price: 115.30, change: 0.0 },
  { sym: '1810.HK', short: '小米',       name: '小米集团',           sector: '新消费',     price: 18.50,  change: 0.0 },
  { sym: '2020.HK', short: '安踏体育',   name: '安踏体育',           sector: '新消费',     price: 85.20,  change: 0.0 },
  { sym: '6862.HK', short: '海底捞',     name: '海底捞',             sector: '新消费',     price: 20.60,  change: 0.0 },

  // 机器人
  { sym: '9880.HK', short: '优必选',     name: '优必选科技',         sector: '机器人',     price: 28.30,  change: 0.0 },
  { sym: '2400.HK', short: '擎朗智能',   name: '擎朗智能',           sector: '机器人',     price: 22.10,  change: 0.0 },
  { sym: '2252.HK', short: '微创机器人', name: '微创机器人',         sector: '机器人',     price: 28.90,  change: 0.0 },
  { sym: '0669.HK', short: '创科实业',   name: '创科实业',           sector: '机器人',     price: 102.40, change: 0.0 },
  { sym: '1882.HK', short: '海天国际',   name: '海天国际',           sector: '机器人',     price: 18.10,  change: 0.0 },
  { sym: '0285.HK', short: '比亚迪电子', name: '比亚迪电子',         sector: '机器人',     price: 27.50,  change: 0.0 },
];

// -------- Agent models (10 fixed, consistent) --------
const AVATARS = {
  GPT: 'https://avatar-cdn.rockflow.tech/avatar-default/GPT.png',
  Claude: 'https://avatar-cdn.rockflow.tech/avatar-default/Claude.png',
  Gemini: 'https://avatar-cdn.rockflow.tech/avatar-default/Gemini.png',
  Grok: 'https://avatar-cdn.rockflow.tech/avatar-default/Grok.png',
  DeepSeek: 'https://avatar-cdn.rockflow.tech/avatar-default/DeepSeek.png',
  KIMI: 'https://avatar-cdn.rockflow.tech/avatar-default/KIMI.png',
  Qwen: 'https://avatar-cdn.rockflow.tech/avatar-default/Qwen.png',
  Doubao: 'https://avatar-cdn.rockflow.tech/avatar-default/doubao.png',
  Wenxin: 'https://avatar-cdn.rockflow.tech/avatar-default/wenxin.png',
  MiniMax: 'https://avatar-cdn.rockflow.tech/avatar-default/minimax.png',
};

const AGENTS = [
  { id: 'gpt',     name: 'GPT',         model: 'GPT-4o',         avatar: AVATARS.GPT,     desc: '\u52a8\u91cf\u00b7\u671f\u6743\u8986\u76d6', pnl: 3120 },
  { id: 'claude',  name: 'Claude',      model: 'Claude 3.5',     avatar: AVATARS.Claude,  desc: '\u65b0\u95fb\u9a71\u52a8\u00b7\u5747\u503c\u56de\u5f52', pnl: 2890 },
  { id: 'gemini',  name: 'Gemini',      model: 'Gemini 1.5 Pro', avatar: AVATARS.Gemini,  desc: '\u6ce2\u52a8\u7a81\u7834\u8ffd\u8e2a', pnl: 2105 },
  { id: 'grok',    name: 'Grok',        model: 'Grok-2',         avatar: AVATARS.Grok,    desc: '\u5ef6\u8fdf\u5956\u60e9', pnl: 1675 },
  { id: 'deepseek',name: 'DeepSeek',    model: 'DeepSeek',       avatar: AVATARS.DeepSeek,desc: '\u591a\u56e0\u5b50\u00b7\u98ce\u9669\u5e73\u4ef7', pnl: 1450 },
  { id: 'kimi',    name: 'Kimi',        model: 'Kimi',           avatar: AVATARS.KIMI,    desc: '\u4e3b\u9898\u8f6e\u52a8', pnl: 975 },
  { id: 'qwen',    name: '\u901a\u4e49\u5343\u95ee', model: 'Qwen',           avatar: AVATARS.Qwen,   desc: '\u5fae\u89c2\u7ed3\u6784', pnl: 765 },
  { id: 'doubao',  name: '\u8c46\u5305',       model: 'Doubao',         avatar: AVATARS.Doubao, desc: '\u4e8b\u4ef6\u9a71\u52a8', pnl: 650 },
  { id: 'wenxin',  name: '\u6587\u5fc3\u4e00\u8a00', model: 'Wenxin',         avatar: AVATARS.Wenxin, desc: '\u914d\u5bf9\u4ea4\u6613', pnl: 520 },
  { id: 'minimax', name: 'MiniMax',     model: 'MiniMax',        avatar: AVATARS.MiniMax, desc: '\u8d8b\u52bf\u8ddf\u8e2a', pnl: 410 },
];

// -------- Utils --------
const el = (sel) => document.querySelector(sel);
const nowTime = () => new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});
const fmt$ = (n) => (n < 0 ? `-$${Math.abs(n).toLocaleString()}` : `$${n.toLocaleString()}`);
const TOTAL_CAP = () => AGENTS.length * START_CAP_RMB;

// -------- Live HK quotes via local bridge (preferred) or Sina script (fallback) --------
const BRIDGE_ORIGIN = 'http://localhost:3344';
const hkFive = (sym) => (sym.split('.')[0].replace(/\D/g,'')).padStart(5,'0');

async function updateFromBridge(){
  try{
    const codes = STOCKS.map(s=> s.sym).join(',');
    const url = `${BRIDGE_ORIGIN}/api/hk-quotes?codes=${encodeURIComponent(codes)}`;
    const r = await fetch(url, { cache:'no-cache' });
    if(!r.ok) throw new Error('bridge http '+r.status);
    const j = await r.json(); if(!j.ok) throw new Error('bridge payload');
    let updated = 0;
    j.data.forEach(q=>{
      const item = STOCKS.find(x=> hkFive(x.sym)===hkFive(q.sym));
      if(!item) return;
      item.price = Number(q.price) || item.price;
      item.change = Number(q.changePct) || item.change;
      if(q.name && (!item.name || item.name.length<2)) item.name = q.name;
      updated++;
    });
    if(updated>0){ LIVE_QUOTES = true; renderTicker(); drawChart(); renderPositions(); }
    return updated;
  }catch(e){ return 0; }
}

function startBridgeQuotes(){
  updateFromBridge();
  setInterval(updateFromBridge, 15000);
}
let LIVE_QUOTES = false;
function parseSinaHK(raw){
  if(!raw) return null;
  const arr = String(raw).split(',');
  const name = arr[0] || '';
  const prev = parseFloat(arr[2]) || parseFloat(arr[1]) || NaN;
  const cur  = parseFloat(arr[3]) || parseFloat(arr[6]) || parseFloat(arr[1]) || NaN;
  if(!isFinite(prev) || !isFinite(cur)) return null;
  const pct = prev ? ((cur - prev) / prev * 100) : 0;
  return { name, cur, prev, pct };
}
function updateFromSinaOnce(codes){
  return new Promise((resolve)=>{
    const list = codes.map(c=>`hk${c}`).join(',');
    const s = document.createElement('script');
    s.src = `https://hq.sinajs.cn/list=${list}&_=${Date.now()}`;
    s.charset = 'gb2312';
    s.onload = () => {
      let updated = 0;
      codes.forEach(code=>{
        const key = `hq_str_hk${code}`;
        const raw = window[key];
        const parsed = parseSinaHK(raw);
        if(parsed){
          const item = STOCKS.find(x=> hkFive(x.sym)===code);
          if(item){
            if(!item.name && parsed.name) item.name = parsed.name;
            item.prevClose = parsed.prev;
            item.price = parsed.cur;
            item.change = parsed.pct;
            updated++;
          }
        }
      });
      if(updated>0){ LIVE_QUOTES = true; renderTicker(); drawChart(); renderPositions(); }
      resolve(updated);
    };
    s.onerror = () => resolve(0);
    document.head.appendChild(s);
  });
}
function startLiveQuotes(){
  const codes = STOCKS.map(s=> hkFive(s.sym));
  updateFromSinaOnce(codes);
  setInterval(()=> updateFromSinaOnce(codes), 15000);
}

// -------- UI: Ticker (show name + code + price + change) --------
function renderTicker(){
  const root = el('#ticker-rows'); if(!root) return; root.innerHTML = '';
  STOCKS.forEach(s => {
    const codeRaw = s.sym.replace('.HK','').replace(/\D/g,'');
    const hkCode = codeRaw.padStart(5, '0');
    const url = `https://stock.finance.sina.com.cn/hkstock/quotes/${hkCode}.html`;
    const card = document.createElement('a');
    card.className = 'ticker-card';
    card.href = url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.innerHTML = `
      <div class="ticker-sym">${s.name}</div>
      <div class="ticker-name">${s.sym}</div>
      <div class="ticker-price">HK$${s.price.toFixed(2)}</div>
      <div class="ticker-change ${s.change >= 0 ? 'pos' : 'neg'}">${s.change >= 0 ? '+' : ''}${s.change.toFixed(2)}%</div>
    `;
    card.dataset.sym = s.sym;
    root.appendChild(card);
  });
  root.onclick = (e) => {
    const card = e.target.closest('.ticker-card'); if(!card) return;
    setSelectedSymbol(card.dataset.sym); drawChart();
  };
}

// -------- UI: Chips (use short names) --------
let SELECTED_SYM = STOCKS[0].sym;
let SELECTED_AGENT = null;

function renderAgentChips(){
  const root = el('#agent-chips'); if(!root) return; root.innerHTML='';
  AGENTS.forEach(a=>{
    const b = document.createElement('button'); b.className = 'chip'; b.setAttribute('data-agent-chip', a.id);
    b.innerHTML = `<img src="${a.avatar}" alt="" style="width:16px;height:16px;border-radius:50%;vertical-align:-3px;margin-right:6px">${a.name}`;
    root.appendChild(b);
  });
  root.addEventListener('click', (e)=>{
    const chip = e.target.closest('[data-agent-chip]'); if(!chip) return;
    SELECTED_AGENT = chip.getAttribute('data-agent-chip');
    document.querySelectorAll('[data-agent-chip]').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active'); drawChart();
  });
}

function renderStockChips(){
  const root = el('#stock-chips'); if(!root) return; root.innerHTML='';
  STOCKS.forEach(s=>{
    const b = document.createElement('button');
    b.className = 'chip' + (s.sym===SELECTED_SYM?' active':'');
    b.setAttribute('data-sym', s.sym);
    b.textContent = s.short;
    root.appendChild(b);
  });
  root.addEventListener('click', (e)=>{
    const chip = e.target.closest('[data-sym]'); if(!chip) return;
    const sym = chip.getAttribute('data-sym'); setSelectedSymbol(sym);
    document.querySelectorAll('[data-sym]').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active'); drawChart();
  });
}

// -------- Feed / Leaderboard --------
const FEED = [];
function pushFeed(text){ FEED.unshift({ t: nowTime(), text }); if(FEED.length > 50) FEED.pop(); renderFeed(); }
function renderFeed(){
  const root = el('#live-feed'); if(!root) return; root.innerHTML = '';
  FEED.forEach(item => { const li = document.createElement('li'); li.className = 'feed-item';
    li.innerHTML = `<div class="feed-time">${item.t}</div><div class="feed-text">${item.text}</div>`; root.appendChild(li); });
}
function renderLeaderboard(){
  const root = el('#leaderboard-list'); if(!root) return; root.innerHTML = '';
  const sorted = [...AGENTS].sort((a,b) => b.pnl - a.pnl).slice(0, 10);
  sorted.forEach((a, idx) => {
    const row = document.createElement('li'); row.className = 'lb-row';
    const sign = a.pnl >= 0 ? 'pos' : 'neg';
    row.innerHTML = `<div class="lb-left"><span class="badge">#${idx+1}</span><span class="lb-name">${a.name}</span></div><div class="lb-pnl ${sign}">${fmt$(a.pnl)}</div>`;
    root.appendChild(row);
  });
}

// -------- Data series for trades/positions --------
const SERIES5 = new Map(); // sym -> [{t,o,h,l,c}]
let tickCounter = 0;
function ensureBars5(sym){
  if(!SERIES5.has(sym)){
    const s = STOCKS.find(x=>x.sym===sym) || {price:100}; const bars = []; let last = s.price; const start = Date.now() - 80*5*60*1000;
    for(let i=0;i<80;i++){ const t = new Date(start + i*5*60*1000); const o = last * (1 + (Math.random()-0.5)*0.002); let h = o * (1 + Math.random()*0.003); let l = o * (1 - Math.random()*0.003); const c = o * (1 + (Math.random()-0.5)*0.003); if(l>h){ const tmp=h; h=l; l=tmp; } bars.push({t,o,h,l,c}); last = c; }
    SERIES5.set(sym, bars);
  }
  return SERIES5.get(sym);
}

// trades and positions
const TRADES = new Map(); // key agent|sym -> [{t,side,price,qty}]
const POS = new Map();    // key agent|sym -> { qty, avg }
const keyAS = (a,sym)=> `${a}|${sym}`;
function getTrades(agent,sym){ const k=keyAS(agent,sym); if(!TRADES.has(k)) TRADES.set(k, []); return TRADES.get(k); }
function getPos(agent,sym){ const k=keyAS(agent,sym); if(!POS.has(k)) POS.set(k,{qty:0,avg:0}); return POS.get(k); }
function setPos(agent,sym,obj){ POS.set(keyAS(agent,sym), obj); }
function recordTrade(agent,sym,side,price,qty){ const bars=ensureBars5(sym); const bar=bars[bars.length-1]; getTrades(agent,sym).push({ t:bar.t, side, price, qty }); updatePositionOnTrade(agent,sym,side,price,qty); }
function updatePositionOnTrade(agent,sym,side,price,qty){ const p={...getPos(agent,sym)}; if(side==='buy'){ if(p.qty>=0){ const newQty=p.qty+qty; p.avg = newQty? (p.avg*p.qty + price*qty)/newQty : 0; p.qty=newQty; } else { const r=p.qty+qty; if(Math.sign(r)===-1){ p.qty=r; } else { p.qty=r; p.avg = p.qty>0 ? price : 0; } } } else { if(p.qty<=0){ const newQty=p.qty-qty; p.avg = newQty? (p.avg*Math.abs(p.qty) + price*qty)/Math.abs(newQty) : 0; p.qty=newQty; } else { const r=p.qty-qty; if(Math.sign(r)===1){ p.qty=r; } else { p.qty=r; p.avg = p.qty<0 ? price : 0; } } } setPos(agent,sym,p); }

// helpers
function priceOf(sym){ const s=STOCKS.find(x=>x.sym===sym); return s? s.price: 0; }
function valueOf(agent,sym){ const p=getPos(agent,sym); return p? (p.qty*priceOf(sym)*HKD_TO_RMB) : 0; }

// -------- Chart (positions/net/agents) --------
let CHART = { view: 'positions' }; // positions | net | agents

function drawChart(){
  const canvas = document.getElementById('price-chart'); if(!canvas) return;
  const ctx = canvas.getContext('2d'); const parentWidth = canvas.parentElement.clientWidth; if(canvas.width !== parentWidth){ canvas.width = parentWidth; }
  const w=canvas.width, h=canvas.height; ctx.clearRect(0,0,w,h);

  if(CHART.view === 'positions'){
    // Heatmap by percent of START_CAP_RMB per agent
    const padL=90, padR=12, padT=24, padB=28; const vw=w-padL-padR, vh=h-padT-padB;
    const agents = AGENTS.slice(0,10); const cols = STOCKS;
    const cellW = vw / cols.length; const cellH = vh / agents.length;
    const isLight = document.body.classList.contains('theme-light');
    const labelColor = isLight ? '#2b2138' : '#ddd'; const gridColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';
    ctx.fillStyle=labelColor; ctx.font='12px system-ui,sans-serif'; ctx.textAlign='right';
    agents.forEach((a,i)=>{ const y=padT + i*cellH + cellH/2 + 4; ctx.fillText(a.name, padL-10, y); });
    ctx.textAlign='center'; cols.forEach((s,j)=>{ const x=padL + j*cellW + cellW/2; ctx.fillText(s.short, x, padT-6); });
    ctx.strokeStyle=gridColor; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(padL-4, padT); ctx.lineTo(w-padR, padT); ctx.stroke(); for(let i=1;i<agents.length;i++){ const y=padT + i*cellH; ctx.beginPath(); ctx.moveTo(padL-4, y); ctx.lineTo(w-padR, y); ctx.stroke(); }

    agents.forEach((a,i)=>{
      cols.forEach((s,j)=>{
        const val = Math.abs(valueOf(a.id, s.sym)); // RMB
        const pct = Math.min(1, val / START_CAP_RMB);
        const neutral = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)';
        const color = getPos(a.id, s.sym).qty>0 ? `rgba(199,58,58,${0.15+0.7*pct})` : (getPos(a.id, s.sym).qty<0 ? `rgba(20,179,106,${0.15+0.7*pct})` : neutral);
        const x=padL + j*cellW + 2, y=padT + i*cellH + 2, wBox=cellW-4, hBox=cellH-4; ctx.fillStyle=color; ctx.fillRect(x,y,wBox,hBox);
        if(val>0 && cellW>60 && cellH>18){ ctx.fillStyle=labelColor; ctx.font='12px system-ui,sans-serif'; ctx.textAlign='center'; ctx.fillText(Math.round(pct*100)+'%', x+wBox/2, y+hBox/2+4); }
      });
    });
    const lg = document.getElementById('chart-legend'); if(lg){ lg.style.display='flex'; lg.innerHTML = '<div class="legend-item"><span class="legend-swatch" style="background:#C73A3A"></span>多头(占比)</div><div class="legend-item"><span class="legend-swatch" style="background:#14b36a"></span>空头(占比)</div>'; }
  } else if (CHART.view === 'net'){
    // Net exposure as percent of TOTAL_CAP
    const padL=70, padR=70, padT=24, padB=28; const vw=w-padL-padR, vh=h-padT-padB;
    const items = STOCKS.map(s=>{ const net = AGENTS.reduce((acc,a)=> acc + valueOf(a.id, s.sym), 0); return {sym:s.sym, short:s.short, net}; });
    const maxPct = Math.max(0.01, ...items.map(i=> Math.abs(i.net) / TOTAL_CAP()));
    const barH = vh / items.length * 0.6; const gap = vh / items.length * 0.4;
    const isLight = document.body.classList.contains('theme-light'); const labelColor = isLight ? '#2b2138' : '#ddd'; const zeroColor = isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)';
    ctx.font='12px system-ui,sans-serif'; ctx.textAlign='right'; ctx.fillStyle=labelColor;
    const xMid = padL + vw/2; ctx.strokeStyle=zeroColor; ctx.beginPath(); ctx.moveTo(xMid, padT); ctx.lineTo(xMid, h-padB); ctx.stroke();
    items.forEach((it, idx)=>{ const y = padT + idx*(barH+gap); ctx.fillText(it.short, padL-8, y+barH*0.8); const pct = Math.abs(it.net)/TOTAL_CAP(); const len = (vw/2) * (pct / maxPct); ctx.fillStyle = it.net>=0? '#C73A3A' : '#14b36a'; if(it.net>=0){ ctx.fillRect(xMid, y, len, barH); } else { ctx.fillRect(xMid - len, y, len, barH); } if(barH>14){ ctx.fillStyle = isLight ? '#2b2138' : '#fff'; ctx.textAlign='left'; const tx = it.net>=0? xMid+len+6: xMid - len - 50; ctx.fillText(Math.round(pct*100)+'%', it.net>=0? xMid+6: xMid-46, y+barH*0.75); } });
    const lg = document.getElementById('chart-legend'); if(lg){ lg.style.display='flex'; lg.innerHTML = '<div class="legend-item"><span class="legend-swatch" style="background:#C73A3A"></span>净�?占总资)</div><div class="legend-item"><span class="legend-swatch" style="background:#14b36a"></span>净�?占总资)</div>'; }
  } else {
    // Agents performance (simple PnL lines)
    const padL=40, padR=16, padT=12, padB=28; const vw=w-padL-padR, vh=h-padT-padB;
    const baseList = SELECTED_AGENT ? AGENTS.filter(a=>a.id===SELECTED_AGENT) : AGENTS;
    const series = baseList.map(a=>({id:a.id, name:a.name, values:getAgentSeries(a.id)}));
    const min = Math.min(...series.flatMap(s=>s.values)); const max = Math.max(...series.flatMap(s=>s.values)); const rng=(max-min)||1; const n = Math.min(...series.map(s=>s.values.length)); if(n<2) return;
    const xAt = (i)=> padL + vw * (i/(n-1)); const yAt = (v)=> padT + vh * (1 - (v-min)/rng);
    const isLight = document.body.classList.contains('theme-light'); ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'; ctx.lineWidth=1; for(let i=0;i<5;i++){ const y=padT+vh*(i/4); ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(w-padR,y); ctx.stroke(); }
    const palette = ['#910E0E','#C73A3A','#be8c4b','#d06565','#ffb86b','#e06c75','#f1c40f','#16a085','#3498db','#8e44ad'];
    series.forEach((s,idx)=>{ const color=palette[idx%palette.length]; ctx.lineWidth=2; ctx.strokeStyle=color; ctx.beginPath(); s.values.slice(-n).forEach((v,i)=>{ const x=xAt(i), y=yAt(v); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke(); });
  }
}

// -------- Chart interactions (minimal) --------
function setupChartControls(){ document.querySelectorAll('[data-view]').forEach(btn=>{ btn.addEventListener('click', ()=>{ CHART.view = btn.getAttribute('data-view'); document.querySelectorAll('[data-view]').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); drawChart(); }); }); }

// -------- Positions table (use short names) --------
function renderPositions(){ const tbody = document.querySelector('#positions-table tbody'); if(!tbody) return; tbody.innerHTML=''; const agents = SELECTED_AGENT ? AGENTS.filter(a=>a.id===SELECTED_AGENT) : AGENTS.slice(0,5); const rows=[]; agents.forEach(a=>{ STOCKS.forEach(s=>{ const p=POS.get(keyAS(a.id,s.sym)); if(!p||!p.qty) return; const dir=p.qty>0?'\u591a':'\u7a7a'; const cur=s.price; const pnl=(cur - p.avg)*p.qty; const mv=Math.abs(p.qty*cur); rows.push({model:a.name, sym:s.sym, short:s.short, dir, qty:p.qty, avg:p.avg, cur, mv, pnl}); }); }); rows.sort((x,y)=> Math.abs(y.mv)-Math.abs(x.mv)); rows.slice(0,50).forEach(r=>{ const tr=document.createElement('tr'); tr.innerHTML = `<td>${r.model}</td><td title="${r.sym}">${r.short}</td><td>${r.dir}</td><td>${r.qty}</td><td>$${r.avg.toFixed(2)}</td><td>$${r.cur.toFixed(2)}</td><td>\u00a5${(r.mv>=10000?(r.mv/10000).toFixed(1)+'\u4e07':Math.round(r.mv))}</td><td class="${r.pnl>=0?'pos':'neg'}">${r.pnl>=0?'+':''}${r.pnl.toFixed(0)}</td>`; tbody.appendChild(tr); }); }

// -------- Seed richer initial state (100k RMB per agent) --------
const AGENT_SERIES = new Map(); function getAgentSeries(id){ if(!AGENT_SERIES.has(id)) AGENT_SERIES.set(id, []); return AGENT_SERIES.get(id); }
function seedInitialState(){ AGENTS.forEach(agent=>{ const count = Math.floor(3+Math.random()*3); const pool = [...STOCKS]; const picks=[]; while(picks.length<count && pool.length){ picks.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]); } let weights = picks.map(()=> Math.random()+0.2); const sumW = weights.reduce((a,b)=>a+b,0); weights = weights.map(w=> w/sumW); picks.forEach((s,idx)=>{ const alloc = START_CAP_RMB * weights[idx]; let qty = Math.max(1, Math.floor(alloc / s.price)); if(Math.random()<0.4) qty = -qty; const avg = s.price * (1 + (Math.random()-0.5)*0.02); setPos(agent.id, s.sym, {qty, avg}); recordTrade(agent.id, s.sym, qty>0?'buy':'sell', avg, Math.abs(qty)); }); }); AGENTS.forEach(a=>{ const arr=getAgentSeries(a.id); if(arr.length===0){ let base=Math.round((Math.random()-0.5)*800); for(let i=0;i<40;i++){ base += Math.round((Math.random()-0.4)*30); arr.push(base); } } }); renderLeaderboard(); renderPositions(); colorizeDirections(); AGENTS.slice(0,6).forEach(a=> pushFeed(`${a.name} \u5b9a\u5236\u5316\u6301\u4ed3\u5b8c\u6210`)); }

// -------- Theme toggle --------
function applyTheme(theme){ const root = document.body; if(theme==='light'){ root.classList.add('theme-light'); } else { root.classList.remove('theme-light'); } localStorage.setItem('theme', theme); const tbtn = document.getElementById('theme-toggle'); if(tbtn){ tbtn.textContent = theme==='light' ? '\u6df1\u8272' : '\u6d45\u8272'; } drawChart(); }
function setupTheme(){ const pref = localStorage.getItem('theme') || 'dark'; applyTheme(pref); const btn = document.getElementById('theme-toggle'); if(btn){ btn.addEventListener('click', ()=>{ const cur=localStorage.getItem('theme')||'dark'; applyTheme(cur==='light'?'dark':'light'); }); } }

// -------- Simulation loop --------
function setSelectedSymbol(sym){ SELECTED_SYM = sym; const title = document.getElementById('chart-title'); if(title) title.textContent = STOCKS.find(s=>s.sym===sym)?.short || sym; }
function randomWalk(){
  STOCKS.forEach(s=>{
    if(false && !LIVE_QUOTES){
      const base=s.price; const pct=(Math.random()-0.5)*0.4;
      s.price = Math.max(0.01, base*(1+pct/100));
      s.change = s.prevClose? ((s.price - s.prevClose)/s.prevClose*100) : (s.change*0.7 + pct*0.3);
    }
    const b5=ensureBars5(s.sym);
    if(b5.length){ const last=b5[b5.length-1]; const px=s.price; last.c=px; if(px>last.h) last.h=px; if(px<last.l) last.l=px; }
  });
  tickCounter++;
  if(tickCounter%10===0){ STOCKS.forEach(s=>{ const b5=ensureBars5(s.sym); const prev=b5[b5.length-1]; b5.push({ t:new Date(prev.t.getTime()+5*60*1000), o:prev.c, h:prev.c, l:prev.c, c:prev.c }); if(b5.length>300) b5.shift(); }); }
  renderTicker();
  if(Math.random()<0.55){ const agent=AGENTS[Math.floor(Math.random()*AGENTS.length)]; const s=STOCKS[Math.floor(Math.random()*STOCKS.length)]; const side=Math.random()<0.5?'buy':'sell'; const qty=Math.max(1,Math.floor(1+Math.random()*8)); recordTrade(agent.id, s.sym, side, s.price, qty); const pnl=(Math.random()-0.45)*400; agent.pnl += Math.round(pnl); pushFeed(`${agent.name} ${side==='buy'?'\u4e70\u5165':'\u5356\u51fa'} ${s.short} ${pnl>=0?'+':''}${pnl.toFixed(0)} \u7f8e\u5143`); renderLeaderboard(); }
  AGENTS.forEach(a=>{ const arr=getAgentSeries(a.id); arr.push(a.pnl); if(arr.length>600) arr.shift(); });
  drawChart(); renderPositions(); colorizeDirections();
}

// -------- Init --------
function init(){ renderTicker(); renderAgentChips(); renderStockChips(); setupChartControls(); setupTheme(); STOCKS.forEach(s=>ensureBars5(s.sym)); setSelectedSymbol(STOCKS[0].sym); drawChart(); pushFeed('\u7ade\u6280\u573a\u5df2\u5c31\u7eea - \u667a\u80fd\u4f53\u5f85\u547d'); pushFeed('\u5e02\u573a\u72b6\u6001: AI/\u534a\u5bfc\u4f53/\u673a\u5668\u4eba\u52a8\u6001'); seedInitialState(); startBridgeQuotes(); startLiveQuotes(); setInterval(randomWalk, 1600); }
document.addEventListener('DOMContentLoaded', init);

// Override: colorize direction in positions (多=红 pos, 空=绿 neg)
function colorizeDirections(){
  const cells = document.querySelectorAll('#positions-table tbody tr td:nth-child(3)');
  cells.forEach(td => {
    const t = (td.textContent||'').trim();
    td.classList.remove('pos','neg');
    if(t==='多') td.classList.add('pos');
    else if(t==='空') td.classList.add('neg');
  });
}

function renderPositions(){
  const tbody = document.querySelector('#positions-table tbody');
  if(!tbody) return;
  tbody.innerHTML='';
  const agents = SELECTED_AGENT ? AGENTS.filter(a=>a.id===SELECTED_AGENT) : AGENTS.slice(0,5);
  const rows = [];
  agents.forEach(a=>{
    STOCKS.forEach(s=>{
      const p = POS.get(keyAS(a.id,s.sym));
      if(!p || !p.qty) return;
      const dir = p.qty>0 ? '多' : '空';
      const cur = s.price;
      const pnl = (cur - p.avg) * p.qty;
      const mv = Math.abs(p.qty * cur);
      rows.push({ model:a.name, sym:s.sym, short:s.short, dir, qty:p.qty, avg:p.avg, cur, mv, pnl });
    });
  });
  rows.sort((x,y)=> Math.abs(y.mv) - Math.abs(x.mv));
  rows.slice(0,50).forEach(r=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.model}</td>
      <td title="${r.sym}">${r.short}</td>
      <td class="${r.dir==='多'?'pos':'neg'}">${r.dir}</td>
      <td>${r.qty}</td>
      <td>$${r.avg.toFixed(2)}</td>
      <td>$${r.cur.toFixed(2)}</td>
      <td>\u00a5${(r.mv>=10000?(r.mv/10000).toFixed(1)+'\u4e07':Math.round(r.mv))}</td>
      <td class="${r.pnl>=0?'pos':'neg'}">${r.pnl>=0?'+':''}${r.pnl.toFixed(0)}</td>
    `;
    tbody.appendChild(tr);
  });
}
