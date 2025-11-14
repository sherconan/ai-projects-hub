// Minimal HK quotes proxy for the static page
// - No external deps: uses built-in http/https
// - Endpoint: GET /api/hk-quotes?codes=0981.HK,3690.HK,...
// - Data source: Sina HK quotes (hq.sinajs.cn)
// - CORS: Access-Control-Allow-Origin: * (for file:// origin)

const http = require('http');
const https = require('https');
const { URL } = require('url');
const { spawn } = require('child_process');

const PORT = process.env.PORT ? Number(process.env.PORT) : 3344;

function hkFive(code) {
  const raw = String(code).split('.')[0].replace(/\D/g, '');
  return raw.padStart(5, '0');
}

function parseSinaHK(raw) {
  if (!raw) return null;
  const arr = String(raw).split(',');
  const name = arr[0] || '';
  const prev = parseFloat(arr[2]) || parseFloat(arr[1]) || NaN;
  const cur = parseFloat(arr[3]) || parseFloat(arr[6]) || parseFloat(arr[1]) || NaN;
  if (!isFinite(prev) || !isFinite(cur)) return null;
  const pct = prev ? ((cur - prev) / prev * 100) : 0;
  return { name, cur, prev, pct };
}

function fetchSinaQuotes(codes) {
  return new Promise((resolve, reject) => {
    if (!codes.length) return resolve([]);
    const list = codes.map(c => `hk${hkFive(c)}`).join(',');
    const src = `https://hq.sinajs.cn/list=${list}`;
    https.get(src, { headers: { 'Accept': '*/*' } }, (res) => {
      let data = '';
      res.setEncoding('binary'); // Sina may respond in gbk/gb2312; treat as binary
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          // Best-effort: interpret as latin1 to keep raw bytes, names may be garbled but price ok
          // In most modern setups, Node will handle reasonably.
          const text = Buffer.from(data, 'binary').toString('latin1');
          const lines = text.split(/\r?\n/).filter(Boolean);
          const out = [];
          for (const ln of lines) {
            const m = ln.match(/var\s+hq_str_hk(\d{5})="([^"]*)"/);
            if (!m) continue;
            const code = m[1];
            const payload = m[2];
            const parsed = parseSinaHK(payload);
            if (!parsed) continue;
            const sym = `${code}.HK`;
            out.push({ sym, name: parsed.name, price: parsed.cur, changePct: parsed.pct });
          }
          resolve(out);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

// Optional: Try MCP first, then fallback to Sina
async function mcpQuotesIfAvailable(codes, timeoutMs = 6000){
  const cmd = process.env.MCP_CMD; // e.g. "node C:\\path\\to\\mcp-server.js" or absolute executable
  if(!cmd) return null;
  let sdk;
  try{
    // Dynamic import to keep server.js runnable without deps
    sdk = await import('@modelcontextprotocol/sdk');
  }catch(e){
    return null; // SDK not installed
  }
  const { Client } = await import('@modelcontextprotocol/sdk/client/index.js');
  const { StdioClientTransport } = await import('@modelcontextprotocol/sdk/client/stdio.js');

  // Parse command + args from MCP_CMD
  const parts = cmd.split(' ').filter(Boolean);
  const command = parts.shift();
  const args = parts.concat((process.env.MCP_ARGS||'').split(' ').filter(Boolean));

  const transport = new StdioClientTransport({ command, args, env: process.env });
  const client = new Client({ name: 'trading-agent-bridge', version: '0.1.0' }, transport);
  const timer = setTimeout(()=>{ try{ transport.close?.(); }catch{} }, timeoutMs);
  try{
    await client.connect();
    const tools = await client.listTools();
    // Heuristic: pick a tool that looks like quote(s)
    const tool = tools.tools.find(t=>/quote|quotes|price/i.test(t.name));
    if(!tool){ return null; }
    const payloads = [
      { symbols: codes },
      { tickers: codes },
      { codes }
    ];
    let result = null;
    for(const p of payloads){
      try{
        const resp = await client.callTool({ name: tool.name, arguments: p });
        // Expect either a list of objects or a single object with fields {symbol, price, changePct}
        const arr = Array.isArray(resp) ? resp : (Array.isArray(resp.content)? resp.content : []);
        // Normalize best-effort
        const out = [];
        const pushIf = (o)=>{
          if(!o) return;
          const sym = o.symbol || o.sym || o.ticker || o.code;
          const price = Number(o.price ?? o.last ?? o.close ?? o.value);
          const changePct = Number(o.changePct ?? o.change_percent ?? o.changePercent ?? o.pct);
          if(sym && isFinite(price)) out.push({ sym, name: o.name || o.shortName || sym, price, changePct: isFinite(changePct)? changePct : 0 });
        };
        if(Array.isArray(arr)){
          arr.forEach(it=>{
            if(it && it.type==='text' && typeof it.text==='string'){
              try{ const parsed=JSON.parse(it.text); if(Array.isArray(parsed)) parsed.forEach(pushIf); else pushIf(parsed); }catch{}
            }else if(typeof it==='object'){
              pushIf(it);
            }
          });
        }
        if(out.length){ result = out; break; }
      }catch(err){ /* try next payload */ }
    }
    return result;
  }catch(e){
    return null;
  }finally{
    clearTimeout(timer);
    try{ await transport.close?.(); }catch{}
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (req.method === 'GET' && url.pathname === '/api/hk-quotes') {
    const codesParam = url.searchParams.get('codes') || '';
    const codes = codesParam.split(',').map(s => s.trim()).filter(Boolean);
    try {
      // Prefer MCP if configured and working
      const mcpData = await mcpQuotesIfAvailable(codes).catch(()=>null);
      if(mcpData && mcpData.length){
        return sendJson(res, 200, { ok: true, source: 'mcp', data: mcpData });
      }
      const data = await fetchSinaQuotes(codes);
      return sendJson(res, 200, { ok: true, source: 'sina', data });
    } catch (err) {
      return sendJson(res, 500, { ok: false, error: String(err) });
    }
  }

  // Health
  if (req.method === 'GET' && url.pathname === '/api/health') {
    return sendJson(res, 200, { ok: true });
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`HK quotes proxy running at http://localhost:${PORT}`);
});
