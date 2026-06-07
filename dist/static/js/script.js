"use strict";

/* ================================================================
   SONS INTEGRADOS
   ================================================================ */
const DEFAULT_AUDIOS_CATALOG = [
  { id: 'white', name: 'Ruido Branco', icon: 'noise', desc: "Tom neutro suave", file: 'white.mp3', dbMin: 0, dbMax: 5 },
  { id: 'pink', name: 'Ruido Rosa', icon: 'softNoise', desc: "Espectro natural calmante", file: 'pink.mp3', dbMin: 6, dbMax: 10 },
  { id: 'rain', name: 'Chuva', icon: 'rain', desc: "Chuva suave", file: 'rain.mp3', dbMin: 11, dbMax: 15 },
  { id: 'forest', name: 'Floresta', icon: 'forest', desc: "Sons da natureza", file: 'forest.mp3', dbMin: 16, dbMax: 20 },
  { id: '432hz', name: '432 Hz', icon: 'tone', desc: "Tom de relaxamento", file: '432hz.mp3', dbMin: 21, dbMax: 25 },
  { id: '528hz', name: '528 Hz', icon: 'spark', desc: "Tom de regeneração", file: '528hz.mp3', dbMin: 26, dbMax: 30 },
  { id: 'ocean', name: 'Ondas do Mar', icon: 'ocean', desc: "Ondas tranquilas", file: 'ocean.mp3', dbMin: 31, dbMax: 35 },
  { id: 'piano', name: 'Piano Calmo', icon: 'piano', desc: "Piano calmo", file: 'piano.mp3', dbMin: 36, dbMax: 40 },
];

const DEFAULT_TRIGGERING_CATALOG = [
  { id: 'babycry', name: 'Bebê chorando', desc: 'Um bebê chorando', file: 'babycrying.mp3', db: 50 },
  { id: 'drill', name: 'Furadeira', desc: 'Som de uma furadeira', file: 'drill.mp3', db: 50 },
  { id: 'fireworks', name: 'Fogos de artifício', desc: 'Explosões de fogos de artifício', file: 'fireworks.mp3', db: 50 },
  { id: 'hairdryer', name: 'Secador de cabelo', desc: 'Som de secador de cabelo', file: 'hairdryer.mp3', db: 50 },
  { id: 'alarm', name: 'Alarme', desc: 'Alarme de desastre natural', file: 'mgalarm.mp3', db: 50 },
  { id: 'talking', name: 'Pessoas falando', desc: 'Sons de pessoas falando', file: 'peopletalking.mp3', db: 50 },
  { id: 'restaurant', name: 'Restaurante', desc: 'Sons de pessoas falando e comendo', file: 'restaurant.mp3', db: 50 },
  { id: 'subway', name: 'Metrô urbano', desc: 'Sons de uma estação de metrô', file: 'spsubway.mp3', db: 50 },
  { id: 'static', name: 'Estática de televisão', desc: 'Som de estática de televisão', file: 'static.mp3', db: 50 },
  { id: 'traffic', name: 'Tráfego urbano', desc: 'Som de carros em uma rua', file: 'traffic.mp3', db: 50 },
  { id: 'streets', name: 'Ruas urbanas', desc: 'Som atravessando uma rua urbana', file: 'urbanstreet.mp3', db: 50 },
]

function audioIconSVG(iconName) {
  const icons = {
    noise: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12h2m2-4v8m2-6v4m2-8v12m2-8v4m2-6v8m2-4h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 7.5h18M3 16.5h18" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".35"/></svg>',
    softNoise: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="12" r="1.6" fill="currentColor" opacity=".9"/><circle cx="12" cy="9" r="1.9" fill="currentColor" opacity=".8"/><circle cx="16.5" cy="13" r="1.5" fill="currentColor" opacity=".75"/><path d="M4 6.5h16M4 17.5h16" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".25"/></svg>',
    'soft-noise': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="12" r="1.6" fill="currentColor" opacity=".9"/><circle cx="12" cy="9" r="1.9" fill="currentColor" opacity=".8"/><circle cx="16.5" cy="13" r="1.5" fill="currentColor" opacity=".75"/><path d="M4 6.5h16M4 17.5h16" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".25"/></svg>',
    rain: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 15.5a4.5 4.5 0 1 1 1.5-8.75A5.5 5.5 0 0 1 18.5 9c0 .17 0 .33-.02.5A3.5 3.5 0 0 1 18 16H6z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 18v2M12 17v3M16 18v2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    forest: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l5 7h-3l4 6h-3l3 5H6l3-5H6l4-6H7l5-7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 20v-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    tone: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 19V6l12-3v13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    spark: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.8 5.3L19 10l-5.2 1.7L12 17l-1.8-5.3L5 10l5.2-1.7L12 3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8L18 16z" fill="currentColor" opacity=".75"/></svg>',
    brain: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 6a3 3 0 0 1 6 0c1.7 0 3 1.3 3 3a3 3 0 0 1-1.2 2.4A3 3 0 0 1 16 16a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3 3 3 0 0 1-1.8-5.6A3 3 0 0 1 9 6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    ocean: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 9c1.2 0 1.8-.8 2.6-1.4C7.5 7 8.4 6.5 10 6.5s2.5.5 3.4 1.1c.8.6 1.4 1.4 2.6 1.4s1.8-.8 2.6-1.4C19.5 7 20.4 6.5 22 6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4 13c1.2 0 1.8-.8 2.6-1.4C7.5 11 8.4 10.5 10 10.5s2.5.5 3.4 1.1c.8.6 1.4 1.4 2.6 1.4s1.8-.8 2.6-1.4C19.5 11 20.4 10.5 22 10.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4 17c1.2 0 1.8-.8 2.6-1.4C7.5 15 8.4 14.5 10 14.5s2.5.5 3.4 1.1c.8.6 1.4 1.4 2.6 1.4s1.8-.8 2.6-1.4C19.5 15 20.4 14.5 22 14.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    piano: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 6H19V3a1 1 0 0 0-1-1H14a1 1 0 0 0-1 1V6H11V3a1 1 0 0 0-1-1H6A1 1 0 0 0 5 3V6H2A1 1 0 0 0 1 7V21a1 1 0 0 0 1 1H22a1 1 0 0 0 1-1V7A1 1 0 0 0 22 6ZM15 4h2v7H15ZM7 4H9v7H7ZM21 20H17V15a1 1 0 0 0-2 0v5H9V15a1 1 0 0 0-2 0v5H3V8H5v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V8h2v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V8h2Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity=".25"></path></svg>'
  };
  return icons[iconName] || icons.tone;
}

/* ================================================================
   PERFIS
   ================================================================ */
const BUILTIN_PROFILES = {
  home: { id: 'home', name: 'Casa', sensitivity: 'low', cooldownFactor: 1.0, debounceFactor: 1.1, thresholdDelta: 0, dbOffsetDelta: 0 },
  school: { id: 'school', name: 'Escola', sensitivity: 'mid', cooldownFactor: 0.9, debounceFactor: 1.0, thresholdDelta: -2, dbOffsetDelta: -1 },
  work: { id: 'work', name: 'Trabalho', sensitivity: 'mid', cooldownFactor: 1.0, debounceFactor: 1.0, thresholdDelta: 2, dbOffsetDelta: 0 },
  transport: { id: 'transport', name: 'Transporte', sensitivity: 'high', cooldownFactor: 0.7, debounceFactor: 0.7, thresholdDelta: -6, dbOffsetDelta: -2 },
  sleep: { id: 'sleep', name: 'Sono', sensitivity: 'low', cooldownFactor: 1.8, debounceFactor: 1.6, thresholdDelta: -10, dbOffsetDelta: 1 },
};

const DEFAULT_PROFILE_BASE = {
  sensitivity: 'mid',
  cooldown: 3,
  debounce: 800,
  noiseNotifyThreshold: 80,
  dbOffset: 0,
};

const CALIBRATION_SEQUENCE = DEFAULT_TRIGGERING_CATALOG.map((item) => ({
  id: item.id,
  name: item.name,
  db: item.db,
  icon: item.icon,
  file: 'static/audios/triggering/' + item.file
}));

const SENSITIVITY_CONFIG = {
  low: { smoothing: 0.95, offsetMult: 0.8, cooldown: 5 },
  mid: { smoothing: 0.85, offsetMult: 1.0, cooldown: 3 },
  high: { smoothing: 0.70, offsetMult: 1.2, cooldown: 1 },
};

/* ================================================================
   ESTADO GLOBAL
   ================================================================ */
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
  useAudioSupressors: false,

  // Runtime
  audios: [],   // { id, name, isDefault, src (objectURL ou path), storedKey, volume, icon }
  triggers: [], // { id, name, dbMin, dbMax, audioId, volume, enabled }
  history: [],  // { type, text, db, timestamp }

  // Stats sessão
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
  dbStat: {
    max: null,
    avg: null,
    min: null,
    triggerCount: 0
  },

  // Calibração guiada
  calibrationIndex: 0,
  calibrationResponses: [],

  // Desenvolvimento
  debugMode: false,
  software: '1.0.0.0606.2008',
};

/* ================================================================
   VARIÁVEIS GLOBAIS
   ================================================================ */
let _audioEl = null;
let _audioCtxMic = null;
let _analyser = null;
let _micStream = null;
let _micActive = false;
let _dbRafId = null;
let _toastTimeout = null;
let _cooldownUntil = 0;
let _debounceTimer = null;
let _pendingDb = null;
let _previewEl = null;
let _currentTriggerAudioId = null;
let _statsInterval = null;

let selectedAudioId = null;
let editingTriggerId = null;

/* ================================================================
   INICIALIZAÇÃO
   ================================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  await initDB();
  loadConfig();
  applyTheme(state.theme);
  syncThemeSelect();
  await loadAudiosFromDB();
  loadTriggersFromStorage();
  loadHistoryFromStorage();

  renderAudioList();
  renderTriggerList();
  renderHistoryEvents();
  renderDefaultGrid();
  renderProfilesManager();
  renderCalibrationStep();
  renderNotificationPreviewOptions();
  updateNowPlayingUI();
  updateStatsUI();

  // Sliders
  setupSlider('new-audio-vol', 'new-audio-vol-val');
  setupSlider('trigger-vol-slider', 'trigger-vol-val');
  setupSlider('edit-vol-slider', 'edit-vol-val');

  showScreen('home');
  _setText('footer-sv', state.software);
});

/* ================================================================
   IndexedDB
   ================================================================ */
let _idb = null;

function initDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('earguard_db', 2);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('audios')) {
        db.createObjectStore('audios', { keyPath: 'id' });
      }
    };
    req.onsuccess = (e) => {
      _idb = e.target.result;
      resolve();
    };
    req.onerror = (e) => {
      console.warn('IndexedDB falhou: ' + e);
      resolve();
    }
  });
}

function idbPut(id, blob) {
  return new Promise((res) => {
    if (!_idb) return res();
    const tx = _idb.transaction('audios', 'readwrite');
    tx.objectStore('audios').put({ id, blob });
    tx.oncomplete = res;
    tx.onerror = res;
  })
}

function idbGet(id) {
  return new Promise((res) => {
    if (!_idb) return res(null);
    const tx = _idb.transaction('audios', 'readonly');
    const req = tx.objectStore('audios').get(id);
    req.onsuccess = () => res(req.result ? req.result.blob : null);
    req.onerror = () => res(null);
  });
}

function idbDelete(id) {
  return new Promise((res) => {
    if (!_idb) return res();
    const tx = _idb.transaction('audios', 'readwrite');
    tx.objectStore('audios').delete(id);
    tx.oncomplete = res;
    tx.onerror = res;
  });
}

async function loadAudiosFromDB() {
  const saved = JSON.parse(localStorage.getItem('earguard_audios') || '[]');
  const result = [];
  for (const meta of saved) {
    if (meta.isDefault) {
      _normalizeDefaultAudioMeta(meta);
      result.push(meta);
    } else {
      const blob = await idbGet(meta.storedKey);
      if (blob) {
        meta.src = URL.createObjectURL(blob);
        result.push(meta);
      }
    }
  }
  state.audios = result;
  saveAudioMeta();
}

function _normalizeDefaultAudioMeta(meta) {
  if (!meta || !meta.isDefault) return meta;
  if (typeof meta.id === 'string' && meta.id.startsWith('def_')) meta.id = meta.id.slice(4);
  return meta;
}

function saveAudioMeta() {
  const meta = state.audios.map(a => ({
    id: a.id,
    name: a.name,
    isDefault: a.isDefault,
    src: a.src,
    storedKey: a.storedKey,
    volume: a.volume,
    icon: a.icon,
    fileName: a.fileName,
  }));
  localStorage.setItem('earguard_audios', JSON.stringify(meta));
}

/* ================================================================
   CONFIGURAÇÃO / SALVAMENTO
   ================================================================ */
function loadConfig() {
  try {
    const raw = localStorage.getItem('earguard_config');
    if (!raw) return;
    const c = JSON.parse(raw);
    state.theme = c.theme || 'light';
    state.sensitivity = c.sensitivity || 'mid';
    state.cooldown = c.cooldown ?? 3;
    state.debounce = c.debounce ?? 800;
    state.dbOffset = c.dbOffset ?? 0;
    state.noiseNotifyThreshold = c.noiseNotifyThreshold ?? 80;
    state.notifyOnTrigger = c.notifyOnTrigger ?? true;
    state.activeProfile = c.activeProfile || null;
    state.profileBase = { ...DEFAULT_PROFILE_BASE, ...(c.profileBase || {}) };
    state.profileOverrides = c.profileOverrides || {};
    state.customProfiles = Array.isArray(c.customProfiles) ? c.customProfiles : [];
    state.calibrationIndex = c.calibrationIndex || 0;
    state.calibrationResponses = Array.isArray(c.calibrationResponses) ? c.calibrationResponses : [];

    // Sync inputs
    _setVal('cooldown-input', state.cooldown);
    _setVal('debounce-input', state.debounce);
    _setVal('offset-input', state.dbOffset);
    _setVal('cal-offset-input', state.dbOffset);
    _setVal('noise-notify-threshold', state.noiseNotifyThreshold);
    _setChecked('notify-trigger-toggle', state.notifyOnTrigger);

    // Sensibilidade
    document.querySelectorAll('.sens-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.val === state.sensitivity);
    })
  } catch (e) { }
}

function saveConfig() {
  localStorage.setItem('earguard_config', JSON.stringify({
    theme: state.theme,
    sensitivity: state.sensitivity,
    cooldown: state.cooldown,
    debounce: state.cooldown,
    dbOffset: state.dbOffset,
    noiseNotifyThreshold: state.noiseNotifyThreshold,
    notifyOnTrigger: state.notifyOnTrigger,
    activeProfile: state.activeProfile,
    profileBase: state.profileBase,
    profileOverrides: state.profileOverrides,
    customProfiles: state.customProfiles,
    calibrationIndex: state.calibrationIndex,
    calibrationResponses: state.calibrationResponses,
  }));
}

function _clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function _profileBaseSettings() {
  return { ...DEFAULT_PROFILE_BASE, ...state.profileBase };
}

function getProfileDefinition(profileId) {
  const builtin = BUILTIN_PROFILES[profileId];
  if (builtin) {
    const base = _profileBaseSettings();
    const override = state.profileOverrides[profileId] || {};
    return {
      ...builtin,
      ...override,
      id: profileId,
      builtIn: true,
      name: override.name || builtin.name,
      sensitivity: override.sensitivity || builtin.sensitivity || base.sensitivity,
      cooldown: override.cooldown ?? _clamp(Math.round(base.cooldown * builtin.cooldownFactor), 1, 60),
      debounce: override.debounce ?? _clamp(Math.round(base.debounce * builtin.debounceFactor), 100, 5000),
      noiseNotifyThreshold: override.noiseNotifyThreshold ?? _clamp(base.noiseNotifyThreshold + builtin.thresholdDelta, 0, 200),
      dbOffset: override.dbOffset ?? _clamp(base.dbOffset + builtin.dbOffsetDelta, -100, 100),
    };
  }
  const custom = state.customProfiles.find(profile => profile.id === profileId);
  if (!custom) return null;
  return { ...custom, builtIn: false };
}

function getAllProfiles() {
  return [
    ...Object.keys(BUILTIN_PROFILES).map(getProfileDefinition).filter(Boolean),
    ...state.customProfiles.map(profile => ({ ...profile, builtIn: false })),
  ];
}

function renderProfilesManager() {
  const container = document.getElementById('profiles-manager');
  if (!container) return;
  const profiles = getAllProfiles();
  if (profiles.length === 0) {
    container.innerHTML = '<p class="config-empty">Nenhum perfil disponível.</p>';
    return;
  }
  container.innerHTML = profiles.map(profile => `
    <div class="profile-asset-card ${state.activeProfile === profile.id ? 'active' : ''}">
      <div class="profile-asset-info">
        <div class="profile-asset-name">${_esc(profile.name)}</div>
        <div class="profile-asset-meta">${profile.sensitivity === 'low' ? 'Baixa' : profile.sensitivity === 'mid' ? 'Média' : 'Alta'} · ${profile.cooldown}s · ${profile.debounce}ms · ${profile.noiseNotifyThreshold} dB</div>
      </div>
      <div class="profile-asset-actions">
        <button class="config-select-btn" onclick="applyProfile('${_esc(profile.id)}')">Aplicar</button>
        <button class="config-select-btn" onclick="openProfileEditor('${_esc(profile.id)}')">Editar</button>
        ${profile.builtIn ? '' : `<button class="config-select-btn danger" onclick="deleteCustomProfile('${_esc(profile.id)}')">Excluir</button>`}
      </div>
    </div>
  `).join('');
}

function openProfileEditor(profileId) {
  const profile = profileId ? getProfileDefinition(profileId) : null;
  selectedAudioId = null;
  _setVal('profile-id-input', profile ? profile.id : '');
  _setVal('profile-name-input', profile ? profile.name : '');
  _setVal('profile-sensitivity-input', profile ? profile.sensitivity : state.sensitivity);
  _setVal('profile-cooldown-input', profile ? profile.cooldown : state.cooldown);
  _setVal('profile-debounce-input', profile ? profile.debounce : state.debounce);
  _setVal('profile-threshold-input', profile ? profile.noiseNotifyThreshold : state.noiseNotifyThreshold);
  _setVal('profile-offset-input', profile ? profile.dbOffset : state.dbOffset);
  openModal('modal-profile-editor');
}

function saveProfileEditor() {
  const profileId = _getVal('profile-id-input').trim();
  const name = _getVal('profile-name-input').trim();
  const sensitivity = _getVal('profile-sensitivity-input').trim();
  const cooldown = parseInt(_getVal('profile-cooldown-input'));
  const debounce = parseInt(_getVal('profile-debounce-input'));
  const threshold = parseInt(_getVal('profile-threshold-input'));
  const offset = parseInt(_getVal('profile-offset-input'));
  if (!name || !sensitivity || [cooldown, debounce, threshold, offset].some(Number.isNaN)) {
    showToast('Preencha os campos do perfil', 'error');
    return;
  }

  const profile = {
    id: profileId || ('profile_' + Date.now()),
    name,
    sensitivity,
    cooldown: _clamp(cooldown, 0, 120),
    debounce: _clamp(debounce, 100, 10000),
    noiseNotifyThreshold: _clamp(threshold, 0, 200),
    dbOffset: _clamp(offset, -100, 100),
    builtIn: false,
  };

  if (BUILTIN_PROFILES[profile.id]) {
    state.profileOverrides[profileId] = profile;
    state.activeProfile = profile.id;
  } else {
    const index = state.customProfiles.findIndex(item => item.id === profile.id);
    if (index >= 0) state.customProfiles[index] = profile;
    else state.customProfiles.push(profile);
    state.activeProfile = profile.id;
  }

  state.sensitivity = profile.sensitivity;
  state.cooldown = profile.cooldown;
  state.debounce = profile.debounce;
  state.noiseNotifyThreshold = profile.noiseNotifyThreshold;
  state.dbOffset = profile.dbOffset;

  _setVal('cooldown-input', state.cooldown);
  _setVal('debounce-input', state.debounce);
  _setVal('offset-input', state.dbOffset);
  _setVal('noise-notify-threshold', state.noiseNotifyThreshold);

  saveConfig();
  renderProfilesManager();

  closeModal('modal-profile-editor');
  showToast('Perfil salvo', 'success');
}

function deleteCustomProfile(profileId) {
  state.customProfiles = state.customProfiles.filter(profile => profile.id !== profileId);
  if (state.activeProfile === profileId) state.activeProfile = null;
  saveConfig();
  renderProfilesManager();
  showToast('Perfil removido', 'info');
}

function loadTriggersFromStorage() {
  state.triggers = JSON.parse(localStorage.getItem('earguard_triggers') || '[]');
}

function saveTriggersToStorage() {
  localStorage.setItem('earguard_triggers', JSON.stringify(state.triggers));
}

function loadHistoryFromStorage() {
  const saved = JSON.parse(localStorage.getItem('earguard_history') || '{}');
  state.history = saved.events || [];
  state.dbStat = saved.stats || { max: null, avg: null, min: null, triggerCount: 0 };
}

function saveHistoryToStorage() {
  localStorage.setItem('earguard_history', JSON.stringify({
    events: state.history.slice(-100),
    stats: state.dbStat,
  }));
}

/* ================================================================
   NAVEGAÇÃO
   ================================================================ */
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const screen = document.getElementById('screen-' + name);
  const nav = document.getElementById('nav-' + name);
  if (screen) screen.classList.add('active');
  if (nav) nav.classList.add('active');
  if (name === 'audios') renderAudioList();
  if (name === 'triggers') renderTriggerList();
  if (name === 'history') renderHistoryEvents();
  if (name === 'configurations') { renderProfilesManager(); renderNotificationPreviewOptions(); }
  if (name === 'calibration') renderCalibrationStep();
}

/* ================================================================
   TEMA
   ================================================================ */
function setTheme(val) {
  state.theme = val;
  applyTheme(val);
  saveConfig();
}
function applyTheme(val) {
  let effective = val;
  if (val === 'system') {
    effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.body.setAttribute('data-theme', effective);
}
function syncThemeSelect() {
  const sel = document.getElementById('theme-select');
  if (sel) sel.value = state.theme;
}

/* ================================================================
   MICROFONE
   ================================================================ */
async function requestMicPermission() {
  document.getElementById('permission-overlay').style.display = 'none';
  await _initMic();
}

function dismissPermission() {
  document.getElementById('permission-overlay').style.display = 'none';
  showToast('Monitoramento indisponível sem microfone', 'warn');
}

async function _initMic() {
  if (_micActive) return true;
  try {
    _micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: state.useAudioSupressors,
        noiseSuppression: state.useAudioSupressors,
        autoGainControl: false,
        channelCount: 1,
      }
    });

    _audioCtxMic = new (window.AudioContext || window.webkitAudioContext)();
    _analyser = _audioCtxMic.createAnalyser();
    _analyser.fftSize = 2048;
    _analyser.smoothingTimeConstant = SENSITIVITY_CONFIG[state.sensitivity].smoothing;
    const source = _audioCtxMic.createMediaStreamSource(_micStream);
    source.connect(_analyser);
    _micActive = true;
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/* ================================================================
   MONITORAMENTO
   ================================================================ */
async function startMonitoring() {
  if (state.monitoringActive) return;

  // Verificar permissão
  if (!_micActive) {
    const ok = await _initMic();
    if (!ok) {
      document.getElementById('permission-overlay').style.display = 'flex';
      return;
    }
  }

  if (_audioCtxMic && _audioCtxMic.state === 'suspended') await _audioCtxMic.resume();

  state.monitoringActive = true;
  state.sessionStart = Date.now();
  state.sessionDbValues = [];
  state.sessionTriggerCount = 0;
  state.sessionMaxDb = null;
  state.sessionWindows = [];
  state.currentWindow = {
    start: Date.now(),
    samples: [],
  };

  // Ajusta smoothing pela sensibilidade
  if (_analyser) _analyser.smoothingTimeConstant = SENSITIVITY_CONFIG[state.sensitivity].smoothing;

  document.getElementById('btn-start-monitor').style.display = 'none';
  document.getElementById('btn-stop-monitor').style.display = 'flex';
  document.getElementById('btn-reset-monitor').style.display = 'flex';
  document.getElementById('sensitivity-row').style.display = 'flex';
  document.getElementById('monitor-ring').classList.add('active');

  _startDbLoop();
  _startStatsInterval();

  addHistoryEvent('info', 'Monitoramento iniciado', null);
  showToast('Monitoramento iniciado', 'success');
}

function stopMonitoring() {
  if (!state.monitoringActive) return;
  state.monitoringActive = false;
  _finalizeSessionWindow(true);

  if (_dbRafId) {
    cancelAnimationFrame(_dbRafId);
    _dbRafId = null;
  }
  if (_statsInterval) {
    clearInterval(_statsInterval);
    _statsInterval = null;
  }

  document.getElementById('btn-start-monitor').style.display = 'flex';
  document.getElementById('btn-stop-monitor').style.display = 'none';
  document.getElementById('btn-reset-monitor').style.display = 'flex';
  document.getElementById('monitor-ring').classList.remove('active');
  document.getElementById('monitor-ring').classList.remove('alert');
  document.getElementById('monitor-bar-fill').style.width = '0%';

  addHistoryEvent('info', 'Monitoramento pausado', null);
  showToast('Monitoramento pausado', 'info');
}

function resetMonitoring() {
  stopMonitoring();
  state.sessionDbValues = [];
  state.sessionMaxDb = null;
  state.sessionTriggerCount = 0;
  state.sessionWindows = [];
  state.currentWindow = null;
  _setText('monitor-db', '--');
  _setText('stat-max', '--');
  _setText('stat-avg', '--');
  _setText('stat-triggers', '0');
  document.getElementById('btn-reset-monitor').style.display = 'none';
  document.getElementById('btn-start-monitor').style.display = 'flex';
  showToast('Monitoramento reiniciado', 'info');
}

function _startDbLoop() {
  if (!_analyser) return;
  const buffer = new Float32Array(_analyser.fftSize);
  var current = -1;

  const tick = () => {
    if (!state.monitoringActive) return;
    _dbRafId = requestAnimationFrame(tick);

    _analyser.getFloatTimeDomainData(buffer);
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
    const rms = Math.sqrt(sum / buffer.length);
    const dbFS = rms > 1e-10 ? 20 * Math.log10(rms) : -100;
    const sensOffset = (SENSITIVITY_CONFIG[state.sensitivity].offsetMult - 1) * 10;
    const db = Math.max(0, Math.round(dbFS + 80 + state.dbOffset + sensOffset));

    if (state.debugMode && db !== current) {
      console.info("dB: ", db);
      current = db;
    }

    updateDbUI(db);
    _checkTriggersDebounced(db);

    // Atualiza display calibração se aberta
    const calDisplay = document.getElementById('cal-db-live');
    if (calDisplay && document.getElementById('screen-calibration').classList.contains('active')) calDisplay.textContent = db;
  };

  tick();
}

function _startStatsInterval() {
  _statsInterval = setInterval(() => {
    if (!state.monitoringActive) return;
    const elapsed = Math.round((Date.now() - state.sessionStart) / 60000);
    _setText('stat-duration', elapsed + 'm');
  }, 10000);
}

function updateDbUI(db) {
  _setText('monitor-db', db);

  // Barra de nível
  const pct = Math.min(100, db);
  document.getElementById('monitor-bar-fill').style.width = pct + '%';

  // Alerta visual
  const ring = document.getElementById('monitor-ring');
  if (db >= state.noiseNotifyThreshold) {
    ring.classList.add('alert');
    if (!ring.dataset.alerted) {
      ring.dataset.alerted = '1';
      sendNotification('Ruído elevado: ' + db + ' dB');
    }
  } else {
    ring.classList.remove('alert');
    delete ring.dataset.alerted;
  }

  // Stats sessão
  state.sessionDbValues.push(db);
  if (state.sessionDbValues.length > 500) state.sessionDbValues.shift();
  if (state.sessionMaxDb === null || db > state.sessionMaxDb) {
    state.sessionMaxDb = db;
    _setText('stat-max', db);
  }
  const avg = Math.round(state.sessionDbValues.reduce((a, b) => a + b, 0) / state.sessionDbValues.length);
  _setText('stat-avg', avg);

  // Salva em histórico global
  if (state.dbStat.max === null || db > state.dbStat.max) state.dbStat.max = db;
  _captureSessionWindowSample(db);
}

/* ================================================================
   REPRODUÇÃO
   ================================================================ */
function playAudioById(audioId, volume) {
  const audio = state.audios.find(a => a.id === audioId);
  if (!audio || !audio.src) {
    showToast("Áudio indisponível", 'warn');
    return;
  }

  _stopAudio(true);

  _audioEl = new Audio();
  _audioEl.src = audio.src;
  _audioEl.loop = true;
  _audioEl.volume = volume !== undefined ? volume : (audio.volume || 100) / 100;

  // Fade in
  _audioEl.volume = 0;
  const targetVol = volume !== undefined ? volume : (audio.volume || 100) / 100;
  _audioEl.play().then(() => {
    state.isPlaying = true;
    state.currentAudioId = audioId;
    _fadeVolume(_audioEl, 0, targetVol, 800);
    updateNowPlayingUI();
    renderAudioList();
  }).catch(() => {
    state.isPlaying = true;
    state.currentAudioId = audioId;
    updateNowPlayingUI();
    renderAudioList();
    showToast('Toque play para iniciar', 'info');
  });

  _audioEl.addEventListener('error', () => {
    if (state.debugMode) showToast('Erro ao carregar áudio', 'error');
    state.isPlaying = false;
    updateNowPlayingUI();
  });

  _audioEl.addEventListener('timeupdate', () => {
    if (!_audioEl || !_audioEl.duration) return;
    const bar = document.getElementById('np-progress');
    if (bar) bar.style.width = (_audioEl.currentTime / _audioEl.duration * 100) + '%';
  });
}

function _fadeVolume(el, from, to, duration) {
  const steps = 20;
  const interval = duration / steps;
  const delta = (to - from) / steps;
  let current = from;
  let count = 0;
  const timer = setInterval(() => {
    current += delta;
    count++;
    if (el) el.volume = _clamp(current, 0, 1);
    if (count >= steps) clearInterval(timer);
  }, interval);
}

function _stopAudio(fade = false) {
  if (_audioEl) {
    if (fade) {
      _fadeVolume(_audioEl, _audioEl.volume, 0, 600);
      setTimeout(() => {
        if (_audioEl) {
          _audioEl.pause();
          _audioEl.src = '';
          _audioEl = null;
        }
      }, 650);
    } else {
      _audioEl.pause();
      _audioEl.src = '';
      _audioEl = null;
    }
  }
  state.isPlaying = false;
}

function stopAudioManual() {
  _stopAudio(true);
  state.currentAudioId = null;
  _currentTriggerAudioId = null;
  setTimeout(() => {
    updateNowPlayingUI();
    renderAudioList();
  }, 700);
}

function togglePlayPause() {
  if (!state.currentAudioId && state.audios.length > 0) {
    playAudioById(state.audios[0].id);
    return;
  }
  if (!state.currentAudioId) {
    showToast('Nenhum áudio na biblioteca', 'info');
    return;
  }
  if (!_audioEl) {
    playAudioById(state.currentAudioId);
    return;
  }
  if (state.isPlaying) {
    _audioEl.pause();
    state.isPlaying = false;
  } else {
    _audioEl.play().then(() => {
      state.isPlaying = true;
      updateNowPlayingUI();
      renderAudioList();
    }).catch(() => showToast('Toque a tela primeiro', 'warn'));
    return;
  }
  updateNowPlayingUI();
  renderAudioList();
}

function updateNowPlayingUI() {
  const a = state.currentAudioId ? state.audios.find(x => x.id === state.currentAudioId) : null;
  const card = document.getElementById('now-playing-card');

  _setText('np-title', a ? a.name : 'Nenhum áudio ativo');
  _setText('np-meta', a ? (a.fileName || 'Áudio integrado') : 'Aguardando gatilho...');

  if (!a) {
    const bar = document.getElementById('np-progress');
    if (bar) bar.style.width = '0%';
  }

  const icon = document.getElementById('icon-playpause');
  if (icon) {
    icon.innerHTML = state.isPlaying
      ? '<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>'
      : '<path d="M8 5v14l11-7z" fill="currentColor"/>';
  }

  if (card) card.classList.toggle('playing', state.isPlaying);

  const thumb = document.getElementById('np-thumb');
  if (thumb && a && a.icon) thumb.innerHTML = audioIconSVG(a.icon);
  else if (thumb) thumb.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18V6l12-3v12M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

/* ================================================================
   SENSIBILIDADE E PERFIS
   ================================================================ */
function setSensitivity(val) {
  state.sensitivity = val;
  state.activeProfile = null;
  if (_analyser) _analyser.smoothingTimeConstant = SENSITIVITY_CONFIG[val].smoothing;
  document.querySelectorAll('.sens-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.val === val);
  });
  saveConfig();
}

function applyProfile(key) {
  const p = getProfileDefinition(key);
  if (!p) return;
  state.sensitivity = p.sensitivity;
  state.cooldown = p.cooldown;
  state.debounce = p.debounce;
  state.noiseNotifyThreshold = p.noiseNotifyThreshold ?? state.noiseNotifyThreshold;
  state.dbOffset = p.dbOffset ?? state.dbOffset;
  state.activeProfile = key;

  if (_analyser) _analyser.smoothingTimeConstant = SENSITIVITY_CONFIG[p.sensitivity].smoothing;
  document.querySelectorAll('.sens-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.val === p.sensitivity);
  });

  _setVal('cooldown-input', state.cooldown);
  _setVal('debounce-input', state.debounce);
  _setVal('offset-input', state.dbOffset);
  _setVal('noise-notify-threshold', state.noiseNotifyThreshold);

  saveConfig();
  renderProfilesManager();
  showToast('Perfil "' + p.name + '" aplicado', 'success');
}

/* ================================================================
   CONFIGURAÇÕES
   ================================================================ */

function saveMonitorConfig() {
  const cooldown = parseInt(_getVal('cooldown-input'));
  const debounce = parseInt(_getVal('debounce-input'));
  const offset = parseInt(_getVal('offset-input'));
  if (isNaN(cooldown) || isNaN(debounce) || isNaN(offset)) {
    showToast('Valores inválidos', 'error');
    return;
  }
  state.cooldown = Math.max(0, Math.min(60, cooldown));
  state.debounce = Math.max(100, Math.min(5000, debounce));
  state.dbOffset = Math.max(-30, Math.min(30, offset));
  _setVal('cal-offset-input', state.dbOffset);
  saveConfig();
  showToast('Configurações salvas', 'success');
}

function saveNotifyConfig() {
  const threshold = parseInt(_getVal('noise-notify-threshold'));
  if (isNaN(threshold)) {
    showToast('Valor inválido', 'error');
    return;
  }
  state.noiseNotifyThreshold = _clamp(threshold, 0, 200);
  state.notifyOnTrigger = document.getElementById('notify-trigger-toggle').checked;
  saveConfig();
  requestNotificationPermission();
  showToast('Configurações salvas', 'success');
}

function renderNotificationPreviewOptions() {
  const select = document.getElementById('notify-preview-audio');
  if (!select) return;
  select.innerHTML = CALIBRATION_SEQUENCE.map(step => (
    `<option value="${step.id}">${_esc(step.name)} · ${step.db} dB</option>`
  )).join('');
  if (!select.value && CALIBRATION_SEQUENCE[0]) select.value = CALIBRATION_SEQUENCE[0].id;
}

function playNotifyPreview() {
  const stepId = _getVal('notify-preview-audio');
  const step = CALIBRATION_SEQUENCE.find(item => item.id === stepId) || CALIBRATION_SEQUENCE[0];
  if (!step) return;
  if (_previewEl) {
    _previewEl.pause();
    _previewEl = null;
  }
  _previewEl = new Audio(step.file);
  _previewEl.volume = 0.8;
  _previewEl.play().catch(() => { });
}

function saveCalibration() {
  const offset = parseInt(_getVal('cal-offset-input'));
  if (isNaN(offset)) {
    showToast('Valor inválido', 'error');
    return;
  }
  state.dbOffset = Math.max(-30, Math.min(30, offset));
  _setVal('offset-input', state.dbOffset);
  saveConfig();
  showToast('Offset salvo: ' + (state.dbOffset >= 0 ? '+' : '') + state.dbOffset + ' dB', 'success');
}

function startCalibrationFlow() {
  state.calibrationIndex = 0;
  state.calibrationResponses = [];
  renderCalibrationStep();
  showScreen('calibration');
}

function renderCalibrationStep() {
  const step = CALIBRATION_SEQUENCE[state.calibrationIndex];
  const total = CALIBRATION_SEQUENCE.length;
  const progress = document.getElementById('calibration-progress');
  const name = document.getElementById('calibration-audio-name');
  const db = document.getElementById('calibration-audio-db');
  const desc = document.getElementById('calibration-audio-desc');
  const counter = document.getElementById('calibration-counter');
  const rating = state.calibrationResponses[state.calibrationIndex]?.rating || 0;

  if (!step) {
    if (progress) progress.textContent = 'Pronto';
    if (name) name.textContent = 'Finalizado';
    if (db) db.textContent = '';
    if (desc) desc.textContent = 'Ajustes aplicados ao app.';
    if (counter) counter.textContent = `${total}/${total}`;
    _setText('calibration-step-help', 'Sua configuração foi aplicada. Você pode refazer quando quiser.');
    const nextBtn = document.getElementById('calibration-next-btn');
    if (nextBtn) {
      nextBtn.textContent = 'Reiniciar ajuste';
      nextBtn.onclick = startCalibrationFlow;
    }
    return;
  }

  if (progress) progress.textContent = `${state.calibrationIndex + 1}/${total}`;
  if (name) name.textContent = step.name;
  if (db) db.textContent = `${step.db} dB de referência`;
  if (desc) desc.textContent = 'Toque o áudio e marque o nível de incômodo.';
  if (counter) counter.textContent = `${state.calibrationIndex + 1}/${total}`;
  _setText('calibration-step-help', 'Escolha o quanto esse som incomoda você.');
  const nextBtn = document.getElementById('calibration-next-btn');
  if (nextBtn) {
    nextBtn.textContent = state.calibrationIndex === total - 1 ? 'Finalizar ajuste' : 'Próximo';
    nextBtn.onclick = nextCalibrationStep;
  }
  document.querySelectorAll('.calibration-rating-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.rating) === rating);
  });
}

function playCalibrationStep() {
  const step = CALIBRATION_SEQUENCE[state.calibrationIndex];
  if (!step) return;
  if (_previewEl) {
    _previewEl.pause();
    _previewEl = null;
  }
  _previewEl = new Audio(step.file);
  _previewEl.volume = 0.85;
  _previewEl.play().catch(() => { });
}

function setCalibrationRating(rating) {
  state.calibrationResponses[state.calibrationIndex] = {
    ...CALIBRATION_SEQUENCE[state.calibrationIndex],
    rating,
    timestamp: Date.now(),
  };
  renderCalibrationStep();
}

function nextCalibrationStep() {
  const step = CALIBRATION_SEQUENCE[state.calibrationIndex];
  if (!step) return;
  if (!state.calibrationResponses[state.calibrationIndex]) {
    showToast('Marque um nível de incômodo antes de avançar', 'warn');
    return;
  }
  if (state.calibrationIndex >= CALIBRATION_SEQUENCE.length - 1) {
    finishCalibrationFlow();
    return;
  }
  state.calibrationIndex += 1;
  renderCalibrationStep();
}

function finishCalibrationFlow() {
  const responses = state.calibrationResponses.filter(Boolean);
  if (responses.length === 0) {
    showToast('Ouça e avalie pelo menos um áudio', 'warn');
    return;
  }
  const averageRating = responses.reduce((sum, item) => sum + item.rating, 0) / responses.length;
  const averageDb = responses.reduce((sum, item) => sum + item.db, 0) / responses.length;
  const sensitivity = averageRating >= 3.8 ? 'high' : averageRating >= 2.6 ? 'mid' : 'low';
  state.profileBase = {
    sensitivity,
    cooldown: _clamp(Math.round(6 - averageRating), 1, 12),
    debounce: _clamp(Math.round(1500 - (averageRating * 220)), 300, 4000),
    noiseNotifyThreshold: _clamp(Math.round(averageDb + (5 - averageRating) * 6), 30, 120),
    dbOffset: _clamp(Math.round((averageRating - 3) * 2), -12, 12),
  };
  state.sensitivity = state.profileBase.sensitivity;
  state.cooldown = state.profileBase.cooldown;
  state.debounce = state.profileBase.debounce;
  state.noiseNotifyThreshold = state.profileBase.noiseNotifyThreshold;
  state.dbOffset = state.profileBase.dbOffset;
  state.activeProfile = null;
  state.calibrationIndex = CALIBRATION_SEQUENCE.length;
  _setVal('cooldown-input', state.cooldown);
  _setVal('debounce-input', state.debounce);
  _setVal('offset-input', state.dbOffset);
  _setVal('noise-notify-threshold', state.noiseNotifyThreshold);
  document.querySelectorAll('.sens-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.val === state.sensitivity);
  });
  saveConfig();
  renderProfilesManager();
  renderCalibrationStep();
  showToast('Ajuste aplicado ao app', 'success');
}

/* ================================================================
   NOTIFICAÇÕES
   ================================================================ */
async function requestNotificationPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') await Notification.requestPermission();
}

function sendNotification(text) {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  try {
    new Notification('EarGuard', { body: text, icon: '' });
  } catch (e) { }
}

/* ================================================================
   HISTÓRICO
   ================================================================ */
function addHistoryEvent(type, text, db, meta = {}) {
  const event = {
    type,
    text,
    db,
    timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    ...meta,
  };
  state.history.unshift(event);
  if (state.history.length > 100) state.history.pop();
  renderHistoryEvents();
  saveHistoryToStorage();
}

function renderHistoryEvents() {
  const container = document.getElementById('history-events-list');
  if (!container) return;
  if (state.history.length === 0) {
    container.innerHTML = '<div class="empty-state sm"><p>Nenhum evento registrado</p></div>';
    return;
  }
  container.innerHTML = state.history.slice(0, 30).map(e => `
    <div class="history-event ${e.type === 'session' ? 'session' : ''}">
      <div class="event-dot ${e.type === 'warn' ? 'warn' : e.type === 'success' ? 'success' : e.type === 'danger' ? 'danger' : e.type === 'session' ? 'session' : ''}"></div>
      <div class="event-info">
        <div class="event-text">${_esc(e.text)}${e.range ? ' · ' + _esc(e.range) : e.db ? ' (' + e.db + ' dB)' : ''}</div>
        <div class="event-time">${e.timestamp}</div>
      </div>
    </div>
  `).join('');
}

function clearHistory() {
  state.history = [];
  state.dbStat = { max: null, avg: null, triggerCount: 0 };
  state.sessionWindows = [];
  saveHistoryToStorage();
  renderHistoryEvents();
  updateStatsUI();
  showToast('Histórico apagado', 'info');
}

function updateStatsUI() {
  // Usa stats de sessão se disponíveis, senão globais
  const max = state.sessionMaxDb !== null ? state.sessionMaxDb : state.dbStat.max;
  const avg = state.sessionDbValues.length > 0
    ? Math.round(state.sessionDbValues.reduce((a, b) => a + b, 0) / state.sessionDbValues.length)
    : null;

  _setText('stat-max', max !== null ? max : '--');
  _setText('stat-avg', avg !== null ? avg : '--');
  _setText('stat-triggers', state.sessionTriggerCount || state.dbStat.triggerCount || 0);
}

function _timeLabel(timestamp) {
  return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function _captureSessionWindowSample(db) {
  if (!state.currentWindow) {
    state.currentWindow = { start: Date.now(), samples: [] };
  }
  state.currentWindow.samples.push(db);
  state.currentWindow.last = Date.now();

  const elapsed = Date.now() - state.currentWindow.start;
  if (elapsed >= 30 * 60 * 1000 && state.currentWindow.samples.length >= 3) {
    _finalizeSessionWindow(false);
    state.currentWindow = { start: Date.now(), samples: [db] };
  }
}

function _finalizeSessionWindow(isClosingSession) {
  if (!state.currentWindow || !state.currentWindow.samples || state.currentWindow.samples.length === 0) return;
  const samples = state.currentWindow.samples;
  const start = state.currentWindow.start;
  const end = state.currentWindow.last || Date.now();
  const average = Math.round(samples.reduce((sum, value) => sum + value, 0) / samples.length);
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const summary = {
    type: 'session',
    text: `${_timeLabel(start)} ~ ${_timeLabel(end)} · média ${average} dB`,
    db: average,
    timestamp: _timeLabel(end),
    range: `${min}–${max} dB`,
    start,
    end,
    average,
  };
  state.sessionWindows.push(summary);
  state.dbStat.avg = average;
  state.dbStat.triggerCount = state.sessionTriggerCount || state.dbStat.triggerCount || 0;
  addHistoryEvent('session', summary.text, average, { range: summary.range, start, end, average });
  saveHistoryToStorage();
  state.currentWindow = isClosingSession ? null : state.currentWindow;
}

/* ================================================================
   GATILHOS
   ================================================================ */
function _checkTriggersDebounced(db) {
  _pendingDb = db;
  clearTimeout(_debounceTimer);
  _debounceTimer = setTimeout(() => {
    _checkTriggers(_pendingDb);
  }, state.debounce);
}

function _checkTriggers(db) {
  const now = Date.now();
  if (now < _cooldownUntil) return;

  for (const trigger of state.triggers) {
    if (!trigger.enabled) continue;
    if (db >= trigger.dbMin && db <= trigger.dbMax) {
      if (_currentTriggerAudioId !== trigger.id) {
        _currentTriggerAudioId = trigger.id;
        _activateTrigger(trigger, db);
        _cooldownUntil = now + state.cooldown * 1000;
      }
      return;
    }
  }

  // Nenhum gatilho, se havia um ativo, para
  // Não para a música automaticamente
  if (_currentTriggerAudioId && state.isPlaying) {
    _currentTriggerAudioId = null;
  }
}

function _activateTrigger(trigger, db) {
  const audio = state.audios.find(a => a.id === trigger.audioId);

  console.log(JSON.stringify(state.audios, null, 2));
  if (!audio) return;

  const vol = (trigger.volume || 100) / 100;
  playAudioById(audio.id, vol);

  state.sessionTriggerCount++;
  state.dbStat.triggerCount = (state.dbStat.triggerCount || 0) + 1;
  _setText('stat-triggers', state.sessionTriggerCount);

  addHistoryEvent('success', `Gatilho "${trigger.name}" - ${audio.name}`, db);

  if (state.notifyOnTrigger) sendNotification(`Gatilho ativado: ${trigger.name}`);

  saveHistoryToStorage();
}

function renderTriggerList() {
  const container = document.getElementById('trigger-list-container');
  if (!container) return;

  if (state.triggers.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14h6M9 8h6M17 16h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <p>Nenhum gatilho configurado</p>
        <span>Adicione gatilhos para reproduzir sons automaticamente conforme o nível de ruído</span>
      </div>
      <button class="add-btn-primary" onclick="openAddTriggerModal()" style="margin-top:8px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        Criar primeiro gatilho
      </button>
    `;
    return;
  }

  container.innerHTML = state.triggers.map(t => {
    const audio = state.audios.find(a => a.id === t.audioId);
    const isActive = _currentTriggerAudioId === t.id;
    return `
      <div class="trigger-card ${!t.enabled ? 'disabled' : ''} ${isActive ? 'active-now' : ''}">
        <div class="trigger-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14h6M9 8h6M17 16h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="trigger-info">
          <div class="trigger-name">${_esc(t.name)}</div>
          <div class="trigger-meta">${t.dbMin}–${t.dbMax} dB · ${audio ? _esc(audio.name) : 'Áudio não encontrado'} · ${t.volume || 100}%</div>
        </div>
        <div class="trigger-actions">
          <label class="toggle" aria-label="Ativar/Desativar gatilho" onclick="event.stopPropagation()">
            <input type="checkbox" ${t.enabled ? 'checked' : ''} onchange="toggleTriggerEnabled('${_esc(t.id)}', this.checked)">
            <span class="toggle-track"></span>
          </label>
          <button class="trigger-edit-btn" onclick="openEditTriggerModal('${_esc(t.id)}')" aria-label="Editar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="trigger-edit-btn" onclick="deleteTrigger('${_esc(t.id)}')" aria-label="Excluir">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderTriggerAudioSelect() {
  const sel = document.getElementById('trigger-audio-select');
  if (!sel) return;
  const current = sel.value;
  sel.innerHTML = '<option value="">Selecionar áudio...</option>' +
    state.audios.map(a => `<option value="${_esc(a.id)}">${_esc(a.name)}</option>`).join('');
  if (current) sel.value = current;
}

function openAddTriggerModal() {
  editingTriggerId = null;
  _setText('modal-trigger-title', 'Novo Gatilho');
  _clearField('trigger-name-input');
  _clearField('trigger-db-min');
  _clearField('trigger-db-max');
  renderTriggerAudioSelect();
  document.getElementById('trigger-audio-select').value = '';
  _setVal('trigger-vol-slider', 100);
  _setText('trigger-vol-val', '100%');
  _setChecked('trigger-enabled-toggle', true);
  openModal('modal-trigger');
}

function openEditTriggerModal(id) {
  const t = state.triggers.find(x => x.id === id);
  if (!t) return;
  editingTriggerId = id;
  _setText('modal-trigger-title', 'Editar Gatilho');
  _setVal('trigger-name-input', t.name);
  _setVal('trigger-db-min', t.dbMin);
  _setVal('trigger-db-max', t.dbMax);
  renderTriggerAudioSelect();
  document.getElementById('trigger-audio-select').value = t.audioId || '';
  const vol = t.volume || 100;
  _setVal('trigger-vol-slider', vol);
  _setText('trigger-vol-val', vol + '%');
  _setChecked('trigger-enabled-toggle', t.enabled !== false);
  openModal('modal-trigger');
}

function saveTrigger() {
  const name = _getVal('trigger-name-input').trim();
  const dbMin = parseInt(_getVal('trigger-db-min'));
  const dbMax = parseInt(_getVal('trigger-db-max'));
  const audioId = _getVal('trigger-audio-select');
  const volume = parseInt(_getVal('trigger-vol-slider')) || 100;
  const enabled = document.getElementById('trigger-enabled-toggle').checked;

  if (!name) {
    showToast('Digite um nome', 'error');
    return;
  } else if (isNaN(dbMin) || isNaN(dbMax)) {
    showToast('Informe os valores de dB', 'error');
    return;
  } else if (dbMin >= dbMax) {
    showToast('dB mínimo deve ser menor que o máximo', 'error');
    return;
  } else if (!audioId) {
    showToast('Selecione um áudio', 'error');
    return;
  }

  if (editingTriggerId) {
    const t = state.triggers.find(x => x.id === editingTriggerId);
    if (t) {
      t.name = name;
      t.dbMin = dbMin;
      t.dbMax = dbMax;
      t.audioId = audioId;
      t.volume = volume;
      t.enabled = enabled;
    }
  } else {
    state.triggers.push({
      id: 'trig_' + Date.now(),
      name,
      dbMin,
      dbMax,
      audioId,
      volume,
      enabled,
    });
  }

  saveTriggersToStorage();
  renderTriggerList();
  closeModal('modal-trigger');
  showToast(editingTriggerId ? 'Gatilho atualizado' : 'Gatilho criado!', 'success');
}

function toggleTriggerEnabled(id, enabled) {
  const t = state.triggers.find(x => x.id === id);
  if (t) {
    t.enabled = enabled;
    saveTriggersToStorage();
    renderTriggerList();
  }
}

function deleteTrigger(id) {
  const idx = state.triggers.findIndex(x => x.id === id);
  if (idx !== -1) {
    state.triggers.splice(idx, 1);
    saveTriggersToStorage();
    renderTriggerList();
    showToast('Gatilho excluído', 'info');
  }
}

/* ================================================================
   ADICIONAR ÁUDIO
   ================================================================ */
function switchAddTab(tab) {
  document.querySelectorAll('.add-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.add-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.getElementById('panel-' + tab).classList.add('active');
}

function onFileSelected(input) {
  const file = input.files[0];
  if (!file) return;
  const label = document.getElementById('file-pick-label');
  const text = document.getElementById('file-pick-text');
  if (text) text.textContent = file.name;
  if (label) label.classList.add('has-file');
  // Auto-preenche nome se vazio
  const nameInput = document.getElementById('new-audio-name');
  if (nameInput && !nameInput.value) nameInput.value = file.name.replace(/\.[^/.]+$/, '');
}

async function addAudio() {
  const name = _getVal('new-audio-name').trim();
  const fileInput = document.getElementById('new-audio-file');
  const file = fileInput && fileInput.files[0];
  const vol = parseInt(_getVal('new-audio-vol')) || 100;

  if (!name) {
    showToast('Digite um nome', 'error');
    return;
  }
  if (!file) {
    showToast('Selecione um arquivo', 'error');
    return;
  }

  const id = 'usr_' + Date.now();
  const storedKey = 'audio_' + id;

  // Salva blob no IndexedDB
  await idbPut(storedKey, file);
  const src = URL.createObjectURL(file);

  state.audios.push({
    id,
    name,
    isDefault: false,
    src,
    storedKey,
    volume: vol,
    icon: 'tone',
    fileName: file.name,
  });

  saveAudioMeta();
  renderAudioList();
  renderTriggerAudioSelect();

  // Reset form
  _clearField('new-audio-name');
  fileInput.value = '';
  _setText('file-pick-text', 'Selecionar arquivo');
  const label = document.getElementById('file-pick-label');
  if (label) label.classList.remove('has-file');
  _setVal('new-audio-vol', 100);
  _setText('new-audio-vol-val', '100%');

  showScreen('audios');
  showToast(`"${name}" adicionado!`, 'success');
}

function renderDefaultGrid() {
  const container = document.getElementById('default-audio-grid');
  if (!container) return;
  container.innerHTML = DEFAULT_AUDIOS_CATALOG.map(def => {
    const alreadyAdded = state.audios.some(a => a.id === def.id);
    return `
      <div class="default-audio-item ${alreadyAdded ? 'added' : ''}" onclick="${alreadyAdded ? '' : `addDefaultAudio('${def.id}')`}">
        <div class="default-audio-icon">${audioIconSVG(def.icon)}</div>
        <div class="default-audio-info">
          <div class="default-audio-name">${_esc(def.name)}</div>
          <div class="default-audio-range">${def.desc}</div>
        </div>
        <span class="default-audio-action">${alreadyAdded ? 'Adicionado' : 'Adicionar'}</span>
      </div>
    `;
  }).join('');
}

function addDefaultAudio(defId) {
  const def = DEFAULT_AUDIOS_CATALOG.find(d => d.id === defId);
  if (!def) return;
  if (state.audios.some(a => a.id === defId)) {
    showToast('Já adicionado', 'warn');
    return;
  }

  console.log(def.file, defId);

  const src = './static/audios/' + (def.file || defId + '.mp3');

  console.log(src);

  state.audios.push({
    id: def.id,
    name: def.name,
    isDefault: true,
    src,
    storedKey: null,
    volume: 70,
    icon: def.icon,
    fileName: null,
  });

  saveAudioMeta();
  renderDefaultGrid();
  renderAudioList();
  renderTriggerAudioSelect();
  showToast('"' + def.name + '" adicionado!', 'success');
}

/* ================================================================
   GATILHOS
   ================================================================ */


/* ================================================================
   LISTA DE ÁUDIOS
   ================================================================ */
function renderAudioList() {
  const container = document.getElementById('audio-list-container');
  if (!container) return;

  if (state.audios.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M9 18V6l12-3v12M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <p>Biblioteca vazia</p>
        <span>Adicione sons do dispositivo ou escolha sons integrados</span>
      </div>
      <button class="add-btn-primary" onclick="showScreen('add-audio')" style="margin-top:8px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        Adicionar primeiro áudio
      </button>
    `;
    return;
  }

  container.innerHTML = state.audios.map(a => {
    var isPlaying = state.currentAudioIndex === a.id && state.isPlaying;
    return `
      <div class="audio-card ${isPlaying ? 'audio-card--playing' : ''}" onclick="onAudioCardClick('${_esc(a.id)}')">
        <div class="audio-card-thumb">
          ${a.icon ? audioIconSVG(a.icon) : playIconSVG(isPlaying)}
        </div>
        <div class="audio-card-info">
          <div class="audio-card-name">${_esc(a.name)}</div>
          <div class="audio-card-meta">
            ${a.isDefault ? '<span class="default-badge">INTEGRADO</span>' : ''}
            <span>${a.fileName || ''}</span>
          </div>
        </div>
        <button class="audio-card-options" onclick="event.stopPropagation(); openAudioOptions('${_esc(a.id)}')" aria-label="Opções">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>
      </div>
    `;
  }).join('');
}

function playIconSVG(active) {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 18V6l12-3v12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`;
}

function onAudioCardClick(audioId) {
  if (state.currentAudioId === audioId && state.isPlaying) {
    _audioEl && _audioEl.pause();
    state.isPlaying = false;
    updateNowPlayingUI();
    renderAudioList();
  } else playAudioById(audioId);
}

function openAudioOptions(audioId) {
  selectedAudioId = audioId;
  const a = state.audios.find(x => x.id === audioId);
  if (a) _setText('modal-options-title', a.name);
  openModal('modal-audio-options')
}

function previewSelectedAudio() {
  closeModal('modal-audio-options');
  if (!selectedAudioId) return;
  playAudioById(selectedAudioId);
  showScreen('home');
}

function openRenameModal() {
  closeModal('modal-audio-options');
  if (!selectedAudioId) return;
  const a = state.audios.find(x => x.id === selectedAudioId);
  if (a) _setVal('rename-input', a.name);
  openModal('modal-rename');
}

function confirmRename() {
  if (!selectedAudioId) return;
  const val = _getVal('rename-input').trim();
  if (!val) {
    showToast('Digite um nome', 'error');
    return;
  }
  const a = state.audios.find(x => x.id === selectedAudioId);
  if (a) { a.name = val; }
  saveAudioMeta();
  renderAudioList();
  updateNowPlayingUI();
  closeModal('modal-rename');
  showToast('Renomeado!', 'success');
}

function openEditVolumeModal() {
  closeModal('modal-audio-options');
  if (!selectedAudioId) return;
  const a = state.audios.find(x => x.id === selectedAudioId);
  const vol = a ? (a.volume || 100) : 100;
  const slider = document.getElementById('edit-vol-slider');
  if (slider) {
    slider.value = vol;
    _setText('edit-vol-val', vol + '%');
  }
  openModal('modal-edit-volume');
}

function confirmEditVolume() {
  if (!selectedAudioId) return;
  const vol = parseInt(_getVal('edit-vol-slider'));
  const a = state.audios.find(x => x.id === selectedAudioId);
  if (a) { a.volume = vol; }
  if (_audioEl && state.currentAudioId === selectedAudioId) {
    _audioEl.volume = vol / 100;
  }
  saveAudioMeta();
  closeModal('modal-edit-volume');
  showToast('Volume salvo', 'success');
}

async function removeAudio() {
  if (!selectedAudioId) return;
  const idx = state.audios.findIndex(x => x.id === selectedAudioId);
  if (idx === -1) return;
  const a = state.audios[idx];

  if (state.currentAudioId === selectedAudioId) stopAudioManual();
  if (a.storedKey) await idbDelete(a.storedKey);
  if (!a.isDefault && a.src && a.src.startsWith('blob:')) URL.revokeObjectURL(a.src);

  state.audios.splice(idx, 1);
  selectedAudioId = null;
  saveAudioMeta();
  renderAudioList();
  renderDefaultGrid();
  closeModal('modal-audio-options');
  showToast('Áudio removido', 'info');
}

/* ================================================================
   MODAIS
   ================================================================ */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

/* ================================================================
   TOAST
   ================================================================ */
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast-' + type + ' show';
  clearTimeout(_toastTimeout);
  _toastTimeout = setTimeout(() => { toast.className = ''; }, 3000);
}

/* ================================================================
   SLIDERS
   ================================================================ */
function setupSlider(sliderId, valId) {
  const slider = document.getElementById(sliderId);
  const valEl = document.getElementById(valId);
  if (!slider || !valEl) return;
  slider.addEventListener('input', () => {
    valEl.textContent = slider.value + '%';
  });
}

/* ================================================================
   HELPERS DOM
   ================================================================ */
function _getVal(id) { const el = document.getElementById(id); return el ? el.value : ''; }
function _setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val; }
function _setText(id, txt) { const el = document.getElementById(id); if (el) el.textContent = txt; }
function _setChecked(id, bool) { const el = document.getElementById(id); if (el) el.checked = bool; }
function _clearField(id) { _setVal(id, ''); }
function _esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
