"use strict";

/* ----------------------------------------------------------------
   Sons integrados
   ---------------------------------------------------------------- */
const DEFAULT_AUDIOS_CATALOG = [
  { id: 'white',  name: 'Ruido Branco', icon: 'noise',     desc: "Tom neutro suave",          file: 'white.mp3',  dbMin: 0, dbMax: 5,   referenceDb: 20 },
  { id: 'pink',   name: 'Ruido Rosa',   icon: 'softNoise', desc: "Espectro natural calmante", file: 'pink.mp3',   dbMin: 6, dbMax: 10,  referenceDb: 20 },
  { id: 'rain',   name: 'Chuva',        icon: 'rain',      desc: "Gotas ritmadas",            file: 'rain.mp3',   dbMin: 11, dbMax: 15, referenceDb: 20 },
  { id: 'forest', name: 'Floresta',     icon: 'forest',    desc: "Sons da natureza",          file: 'forest.mp3', dbMin: 16, dbMax: 20, referenceDb: 20 },
  { id: '432hz',  name: '432 Hz',       icon: 'tone',      desc: "Tom de relaxamento",        file: '432hz.mp3',  dbMin: 21, dbMax: 25, referenceDb: 20 },
  { id: '528hz',  name: '528 Hz',       icon: 'spark',     desc: "Tom de regeneração",        file: '528hz.mp3',  dbMin: 26, dbMax: 30, referenceDb: 20 },
  { id: '40hz',   name: '40 Hz Gamma',  icon: 'brain',     desc: "Estimulação cognitiva",     file: '40hz.mp3',   dbMin: 31, dbMax: 35, referenceDb: 20 },
  { id: 'ocean',  name: 'Ondas do Mar', icon: 'ocean',     desc: "Ondas ritmadas",            file: 'ocean.mp3',  dbMin: 36, dbMax: 40, referenceDb: 20 },
  { id: 'piano',  name: 'Piano Calmo',  icon: 'piano',     desc: "Piano calmo",               file: 'piano.mp3',  dbMin: 41, dbMax: 45, referenceDb: 20 },
];

const DEFAULT_TRIGGERING_CATALOG = [
  { id: 'babycry',    name: 'Bebê chorando',         desc: 'Um bebê chorando',                                    file: 'babycrying.mp3',    db: 50},
  { id: 'drill',      name: 'Furadeira',             desc: 'Som de uma furadeira em funcionamento',               file: 'drill.mp3',         db: 50},
  { id: 'fireworks',  name: 'Fogos de artifício',    desc: 'Explosões de fogos de artifício durante comemoração', file: 'fireworks.mp3',     db: 50},
  { id: 'hairdryer',  name: 'Secador de cabelo',     desc: 'Som de secador de cabelo em funcionamento',           file: 'hairdryer.mp3',     db: 50},
  { id: 'alarm',      name: 'Alarme',                desc: 'Alarme de desastre natural',                          file: 'mgalarm.mp3',       db: 50},
  { id: 'talking',    name: 'Pessoas falando',       desc: 'Sons de pessoas falando',                             file: 'peopletalking.mp3', db: 50},
  { id: 'restaurant', name: 'Restaurante',           desc: 'Sons de pessoas falando e comendo em um restaurante', file: 'restaurant.mp3',    db: 50},
  { id: 'subway',     name: 'Metrô',                 desc: 'Sons de uma estação de metrô',                        file: 'spsubway.mp3',      db: 50},
  { id: 'static',     name: 'Estática de televisão', desc: 'Som de estática de televisão',                        file: 'static.mp3',        db: 50},
  { id: 'traffic',    name: 'Tráfego',               desc: 'Som de carros em uma rua',                            file: 'traffic.mp3',       db: 50},
  { id: 'streets',    name: 'Ruas urbanas',          desc: 'Som atravessando uma rua urbana',                     file: 'urbanstreet.mp3',   db: 50},
]

function audioIconSVG(iconName) {
  const icons = {
    noise:        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12h2m2-4v8m2-6v4m2-8v12m2-8v4m2-6v8m2-4h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 7.5h18M3 16.5h18" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".35"/></svg>',
    softNoise:    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="12" r="1.6" fill="currentColor" opacity=".9"/><circle cx="12" cy="9" r="1.9" fill="currentColor" opacity=".8"/><circle cx="16.5" cy="13" r="1.5" fill="currentColor" opacity=".75"/><path d="M4 6.5h16M4 17.5h16" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".25"/></svg>',
    'soft-noise': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="12" r="1.6" fill="currentColor" opacity=".9"/><circle cx="12" cy="9" r="1.9" fill="currentColor" opacity=".8"/><circle cx="16.5" cy="13" r="1.5" fill="currentColor" opacity=".75"/><path d="M4 6.5h16M4 17.5h16" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".25"/></svg>',
    rain:         '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 15.5a4.5 4.5 0 1 1 1.5-8.75A5.5 5.5 0 0 1 18.5 9c0 .17 0 .33-.02.5A3.5 3.5 0 0 1 18 16H6z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 18v2M12 17v3M16 18v2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    forest:       '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l5 7h-3l4 6h-3l3 5H6l3-5H6l4-6H7l5-7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 20v-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    tone:         '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 19V6l12-3v13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    spark:        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.8 5.3L19 10l-5.2 1.7L12 17l-1.8-5.3L5 10l5.2-1.7L12 3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8L18 16z" fill="currentColor" opacity=".75"/></svg>',
    brain:        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 6a3 3 0 0 1 6 0c1.7 0 3 1.3 3 3a3 3 0 0 1-1.2 2.4A3 3 0 0 1 16 16a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3 3 3 0 0 1-1.8-5.6A3 3 0 0 1 9 6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    ocean:        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 9c1.2 0 1.8-.8 2.6-1.4C7.5 7 8.4 6.5 10 6.5s2.5.5 3.4 1.1c.8.6 1.4 1.4 2.6 1.4s1.8-.8 2.6-1.4C19.5 7 20.4 6.5 22 6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4 13c1.2 0 1.8-.8 2.6-1.4C7.5 11 8.4 10.5 10 10.5s2.5.5 3.4 1.1c.8.6 1.4 1.4 2.6 1.4s1.8-.8 2.6-1.4C19.5 11 20.4 10.5 22 10.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4 17c1.2 0 1.8-.8 2.6-1.4C7.5 15 8.4 14.5 10 14.5s2.5.5 3.4 1.1c.8.6 1.4 1.4 2.6 1.4s1.8-.8 2.6-1.4C19.5 15 20.4 14.5 22 14.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    piano:        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 6H19V3a1 1 0 0 0-1-1H14a1 1 0 0 0-1 1V6H11V3a1 1 0 0 0-1-1H6A1 1 0 0 0 5 3V6H2A1 1 0 0 0 1 7V21a1 1 0 0 0 1 1H22a1 1 0 0 0 1-1V7A1 1 0 0 0 22 6ZM15 4h2v7H15ZM7 4H9v7H7ZM21 20H17V15a1 1 0 0 0-2 0v5H9V15a1 1 0 0 0-2 0v5H3V8H5v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V8h2v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V8h2Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity=".25"></path></svg>'
  };
  return icons[iconName] || icons.tone;
}

/* ----------------------------------------------------------------
   Perfis
   ---------------------------------------------------------------- */
const BUILTIN_PROFILES = {
  home:      { id: 'home',      name: 'Casa',       sensitivity: 'low',  cooldownFactor: 1.0, debounceFactor: 1.1, thresholdDelta: 0,   dbOffsetDelta: 0 },
  school:    { id: 'school',    name: 'Escola',     sensitivity: 'mid',  cooldownFactor: 0.9, debounceFactor: 1.0, thresholdDelta: -2,  dbOffsetDelta: -1 },
  work:      { id: 'work',      name: 'Trabalho',   sensitivity: 'mid',  cooldownFactor: 1.0, debounceFactor: 1.0, thresholdDelta: 2,   dbOffsetDelta: 0 },
  transport: { id: 'transport', name: 'Transporte', sensitivity: 'high', cooldownFactor: 0.7, debounceFactor: 0.7, thresholdDelta: -6,  dbOffsetDelta: -2 },
  sleep:     { id: 'sleep',     name: 'Sono',       sensitivity: 'low',  cooldownFactor: 1.8, debounceFactor: 1.6, thresholdDelta: -10, dbOffsetDelta: 1 },
};

const DEFAULT_PROFILE_BASE = {
  sensitivity: 'mid',
  cooldown: 3,
  debounce: 800,
  noiseNotifyThreshold: 80,
  dbOffset: 0,
}

const CALIBRATION_SEQUENCE = DEFAULT_TRIGGERING_CATALOG.map((item) => ({
  id: item.id,
  name: item.name,
  db: item.referenceDb,
  icon: item.icon,
  file: item.file
}));

const SENSITIVITY_CONFIG = {
  low:  { smoothing: 0.95, offsetMult: 0.8, cooldown: 5 },
  mid:  { smoothing: 0.85, offsetMult: 1.0, cooldown: 3 },
  hidh: { smoothing: 0.70, offsetMult: 1.2, cooldown: 1 },
}

/* ----------------------------------------------------------------
   Estado global
   ---------------------------------------------------------------- */
const state = {
  // Config
  theme: 'dark',
  sensitivity: 'mid',
  cooldown: 3,
  debounce: 800,
  dbOffset: 0,
  noiseNotifyThreshold: 80,
  notifyOnTrigger: true,
  activeProfile: null,
  profileBase: { ...DEFAULT_PROFILE_BASE },
  profileOverrides: {},
  customProfiles: [],

  // Runtime
  audios: [],   // { id, name, isDefault, src (objectURL ou path), storedKey, volume, icon }
  triggers: [], // { id, name, dbMin, dbMax, audioId, volume, enabled }
  history: [],  // { type, text, db, timestamp }

  // Status da sessão
  monitoringActive: false,
  sessionStart: null,
  sessionDbValues: [],
  sessionTriggerCount: 0,
  sessionMaxDb: null,
  sessionWindows: [],
  currentWindow: null,

  // Player
  isPlaying: false,
  currentAudioId: null,

  // Persistência
  dbStat: { max: null, avg: null, triggerCount: 0 },

  // Calibração guiada
  calibrationIndex: 0,
  CalibrationResponses: [],

  // Desenvolvimento
  debugMode: true,
  software: '0.9.0.260604.1753b0',
};

let _audioEl = null;
let _audioCtx = null;
let _analyser = null;
let _micStream = null;
let _micActive = false;
let _dbRafId = null;
let _batInterval = null;
let _toastTimeout = null;
let selectedAudioIndex = null;
let _audioCtxMic = null;
let _source = null;
let _stream = null;

let dbTimer = null;

console.log(JSON.stringify(Object.keys(window.Capacitor?.Plugins || {})));

/* ----------------------------------------------------------------
   Boot
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  defineSoftwareVersion();
  loadFromStorage();
  applyTheme(state.theme);
  syncThemeSelect();
  renderAudioList();
  renderDefaultGrid();
  updateBatteryUI();
  updateNowPlayingUI();
  updateConnectionUI();
  startBatteryDrain();
  initMicrophone();
});

function defineSoftwareVersion() {
  let versionEl = document.getElementById('footer-sv');
  versionEl.innerText = state.software;
}

/* ----------------------------------------------------------------
   Persistência
   ---------------------------------------------------------------- */
function loadFromStorage() {
  try {
    var raw = localStorage.getItem('earguard');
    if (!raw) return;
    var saved = JSON.parse(raw);
    state.audios = saved.audios || [];
    state.theme = saved.theme || 'dark';
    state.connection = saved.connection || 'disconnected';
    state.deviceId = saved.deviceId || null;
    state.battery = saved.battery != null ? saved.battery : 78;
    state.batNotifyThreshold = saved.batNotifyThreshold != null ? saved.batNotifyThreshold : 20;
    state.ecoMode = saved.ecoMode || false;
    state.ecoThreshold = saved.ecoThreshold || 0;
    _setVal('bat-notify-input', state.batNotifyThreshold);
    _setVal('eco-threshold', state.ecoThreshold);
    _setChecked('eco-toggle', state.ecoMode);
    updateEcoBadge();
    if (state.deviceId) _setText('footer-device-id', state.deviceId);
  } catch (e) { /* ignore */ }
}

function saveToStorage() {
  try {
    localStorage.setItem('earguard', JSON.stringify({
      theme: state.theme,
      connection: state.connection,
      deviceId: state.deviceId,
      battery: Math.round(state.battery),
      audios: state.audios,
      batNotifyThreshold: state.batNotifyThreshold,
      ecoMode: state.ecoMode,
      ecoThreshold: state.ecoThreshold,
    }));
  } catch (e) { /* ignore */ }
}

/* ----------------------------------------------------------------
   Navegação
   ---------------------------------------------------------------- */
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(function (s) { s.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('active'); });
  var screen = document.getElementById('screen-' + name);
  var nav = document.getElementById('nav-' + name);
  if (screen) screen.classList.add('active');
  if (nav) nav.classList.add('active');
  // Atualiza lista de áudios
  if (name === 'audios') renderAudioList();
}

/* ----------------------------------------------------------------
   Tema
   ---------------------------------------------------------------- */
function setTheme(val) {
  state.theme = val;
  applyTheme(val);
  saveToStorage();
}
function applyTheme(val) {
  var effective = val;
  if (val === 'system') {
    effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.body.setAttribute('data-theme', effective);
}
function syncThemeSelect() {
  var sel = document.getElementById('theme-select');
  if (sel) sel.value = state.theme;
}

/* ----------------------------------------------------------------
   Microfone
   ---------------------------------------------------------------- */
async function initMicrophone() {
  try {
    _stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });

    _audioCtxMic = new (window.AudioContext || window.webkitAudioContext)();

    _analyser = _audioCtxMic.createAnalyser();
    _analyser.fftSize = 2048;
    _analyser.smoothingTimeConstant = 0.8;

    _source = _audioCtxMic.createMediaStreamSource(_stream);
    _source.connect(_analyser);

    _micActive = true;

    _startDbLoop();

    showToast('Microfone ativo', 'success');
  } catch (err) {
    console.error(err);
    showToast('Microfone indisponível', 'warn');
  }
}
async function startMonitoring() {

  dbTimer = setInterval(async () => {

    try {

      const result =
        await EarGuard.getCurrentDb();

      const db =
        Math.round(result.db);

      state.decibels = db;

      updateDbUI(db);

      _checkTriggers(db);

    } catch (err) {

      console.error(err);

    }

  }, 200);
}
function _startDbLoop() {
  if (!_analyser) {
    console.error('Analyser não inicializado');
    return;
  }

  const buffer = new Float32Array(_analyser.fftSize);

  let decibelsSensitivityOffset = 65;

  function tick() {
    try {
      if (!_micActive) return;

      _analyser.getFloatTimeDomainData(buffer);


      /*let peak = 0;

      for (let i = 0; i < buffer.length; i++) {
          peak = Math.max(peak, Math.abs(buffer[i]));
      }

      console.log("peak=", peak);*/




      let sum = 0;

      for (let i = 0; i < buffer.length; i++) {
        sum += buffer[i] * buffer[i];
      }

      const rms = Math.sqrt(sum / buffer.length);

      const dbFS = rms > 0
        ? 20 * Math.log10(rms)
        : -100;

      // Calibration offset
      const dbSPL = Math.max(
        0,
        dbFS + decibelsSensitivityOffset
      );


      /*console.log({
        rms,
        dbFS,
        dbSPL
      });*/

      state.decibels = Math.round(dbSPL);

      updateDbUI(state.decibels);

      _checkTriggers(state.decibels);

      _dbRafId = requestAnimationFrame(tick);
    } catch (e) {
      console.error("DB LOOP CRASHED X_X: " + e)
    }
  }

  tick();
}
function updateDbUI(db) {
  var el = document.getElementById('db-value');
  if (el) el.textContent = db !== null ? db + ' dB' : '-- dB';
}
function stopMicrophone() {
  _micActive = false;

  if (_dbRafId) {
    cancelAnimationFrame(_dbRafId);
    _dbRafId = null;
  }

  if (_source) {
    _source.disconnect();
    _source = null;
  }

  if (_stream) {
    _stream.getTracks().forEach(track => track.stop());
    _stream = null;
  }

  if (_audioCtxMic) {
    _audioCtxMic.close();
    _audioCtxMic = null;
  }

  _analyser = null;
}
function stopMonitoring() {

  if (dbTimer) {

    clearInterval(dbTimer);

    dbTimer = null;
  }
}

/* ----------------------------------------------------------------
   Bateria
   ---------------------------------------------------------------- */
function startBatteryDrain() {
  updateBatteryUI();
  _batInterval = setInterval(function () {
    if (state.connection === 'disconnected') return;
    state.battery = Math.max(0, state.battery - 0.06);
    updateBatteryUI();
    _checkBatNotify();
    if (state.ecoThreshold > 0 && state.battery <= state.ecoThreshold && !state.ecoMode) {
      state.ecoMode = true;
      _setChecked('eco-toggle', true);
      updateEcoBadge();
      showToast('Modo economia ativado automaticamente', 'warn');
      saveToStorage();
    }
  }, 8000);
}
function updateBatteryUI() {
  var pct = Math.round(state.battery);
  _setText('battery-pct', pct + '%');
  var fill = document.getElementById('bat-fill-bar');
  if (fill) fill.style.width = pct + '%';
  var block = document.getElementById('battery-block');
  if (block) block.style.color = pct <= 20 ? 'var(--danger)' : pct <= 40 ? 'var(--warn)' : '';
}
function _checkBatNotify() {
  var t = state.batNotifyThreshold;
  if (t > 0 && state.battery <= t && state.battery > t - 0.4)
    showToast('Bateria baixa: ' + Math.round(state.battery) + '%', 'warn');
}

/* ----------------------------------------------------------------
   Tela add áudio
   ---------------------------------------------------------------- */
function switchAddTab(tab) {
  document.getElementById('tab-file').classList.toggle('active', tab === 'file');
  document.getElementById('tab-default').classList.toggle('active', tab === 'default');
  document.getElementById('panel-file').classList.toggle('active', tab === 'file');
  document.getElementById('panel-default').classList.toggle('active', tab === 'default');
  if (tab === 'default') renderDefaultGrid();
}

/* ----------------------------------------------------------------
   Lista de sons integrados
   ---------------------------------------------------------------- */
function renderDefaultGrid() {
  var grid = document.getElementById('default-audio-grid');
  if (!grid) return;

  // IDs de sons ja adicionados
  var addedIds = state.audios.filter(function (a) { return a.isDefault; }).map(function (a) { return a.catalogId; });

  grid.innerHTML = DEFAULT_AUDIOS_CATALOG.map(function (d) {
    var isAdded = addedIds.indexOf(d.id) !== -1;
    return '<div class="default-audio-row' + (isAdded ? ' added' : '') + '">' +
      '<div class="default-audio-icon">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none">' +
      '<path d="M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
      '</div>' +
      '<div class="default-audio-info">' +
      '<div class="default-audio-name">' + _esc(d.name) + '</div>' +
      '<div class="default-audio-db">Faixa padrao: ' + d.dbMin + ' dB \u2014 ' + d.dbMax + ' dB</div>' +
      '</div>' +
      (isAdded
        ? '<div class="default-audio-btn added">Adicionado</div>'
        : '<button class="default-audio-btn" onclick="addDefaultAudio(\'' + d.id + '\')">Adicionar</button>'
      ) +
      '</div>';
  }).join('');
}

async function getFileSize(url) {
  const response = await fetch(url);
  const blob = await response.blob();

  const sizeKB = (blob.size / 1024).toFixed(2)
  
  if (parseFloat(sizeKB) < 1) return `${sizeKB} KB`;

  const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
  return `${sizeMB} MB`;
}

function addDefaultAudio(catalogId) {
  var d = DEFAULT_AUDIOS_CATALOG.find(function (x) { return x.id === catalogId; });
  if (!d) return;
  // Se já existe
  var exists = state.audios.some(function (a) { return a.catalogId === catalogId; });
  if (exists) { showToast('Som ja foi adicionado', 'warn'); return; }

  const src = 'static/audios/' + d.file;
  const size = await getFileSize(src);

  state.audios.push({
    id: catalogId + '_' + Date.now(),
    catalogId: catalogId,
    name: d.name,
    file: d.file,
    size: size,
    dbMin: d.dbMin,
    dbMax: d.dbMax,
    isDefault: true,
    src: src,
    addedAt: new Date().toLocaleDateString('pt-BR'),
  });

  saveToStorage();
  renderDefaultGrid();  // Atualiza botao para "Adicionado"
  showToast('"' + d.name + '" adicionado!', 'success');
}

/* ----------------------------------------------------------------
   Add áudio do dispositivo
   ---------------------------------------------------------------- */
function onFileSelected(input) {
  var file = input.files[0];
  var label = document.getElementById('file-pick-label');
  var span = document.getElementById('file-pick-text');
  if (file) {
    span.textContent = file.name;
    label.classList.add('has-file');
    // Pré-preenche nome caso vazio
    var nameEl = document.getElementById('new-audio-name');
    if (nameEl && !nameEl.value.trim()) {
      nameEl.value = file.name.replace(/\.[^.]+$/, '');
    }
  } else {
    span.textContent = 'Selecionar arquivo';
    label.classList.remove('has-file');
  }
}

function addAudio() {
  var name = _getVal('new-audio-name').trim();
  var fileEl = document.getElementById('new-audio-file');
  var file = fileEl && fileEl.files[0];
  var dbMin = parseInt(_getVal('new-db-min'));
  var dbMax = parseInt(_getVal('new-db-max'));

  if (!name) {
    showToast('Informe o nome do áudio', 'error');
    return;
  }
  if (!file) {
    showToast('Selecione um arquivo de áudio', 'error');
    return;
  }

  var ext = '.' + file.name.split('.').pop().toLowerCase();
  if (['.mp3', '.wav', '.wma'].indexOf(ext) === -1) {
    showToast('Formato invalido. Use MP3, WAV ou WMA', 'error');
    return;
  }
  var hasRange = !isNaN(dbMin) && !isNaN(dbMax);
  if (hasRange && dbMin >= dbMax) {
    showToast('dB mínimo deve ser menor que o máximo', 'error');
    return;
  }

  state.audios.push({
    id: 'user_' + Date.now(),
    catalogId: null,
    name: name,
    file: file.name,
    ext: ext,
    size: _fmtSize(file.size),
    dbMin: hasRange ? dbMin : null,
    dbMax: hasRange ? dbMax : null,
    isDefault: false,
    src: URL.createObjectURL(file),
    addedAt: new Date().toLocaleDateString('pt-BR'),
  });

  saveToStorage();
  showToast('"' + name + '" adicionado!', 'success');
  showScreen('audios');
}

/* ----------------------------------------------------------------
   Lista de áudios
   ---------------------------------------------------------------- */
function renderAudioList() {
  var container = document.getElementById('audio-list-container');
  if (!container) return;

  if (state.audios.length === 0) {
    container.innerHTML =
      '<div class="empty-musicas">' +
      '<svg width="52" height="52" viewBox="0 0 24 24" fill="none">' +
      '<path d="M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" stroke="var(--text3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
      '<p>Nenhum audio na lista</p>' +
      '<small>Toque o + para adicionar sons</small>' +
      '</div>';
    return;
  }

  container.innerHTML = state.audios.map(function (a, i) {
    var isPlaying = state.currentAudioIndex === i && state.isPlaying;
    var noteColor = isPlaying ? 'var(--accent)' : 'var(--text3)';
    return '<div class="audio-card' + (isPlaying ? ' audio-card--playing' : '') + '" data-index="' + i + '">' +
      '<div class="audio-card-thumb" onclick="playAudio(' + i + ')">' +
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none">' +
      '<path d="M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" stroke="' + noteColor + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
      (a.isDefault ? '<div class="default-badge">padrao</div>' : '') +
      '</div>' +
      '<div class="audio-card-info" onclick="playAudio(' + i + ')">' +
      '<div class="audio-card-name">' + _esc(a.name) + '</div>' +
      '<div class="audio-card-meta">' + _esc(a.file) + ' \u00b7 ' + a.size + '</div>' +
      '<div class="audio-card-db">' + (a.dbMin !== null ? 'Faixa: ' + a.dbMin + ' dB \u2014 ' + a.dbMax + ' dB' : 'Faixa: não definida') + '</div>' +
      '</div>' +
      '<button class="audio-dots-btn" onclick="openAudioOptions(' + i + ')" aria-label="Opcoes">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">' +
      '<circle cx="12" cy="5"  r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/>' +
      '</svg>' +
      '</button>' +
      '</div>';
  }).join('');
}

/* ----------------------------------------------------------------
   Opções do áudio
   ---------------------------------------------------------------- */
function openAudioOptions(index) {
  selectedAudioIndex = index;
  _setText('modal-options-title', state.audios[index].name);
  openModal('modal-audio-options');
}

function openRenameModal() {
  closeModal('modal-audio-options');
  if (selectedAudioIndex === null) return;
  _setVal('rename-input', state.audios[selectedAudioIndex].name);
  openModal('modal-rename');
}

function confirmRename() {
  var val = _getVal('rename-input').trim();
  if (!val) {
    showToast('Nome não pode ser vazio', 'error');
    return;
  }
  if (selectedAudioIndex === null) return;
  state.audios[selectedAudioIndex].name = val;
  renderAudioList();
  updateNowPlayingUI();
  saveToStorage();
  closeModal('modal-rename');
  showToast('Áudio renomeado!', 'success');
}

function openEditDbModal() {
  closeModal('modal-audio-options');
  if (selectedAudioIndex === null) return;
  var a = state.audios[selectedAudioIndex];
  _setVal('edit-db-min', a.dbMin !== null ? a.dbMin : '');
  _setVal('edit-db-max', a.dbMax !== null ? a.dbMax : '');
  openModal('modal-edit-db');
}

function confirmEditDb() {
  if (selectedAudioIndex === null) return;
  var dbMin = parseInt(_getVal('edit-db-min'));
  var dbMax = parseInt(_getVal('edit-db-max'));
  if (isNaN(dbMin) || isNaN(dbMax)) {
    showToast('Informe os dois valores de dB', 'error');
    return;
  }
  if (dbMin >= dbMax) {
    showToast('dB mínimo deve ser menor que o máximo', 'error');
    return;
  }
  state.audios[selectedAudioIndex].dbMin = dbMin;
  state.audios[selectedAudioIndex].dbMax = dbMax;
  renderAudioList();
  saveToStorage();
  closeModal('modal-edit-db');
  showToast('Faixa de dB atualizada!', 'success');
}

function removeAudio() {
  if (selectedAudioIndex === null) return;
  var a = state.audios[selectedAudioIndex];
  if (!a.isDefault && a.src && a.src.startsWith('blob:')) URL.revokeObjectURL(a.src);
  if (state.currentAudioIndex === selectedAudioIndex) _stopAudio();
  if (state.currentAudioIndex !== null && state.currentAudioIndex > selectedAudioIndex) state.currentAudioIndex--;
  var name = a.name;
  state.audios.splice(selectedAudioIndex, 1);
  selectedAudioIndex = null;
  renderAudioList();
  renderDefaultGrid();  // reabilita botão "Adicionar" se era áudio padrão
  saveToStorage();
  closeModal('modal-audio-options');
  showToast('"' + name + '" removido', 'info');
}

/* ----------------------------------------------------------------
   Reprodução
   ---------------------------------------------------------------- */
function _checkTriggers(db) {
  if (state.isPlaying) return;
  for (var i = 0; i < state.audios.length; i++) {
    var a = state.audios[i];
    if (a.dbMin !== null && a.dbMax !== null && db >= a.dbMin && db <= a.dbMax) {
      if (state.currentAudioIndex !== i) playAudio(i);
      return;
    }
  }
}

function playAudio(index) {
  if (index < 0 || index >= state.audios.length) return;
  if (_audioCtx && _audioCtx.state === 'suspended') _audioCtx.resume();
  var a = state.audios[index];
  _stopAudio();

  _audioEl = new Audio();
  _audioEl.src = a.src;
  _audioEl.loop = true;

  _audioEl.addEventListener('timeupdate', function () {
    if (!_audioEl || !_audioEl.duration || _audioEl.loop) return;
    var bar = document.getElementById('np-progress');
    if (bar) bar.style.width = (_audioEl.currentTime / _audioEl.duration * 100) + '%';
  });
  _audioEl.addEventListener('ended', function () {
    if (_audioEl && !_audioEl.loop) {
      state.isPlaying = false;
      renderAudioList();
      updateNowPlayingUI();
    }
  });
  _audioEl.addEventListener('error', function () {
    showToast('Erro ao carregar: ' + a.file, 'error');
    state.isPlaying = false;
    updateNowPlayingUI();
  });

  var promise = _audioEl.play();
  if (promise !== undefined) {
    promise.then(function () {
      state.currentAudioIndex = index;
      state.isPlaying = true;
      updateNowPlayingUI();
      renderAudioList();
    }).catch(function () {
      state.currentAudioIndex = index;
      state.isPlaying = false;
      updateNowPlayingUI();
      renderAudioList();
      showToast('Toque play para iniciar o audio', 'info');
    });
  } else {
    state.currentAudioIndex = index;
    state.isPlaying = true;
    updateNowPlayingUI();
    renderAudioList();
  }
}

function _stopAudio() {
  if (_audioEl) {
    _audioEl.pause();
    _audioEl.src = '';
    _audioEl = null;
  }
  state.isPlaying = false;
}

function togglePlayPause() {
  if (_audioCtx && _audioCtx.state === 'suspended') _audioCtx.resume();
  if (state.currentAudioIndex === null) {
    if (state.audios.length > 0) playAudio(0);
    else showToast('Nenhum audio disponivel', 'info');
    return;
  }
  if (!_audioEl) {
    playAudio(state.currentAudioIndex);
    return;
  }
  if (state.isPlaying) {
    _audioEl.pause();
    state.isPlaying = false;
  } else {
    _audioEl.play().then(function () {
      state.isPlaying = true;
      updateNowPlayingUI();
      renderAudioList();
    }).catch(function () {
      showToast('Toque a tela primeiro para permitir audio', 'warn');
    });
    return;
  }
  updateNowPlayingUI(); renderAudioList();
}

function restartAudio() {
  if (_audioCtx && _audioCtx.state === 'suspended') _audioCtx.resume();
  if (_audioEl) {
    _audioEl.currentTime = 0;
    _audioEl.play().catch(function () { });
    state.isPlaying = true;
  } else if (state.currentAudioIndex !== null) { playAudio(state.currentAudioIndex); }
  updateNowPlayingUI();
}

function updateNowPlayingUI() {
  var a = state.currentAudioIndex !== null ? state.audios[state.currentAudioIndex] : null;
  _setText('np-title', a ? a.name : 'Nome do áudio');
  _setText('np-meta', a ? a.file : 'Faixa em Decibéis');
  _setText('np-db-range', a && a.dbMin !== null ? a.dbMin + ' dB \u2014 ' + a.dbMax + ' dB' : '-- dB \u2014 -- dB');
  if (!a) {
    var bar = document.getElementById('np-progress');
    if (bar) bar.style.width = '0%';
  }
  var icon = document.getElementById('icon-playpause');
  if (icon) {
    icon.innerHTML = state.isPlaying
      ? '<path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor"/>'
      : '<path d="M8 5v14l11-7z" fill="currentColor"/>';
  }
}

/* ----------------------------------------------------------------
   Configurações
   ---------------------------------------------------------------- */
function saveBatNotify() {
  var val = parseInt(_getVal('bat-notify-input'));
  if (isNaN(val) || val < 0 || val > 100) {
    showToast('Valor deve estar entre 0 e 100', 'error');
    return;
  }
  state.batNotifyThreshold = val;
  saveToStorage();
  showToast('Configuração salva!', 'success');
}
function toggleEcoMode(checkbox) {
  state.ecoMode = checkbox.checked;
  updateEcoBadge();
  saveToStorage();
  showToast('Modo economia ' + (state.ecoMode ? 'ativado' : 'desativado'), 'info');
}
function saveEcoSettings() {
  var val = parseInt(_getVal('eco-threshold'));
  if (isNaN(val) || val < 0 || val > 100) {
    showToast('Valor deve estar entre 0 e 100', 'error');
    return;
  }
  state.ecoThreshold = val;
  saveToStorage();
  showToast('Configuração salva!', 'success');
}
function updateEcoBadge() {
  var badge = document.getElementById('eco-badge');
  if (!badge) return;
  badge.textContent = state.ecoMode ? 'Ativado' : 'Desativado';
  badge.classList.toggle('active', state.ecoMode);
}

/* ----------------------------------------------------------------
   Modais
   ---------------------------------------------------------------- */
function openModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.add('active');
}
function closeModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

/* ----------------------------------------------------------------
   Toast
   ---------------------------------------------------------------- */
function showToast(msg, type) {
  type = type || 'info';
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast-' + type + ' show';
  clearTimeout(_toastTimeout);
  _toastTimeout = setTimeout(function () { toast.className = ''; }, 3200);
}

/* ----------------------------------------------------------------
   Helpers
   ---------------------------------------------------------------- */
function _getVal(id) { var el = document.getElementById(id); return el ? el.value : ''; }
function _setVal(id, val) { var el = document.getElementById(id); if (el) el.value = val; }
function _setText(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; }
function _setChecked(id, bool) { var el = document.getElementById(id); if (el) el.checked = bool; }
function _clearField(id) { _setVal(id, ''); }
function _fmtSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}
function _esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}