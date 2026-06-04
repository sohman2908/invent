[ai-command-center-v2.html](https://github.com/user-attachments/files/28584873/ai-command-center-v2.html)
# invent<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI Command Center — 24/7</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0a0a0f;
  --surface:#13131a;
  --surface2:#1c1c26;
  --border:#2a2a3a;
  --accent:#7c6cfa;
  --accent2:#fa6c8a;
  --accent3:#6cfabc;
  --accent4:#fac86c;
  --text:#e8e8f0;
  --muted:#6b6b80;
  --mono:'Space Mono',monospace;
  --sans:'Syne',sans-serif;
}
body{background:var(--bg);color:var(--text);font-family:var(--sans);min-height:100vh;overflow-x:hidden}

/* Grid background */
body::before{content:'';position:fixed;inset:0;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:40px 40px;opacity:.3;pointer-events:none;z-index:0}

.app{position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:24px}

/* Header */
.header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid var(--border)}
.logo{display:flex;align-items:center;gap:12px}
.logo-dot{width:10px;height:10px;border-radius:50%;background:var(--accent3);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(108,250,188,.4)}50%{box-shadow:0 0 0 8px rgba(108,250,188,0)}}
.logo-text{font-size:18px;font-weight:800;letter-spacing:-.5px}
.logo-text span{color:var(--accent)}
.status-bar{display:flex;align-items:center;gap:20px}
.status-pill{display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:11px;color:var(--muted);background:var(--surface);border:1px solid var(--border);border-radius:100px;padding:5px 12px}
.status-pill.live .dot{background:var(--accent3);animation:pulse 2s infinite}
.status-pill .dot{width:7px;height:7px;border-radius:50%;background:var(--muted)}
#clock{font-family:var(--mono);font-size:13px;color:var(--accent);font-weight:700}

/* API Key setup */
#setup-panel{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:32px;margin-bottom:24px;display:flex;flex-direction:column;gap:16px}
.setup-title{font-size:22px;font-weight:800}
.setup-sub{font-size:13px;color:var(--muted);line-height:1.6;font-family:var(--mono)}
.key-row{display:flex;gap:10px}
#api-key-input{flex:1;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:10px 14px;font-family:var(--mono);font-size:13px;color:var(--text);outline:none;transition:.2s}
#api-key-input:focus{border-color:var(--accent)}
#api-key-input::placeholder{color:var(--muted)}
.btn-primary{background:var(--accent);color:#fff;border:none;border-radius:10px;padding:10px 20px;font-family:var(--sans);font-size:13px;font-weight:700;cursor:pointer;transition:.2s;white-space:nowrap}
.btn-primary:hover{opacity:.85}
.btn-secondary{background:transparent;color:var(--text);border:1px solid var(--border);border-radius:10px;padding:8px 16px;font-family:var(--sans);font-size:12px;font-weight:600;cursor:pointer;transition:.2s}
.btn-secondary:hover{background:var(--surface2)}
.btn-danger{background:transparent;color:var(--accent2);border:1px solid var(--accent2);border-radius:10px;padding:8px 16px;font-family:var(--sans);font-size:12px;font-weight:600;cursor:pointer;transition:.2s}
.btn-danger:hover{background:rgba(250,108,138,.1)}

/* Main layout */
#main{display:none}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}

/* Stat cards */
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px;display:flex;flex-direction:column;gap:6px}
.stat-label{font-size:11px;color:var(--muted);font-family:var(--mono);text-transform:uppercase;letter-spacing:.08em}
.stat-value{font-size:28px;font-weight:800;line-height:1}
.stat-sub{font-size:11px;font-family:var(--mono)}
.c-green{color:var(--accent3)}
.c-purple{color:var(--accent)}
.c-red{color:var(--accent2)}
.c-yellow{color:var(--accent4)}

/* Panel */
.panel{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px;display:flex;flex-direction:column;gap:14px}
.panel-header{display:flex;align-items:center;justify-content:space-between}
.panel-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
.panel-controls{display:flex;align-items:center;gap:8px}

/* Task configurator */
.task-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.task-card{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px;cursor:pointer;transition:.2s;position:relative}
.task-card:hover{border-color:var(--accent)}
.task-card.active{border-color:var(--accent);background:rgba(124,108,250,.08)}
.task-card.active::after{content:'✓';position:absolute;top:8px;right:8px;font-size:10px;color:var(--accent)}
.task-icon{font-size:20px;margin-bottom:6px}
.task-name{font-size:12px;font-weight:700}
.task-desc{font-size:11px;color:var(--muted);margin-top:2px;line-height:1.4}

/* Prompt input */
.prompt-input{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px 14px;font-family:var(--mono);font-size:12px;color:var(--text);outline:none;resize:vertical;min-height:80px;width:100%;transition:.2s}
.prompt-input:focus{border-color:var(--accent)}

/* Interval selector */
.interval-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.interval-label{font-size:12px;color:var(--muted);font-family:var(--mono)}
.interval-opts{display:flex;gap:6px}
.interval-btn{background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:5px 12px;font-family:var(--mono);font-size:11px;color:var(--muted);cursor:pointer;transition:.2s}
.interval-btn:hover,.interval-btn.active{border-color:var(--accent);color:var(--accent)}

/* Log */
.log-wrap{background:var(--bg);border:1px solid var(--border);border-radius:10px;height:280px;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:6px}
.log-wrap::-webkit-scrollbar{width:4px}
.log-wrap::-webkit-scrollbar-track{background:transparent}
.log-wrap::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
.log-entry{display:flex;flex-direction:column;gap:4px;border-bottom:1px solid var(--border);padding-bottom:8px}
.log-entry:last-child{border-bottom:none}
.log-meta{display:flex;align-items:center;gap:8px}
.log-ts{font-family:var(--mono);font-size:10px;color:var(--muted)}
.log-badge{font-size:10px;padding:2px 8px;border-radius:100px;font-weight:700;font-family:var(--mono)}
.badge-monitor{background:rgba(108,250,188,.12);color:var(--accent3)}
.badge-generate{background:rgba(124,108,250,.12);color:var(--accent)}
.badge-agent{background:rgba(250,108,138,.12);color:var(--accent2)}
.badge-system{background:rgba(180,180,200,.1);color:var(--muted)}
.log-text{font-family:var(--mono);font-size:11px;color:var(--text);line-height:1.6;padding-left:2px}
.log-thinking{font-family:var(--mono);font-size:11px;color:var(--muted);font-style:italic;animation:blink 1s infinite}
@keyframes blink{0%,100%{opacity:.5}50%{opacity:1}}

/* Progress ring */
.progress-wrap{display:flex;align-items:center;gap:10px}
.ring-label{font-family:var(--mono);font-size:11px;color:var(--muted)}

/* Controls */
.control-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.run-btn{display:flex;align-items:center;gap:8px;background:var(--accent3);color:#0a0a0f;border:none;border-radius:10px;padding:10px 22px;font-family:var(--sans);font-size:13px;font-weight:800;cursor:pointer;transition:.2s}
.run-btn:hover{opacity:.85}
.run-btn.running{background:var(--accent2)}
.run-btn svg{width:14px;height:14px}
#next-run{font-family:var(--mono);font-size:11px;color:var(--muted)}
.api-info{font-family:var(--mono);font-size:11px;color:var(--muted);margin-left:auto}

/* Empty log */
.log-empty{display:flex;align-items:center;justify-content:center;height:100%;font-family:var(--mono);font-size:12px;color:var(--muted);text-align:center;line-height:2}

/* Mobile */
@media(max-width:700px){
  .grid-3{grid-template-columns:1fr 1fr}
  .grid-2{grid-template-columns:1fr}
  .task-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:480px){
  .grid-3{grid-template-columns:1fr}
  .task-grid{grid-template-columns:1fr}
}
</style>
</head>
<body>
<div class="app">

  <div class="header">
    <div class="logo">
      <div class="logo-dot" id="logo-dot" style="background:var(--muted);animation:none"></div>
      <div class="logo-text">AI <span>Command</span> Center</div>
    </div>
    <div class="status-bar">
      <div class="status-pill" id="status-pill">
        <div class="dot"></div>
        <span id="status-text">offline</span>
      </div>
      <div id="clock">--:--:--</div>
    </div>
  </div>

  <!-- Setup -->
  <div id="setup-panel">
    <div class="setup-title">Connect your API key</div>
    <div class="setup-sub">Your key is stored only in this browser tab — never sent anywhere except api.anthropic.com</div>
    <div class="key-row">
      <input id="api-key-input" type="password" placeholder="sk-ant-api03-..." autocomplete="off">
      <button class="btn-primary" onclick="initApp()">Connect ↗</button>
    </div>
    <div id="key-error" style="font-family:var(--mono);font-size:11px;color:var(--accent2);display:none">Invalid key format — should start with sk-ant-</div>
  </div>

  <!-- Main -->
  <div id="main">

    <!-- Stats -->
    <div class="grid-3">
      <div class="stat-card">
        <div class="stat-label">Total runs</div>
        <div class="stat-value c-green" id="stat-runs">0</div>
        <div class="stat-sub c-green">since session start</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Success rate</div>
        <div class="stat-value c-purple" id="stat-success">—</div>
        <div class="stat-sub" style="color:var(--muted)">last 20 runs</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Errors</div>
        <div class="stat-value c-red" id="stat-errors">0</div>
        <div class="stat-sub" style="color:var(--muted)">API failures</div>
      </div>
    </div>

    <div class="grid-2">

      <!-- Left: configurator -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">Task mode</div>
        </div>
        <div class="task-grid">
          <div class="task-card active" id="task-monitor" onclick="selectTask('monitor')">
            <div class="task-icon">👁</div>
            <div class="task-name">Monitor</div>
            <div class="task-desc">Watch & summarise data</div>
          </div>
          <div class="task-card" id="task-generate" onclick="selectTask('generate')">
            <div class="task-icon">✍️</div>
            <div class="task-name">Generate</div>
            <div class="task-desc">Create content on loop</div>
          </div>
          <div class="task-card" id="task-agent" onclick="selectTask('agent')">
            <div class="task-icon">🤖</div>
            <div class="task-name">Agent</div>
            <div class="task-desc">Reason & take actions</div>
          </div>
        </div>

        <div>
          <div class="panel-title" style="margin-bottom:8px">Your prompt</div>
          <textarea class="prompt-input" id="prompt-input" placeholder="What should Claude do on every run?&#10;&#10;E.g. Summarise the top 3 trends in AI today and flag anything critical."></textarea>
        </div>

        <div>
          <div class="interval-row">
            <div class="interval-label">Interval:</div>
            <div class="interval-opts">
              <div class="interval-btn active" onclick="setInterval_(15)" id="int-15">15s</div>
              <div class="interval-btn" onclick="setInterval_(30)" id="int-30">30s</div>
              <div class="interval-btn" onclick="setInterval_(60)" id="int-60">1m</div>
              <div class="interval-btn" onclick="setInterval_(300)" id="int-300">5m</div>
              <div class="interval-btn" onclick="setInterval_(3600)" id="int-3600">1h</div>
            </div>
          </div>
        </div>

        <div class="control-row">
          <button class="run-btn" id="run-btn" onclick="toggleRun()">
            <svg viewBox="0 0 16 16" fill="currentColor"><polygon points="3,1 13,8 3,15"/></svg>
            Start 24/7
          </button>
          <button class="btn-secondary" onclick="runOnce()">Run once</button>
          <span id="next-run"></span>
          <span class="api-info" id="api-info"></span>
        </div>
      </div>

      <!-- Right: live log -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">Live output log</div>
          <button class="btn-secondary" style="font-size:11px;padding:4px 10px" onclick="clearLog()">Clear</button>
        </div>
        <div class="log-wrap" id="log">
          <div class="log-empty">No runs yet.<br>Configure a prompt and hit Start.</div>
        </div>
      </div>

    </div>

    <div style="display:flex;justify-content:flex-end;gap:10px">
      <button class="btn-danger" onclick="disconnectKey()">Disconnect API key</button>
    </div>

  </div>
</div>

<script>
let apiKey = '';
let running = false;
let intervalSecs = 15;
let taskMode = 'monitor';
let timer = null;
let countdown = null;
let countdownVal = 0;
let totalRuns = 0;
let totalErrors = 0;
let recentResults = [];

// Clock
setInterval(() => {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('en-US',{hour12:false});
}, 1000);

function initApp() {
  const key = document.getElementById('api-key-input').value.trim();
  if (!key.startsWith('sk-ant-')) {
    document.getElementById('key-error').style.display = 'block';
    return;
  }
  document.getElementById('key-error').style.display = 'none';
  apiKey = key;
  document.getElementById('setup-panel').style.display = 'none';
  document.getElementById('main').style.display = 'block';
  document.getElementById('api-info').textContent = 'sk-ant-...'+key.slice(-4);
  addLog('system', 'Connected. API key loaded. Ready to run.');
}

function disconnectKey() {
  stopRun();
  apiKey = '';
  document.getElementById('setup-panel').style.display = 'flex';
  document.getElementById('main').style.display = 'none';
  document.getElementById('api-key-input').value = '';
}

function selectTask(mode) {
  taskMode = mode;
  ['monitor','generate','agent'].forEach(m => {
    document.getElementById('task-'+m).classList.toggle('active', m === mode);
  });
  const placeholders = {
    monitor: 'What should Claude monitor and summarise?\n\nE.g. Summarise the top 3 trends in AI today and flag anything critical.',
    generate: 'What content should Claude generate each run?\n\nE.g. Write a punchy LinkedIn post about a business insight. Keep it under 150 words.',
    agent: 'What task should Claude reason through each run?\n\nE.g. Analyse the current state of this project and suggest the next best action.'
  };
  document.getElementById('prompt-input').placeholder = placeholders[mode];
}

function setInterval_(secs) {
  intervalSecs = secs;
  ['15','30','60','300','3600'].forEach(s => {
    document.getElementById('int-'+s).classList.toggle('active', parseInt(s) === secs);
  });
}

function toggleRun() {
  if (running) { stopRun(); } else { startRun(); }
}

function startRun() {
  const prompt = document.getElementById('prompt-input').value.trim();
  if (!prompt) { addLog('system','No prompt set. Add a prompt first.'); return; }
  running = true;
  updateStatusUI(true);
  addLog('system', `24/7 loop started — running every ${formatInterval(intervalSecs)}`);
  executePrompt();
  scheduleNext();
}

function stopRun() {
  running = false;
  clearTimeout(timer);
  clearInterval(countdown);
  updateStatusUI(false);
  document.getElementById('next-run').textContent = '';
  addLog('system','Loop stopped.');
}

function scheduleNext() {
  countdownVal = intervalSecs;
  clearInterval(countdown);
  countdown = setInterval(() => {
    countdownVal--;
    document.getElementById('next-run').textContent = `next run in ${countdownVal}s`;
    if (countdownVal <= 0) clearInterval(countdown);
  }, 1000);
  timer = setTimeout(() => {
    if (!running) return;
    executePrompt();
    scheduleNext();
  }, intervalSecs * 1000);
}

function runOnce() {
  const prompt = document.getElementById('prompt-input').value.trim();
  if (!prompt) { addLog('system','No prompt set. Add a prompt first.'); return; }
  executePrompt();
}

async function executePrompt() {
  const prompt = document.getElementById('prompt-input').value.trim();
  const modeLabels = { monitor:'monitor', generate:'generate', agent:'agent' };
  const badge = modeLabels[taskMode];

  const thinkingId = 'thinking-'+Date.now();
  addLog(badge, '...', thinkingId, true);

  const systemPrompts = {
    monitor: 'You are a 24/7 monitoring AI. Scan, analyse, and summarise key information. Be concise, sharp, and flag anything urgent. Format: first a one-line status, then bullet points of findings.',
    generate: 'You are a 24/7 content generation AI. Produce high-quality, creative, ready-to-use content on every run. Be original and specific — never generic.',
    agent: 'You are a 24/7 reasoning agent. Think step-by-step, reason through the task, and output a clear recommendation or action. Be decisive and specific.'
  };

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 500,
        system: systemPrompts[taskMode],
        messages: [{ role:'user', content: prompt + '\n\nCurrent time: ' + new Date().toLocaleString() }]
      })
    });

    const data = await res.json();
    removeThinking(thinkingId);

    if (data.error) {
      totalErrors++;
      recentResults.push(false);
      updateStats();
      addLog('system', 'API error: ' + data.error.message);
      return;
    }

    const text = data.content?.[0]?.text || '(no response)';
    totalRuns++;
    recentResults.push(true);
    if (recentResults.length > 20) recentResults.shift();
    updateStats();
    addLog(badge, text);

  } catch(e) {
    removeThinking(thinkingId);
    totalErrors++;
    recentResults.push(false);
    updateStats();
    addLog('system', 'Network error: '+e.message);
  }
}

function updateStats() {
  document.getElementById('stat-runs').textContent = totalRuns;
  document.getElementById('stat-errors').textContent = totalErrors;
  const rate = recentResults.length
    ? Math.round(recentResults.filter(Boolean).length / recentResults.length * 100) + '%'
    : '—';
  document.getElementById('stat-success').textContent = rate;
}

function updateStatusUI(live) {
  const pill = document.getElementById('status-pill');
  const dot = document.querySelector('.status-pill .dot');
  const logoD = document.getElementById('logo-dot');
  document.getElementById('status-text').textContent = live ? 'live' : 'offline';
  pill.classList.toggle('live', live);
  logoD.style.background = live ? 'var(--accent3)' : 'var(--muted)';
  logoD.style.animation = live ? 'pulse 2s infinite' : 'none';
  const btn = document.getElementById('run-btn');
  btn.classList.toggle('running', live);
  btn.innerHTML = live
    ? `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="5" height="12" rx="1"/><rect x="9" y="2" width="5" height="12" rx="1"/></svg> Stop`
    : `<svg viewBox="0 0 16 16" fill="currentColor"><polygon points="3,1 13,8 3,15"/></svg> Start 24/7`;
}

function addLog(badge, text, id, thinking=false) {
  const log = document.getElementById('log');
  const empty = log.querySelector('.log-empty');
  if (empty) empty.remove();

  const el = document.createElement('div');
  el.className = 'log-entry';
  if (id) el.id = id;

  const ts = new Date().toLocaleTimeString('en-US',{hour12:false});
  const badgeClass = {monitor:'badge-monitor',generate:'badge-generate',agent:'badge-agent',system:'badge-system'}[badge]||'badge-system';

  el.innerHTML = `
    <div class="log-meta">
      <span class="log-ts">${ts}</span>
      <span class="log-badge ${badgeClass}">${badge}</span>
    </div>
    <div class="log-text${thinking?' log-thinking':''}">${escapeHtml(text)}</div>
  `;
  log.insertBefore(el, log.firstChild);
}

function removeThinking(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function clearLog() {
  document.getElementById('log').innerHTML = '<div class="log-empty">Log cleared.</div>';
}

function formatInterval(s) {
  if (s < 60) return s+'s';
  if (s < 3600) return (s/60)+'m';
  return (s/3600)+'h';
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
}
</script>
</body>
</html>
