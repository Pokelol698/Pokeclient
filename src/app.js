const content = document.getElementById('content');
const title = document.getElementById('pageTitle');
const toast = document.getElementById('toast');

const state = {
  page: 'home',
  profile: localStorage.getItem('poke.profile') || 'Poke 1.21.11',
  ram: Number(localStorage.getItem('poke.ram') || 6),
  gameDir: localStorage.getItem('poke.gameDir') || 'Default Minecraft directory',
  java: localStorage.getItem('poke.java') || 'Auto detect',
  signedIn: localStorage.getItem('poke.signedIn') === 'true',
};

const pages = {
  home: () => `
    <div class="hero">
      <div class="hero-copy">
        <div class="eyebrow">POKE CLIENT • MINECRAFT 1.21.11</div>
        <h1>Ready to play?</h1>
        <p>One clean launcher for your Minecraft profiles, performance settings and mods. Your Microsoft account stays with the official sign-in flow.</p>
        <div class="hero-actions">
          <button class="play" id="playBtn">▶ Play ${escapeHtml(state.profile.replace('Poke ', ''))}</button>
          <button class="secondary" id="manageBtn">Manage profile</button>
        </div>
      </div>
      <div class="profile-card">
        <div class="card-label">CURRENT PROFILE</div>
        <h3>${escapeHtml(state.profile)}</h3>
        <p class="muted">Fabric • Java 21 • ${state.ram} GB RAM</p>
        <div class="status"><span class="dot"></span><span>Launcher ready</span></div>
      </div>
    </div>
    <div class="section-head"><div><h2>Quick setup</h2><p class="muted">Everything you need before your first launch.</p></div></div>
    <div class="cards">
      <button class="card interactive" data-route="mods"><div class="card-icon">⚡</div><h3>Performance</h3><p class="muted">FPS-focused settings and Fabric performance mods.</p><span class="card-link">Open Mods →</span></button>
      <button class="card interactive" data-route="profiles"><div class="card-icon">◈</div><h3>Profiles</h3><p class="muted">Keep versions, mods and RAM settings separated.</p><span class="card-link">Open Profiles →</span></button>
      <button class="card interactive" data-route="settings"><div class="card-icon">⚙</div><h3>Launcher settings</h3><p class="muted">Choose RAM, Java and your Minecraft directory.</p><span class="card-link">Open Settings →</span></button>
    </div>
    <div class="notice"><b>Microsoft sign-in</b><span>The launcher does not collect your Microsoft password. Sign-in is handled through Microsoft's official account flow.</span></div>
  `,

  mods: () => `
    <div class="page"><div class="page-head"><div><h1>Mods</h1><p class="muted">Choose which client modules are enabled for <b>${escapeHtml(state.profile)}</b>.</p></div><button class="secondary" id="resetMods">Reset</button></div>
      <div class="list" id="modsList">
        ${modRow('FPS Booster', 'Poke Client performance module', true)}
        ${modRow('Sodium', 'Rendering optimization', true)}
        ${modRow('Lithium', 'Game logic optimization', true)}
        ${modRow('Mod Menu', 'In-game mod configuration screen', false)}
      </div>
    </div>`,

  profiles: () => `
    <div class="page"><div class="page-head"><div><h1>Profiles</h1><p class="muted">Each profile keeps its own version and launch configuration.</p></div><button class="secondary" id="newProfile">+ New profile</button></div>
      <div class="list">
        ${profileRow('Poke 1.21.11', 'Fabric • Java 21 • Performance', state.profile === 'Poke 1.21.11')}
        ${profileRow('Vanilla 1.21.11', 'Clean Minecraft profile', state.profile === 'Vanilla 1.21.11')}
      </div>
    </div>`,

  servers: () => `
    <div class="page"><div class="page-head"><div><h1>Servers</h1><p class="muted">Save your favorite servers here. No server data is sent anywhere by this launcher.</p></div><button class="secondary" id="addServer">+ Add server</button></div>
      <div class="empty-card"><div class="empty-icon">◉</div><h3>No servers yet</h3><p class="muted">Add a server address to keep it in your launcher.</p></div>
    </div>`,

  settings: () => `
    <div class="page"><div class="page-head"><div><h1>Settings</h1><p class="muted">Launcher preferences are stored locally on this computer.</p></div><button class="secondary" id="resetSettings">Reset</button></div>
      <div class="settings-grid">
        <div class="card setting"><label for="ram">RAM allocation</label><div class="range-row"><input type="range" min="2" max="16" value="${state.ram}" id="ram"><strong><span id="ramVal">${state.ram}</span> GB</strong></div><p class="muted">Recommended: 4–8 GB for a normal modded profile.</p></div>
        <div class="card setting"><label for="gameDir">Game directory</label><input value="${escapeAttr(state.gameDir)}" id="gameDir"><p class="muted">Use the folder where Minecraft files should live.</p></div>
        <div class="card setting"><label for="java">Java runtime</label><select id="java"><option ${state.java === 'Auto detect' ? 'selected' : ''}>Auto detect</option><option ${state.java.startsWith('Java 21') ? 'selected' : ''}>Java 21 (recommended)</option></select><p class="muted">Minecraft 1.21.x uses a Java 21 runtime.</p></div>
      </div>
    </div>`
};

function modRow(name, description, enabled) {
  return `<div class="row"><div><b>${name}</b><div class="muted">${description}</div></div><button class="toggle ${enabled ? 'on' : ''}" data-mod="${name}" aria-pressed="${enabled}">${enabled ? 'Enabled' : 'Disabled'}</button></div>`;
}

function profileRow(name, description, selected) {
  return `<div class="row"><div><b>${name}</b><div class="muted">${description}</div></div><button class="toggle ${selected ? 'on' : ''}" data-profile="${name}">${selected ? 'Selected' : 'Select'}</button></div>`;
}

function show(page) {
  state.page = page;
  title.textContent = page[0].toUpperCase() + page.slice(1);
  content.innerHTML = pages[page]();
  document.querySelectorAll('.nav').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  bindPageActions();
}

function bindPageActions() {
  document.querySelectorAll('[data-route]').forEach(el => el.onclick = () => show(el.dataset.route));
  document.querySelectorAll('[data-profile]').forEach(el => el.onclick = () => {
    state.profile = el.dataset.profile;
    localStorage.setItem('poke.profile', state.profile);
    toastMsg(`Selected ${state.profile}`);
    show('profiles');
  });
  document.querySelectorAll('[data-mod]').forEach(el => el.onclick = () => {
    el.classList.toggle('on');
    const enabled = el.classList.contains('on');
    el.textContent = enabled ? 'Enabled' : 'Disabled';
    el.setAttribute('aria-pressed', String(enabled));
  });

  const play = document.getElementById('playBtn');
  if (play) play.onclick = () => toastMsg('Sign in with Microsoft first, then the game launch backend can be connected to this profile.');
  const manage = document.getElementById('manageBtn');
  if (manage) manage.onclick = () => show('profiles');
  const resetMods = document.getElementById('resetMods');
  if (resetMods) resetMods.onclick = () => show('mods');
  const newProfile = document.getElementById('newProfile');
  if (newProfile) newProfile.onclick = () => toastMsg('Custom profile creation is ready for the next launcher backend step.');
  const addServer = document.getElementById('addServer');
  if (addServer) addServer.onclick = () => toastMsg('Server manager UI is ready; persistent server storage will be added with the backend.');
  const resetSettings = document.getElementById('resetSettings');
  if (resetSettings) resetSettings.onclick = () => { state.ram = 6; state.gameDir = 'Default Minecraft directory'; state.java = 'Auto detect'; persistSettings(); show('settings'); toastMsg('Settings reset.'); };

  const ram = document.getElementById('ram');
  if (ram) ram.oninput = () => { state.ram = Number(ram.value); document.getElementById('ramVal').textContent = ram.value; persistSettings(); };
  const gameDir = document.getElementById('gameDir');
  if (gameDir) gameDir.onchange = () => { state.gameDir = gameDir.value.trim() || 'Default Minecraft directory'; persistSettings(); };
  const java = document.getElementById('java');
  if (java) java.onchange = () => { state.java = java.value; persistSettings(); };
}

function persistSettings() {
  localStorage.setItem('poke.ram', String(state.ram));
  localStorage.setItem('poke.gameDir', state.gameDir);
  localStorage.setItem('poke.java', state.java);
}

function updateAccountUI() {
  const name = document.getElementById('accountName');
  const sub = document.getElementById('accountSub');
  const avatar = document.getElementById('avatar');
  const login = document.getElementById('loginBtn');
  if (state.signedIn) {
    name.textContent = 'Microsoft account';
    sub.textContent = 'Connected';
    avatar.textContent = '✓';
    login.textContent = 'Account';
  } else {
    name.textContent = 'Not signed in';
    sub.textContent = 'Microsoft account';
    avatar.textContent = '?';
    login.textContent = 'Sign in';
  }
}

function toastMsg(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastMsg.timer);
  toastMsg.timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function escapeAttr(value) { return escapeHtml(value); }

document.querySelectorAll('.nav').forEach(b => b.onclick = () => show(b.dataset.page));
document.getElementById('loginBtn').onclick = () => toastMsg('Microsoft sign-in is intentionally kept in the official OAuth flow. Add your registered app client ID before enabling authentication.');
document.getElementById('closeBtn').onclick = () => window.__TAURI__?.window?.getCurrentWindow ? window.__TAURI__.window.getCurrentWindow().close() : window.close();
document.getElementById('minimizeBtn').onclick = () => window.__TAURI__?.window?.getCurrentWindow ? window.__TAURI__.window.getCurrentWindow().minimize() : toastMsg('Minimize is available in the native desktop build.');
updateAccountUI();
show('home');
