"use strict";

/*import {
  CapacitorAudioRecorder,
  RecordingStatus,
} from '@capgo/capacitor-audio-recorder';
 

*/

const EarGuard = Capacitor.Plugins.EarGuard;

/* ----------------------------------------------------------------
   Sons integrados disponiveis
   ---------------------------------------------------------------- */
const DEFAULT_AUDIOS_CATALOG = [
  { id: 'default_ruido_branco', name: 'Ruido Branco', file: 'branco.mp3', dbMin: 0, dbMax: 10 },
  { id: 'default_ruido_rosa', name: 'Ruido Rosa', file: 'rosa.mp3', dbMin: 11, dbMax: 20 },
  { id: 'default_chuva', name: 'Chuva', file: 'chuva.mp3', dbMin: 21, dbMax: 30 },
  { id: 'default_floresta', name: 'Floresta', file: 'floresta.wav', dbMin: 31, dbMax: 40 },
  { id: 'default_432hz', name: '432 Hz', file: '432hz.wav', dbMin: 41, dbMax: 50 },
  { id: 'default_528hz', name: '528 Hz', file: '528hz.wav', dbMin: 51, dbMax: 60 },
  { id: 'default_40hz', name: '40 Hz Gamma', file: '40hz.wav', dbMin: 61, dbMax: 70 },
];

/* ----------------------------------------------------------------
   Estado global
   ---------------------------------------------------------------- */
const state = {
  theme: 'dark',
  connection: 'disconnected',
  deviceId: null,
  firmware: '0.7.2.41219',
  battery: 78,
  decibels: null,
  isPlaying: false,
  currentAudioIndex: null,
  audios: [],
  batNotifyThreshold: 20,
  ecoMode: false,
  ecoThreshold: 0,
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

EarGuard.start();

setInterval(async () => {


  const r = await EarGuard.getCurrentDb();

  console.log('DB=', r.db);

}, 1000);

console.log(JSON.stringify(Object.keys(window.Capacitor?.Plugins || {})));

/* ----------------------------------------------------------------
   Boot
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
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
   Bluetooth
   ---------------------------------------------------------------- */
function pairHeadset() {
  showToast("Ainda será implementado", "warn");
}
function updateConnectionUI() {
  var connText = document.getElementById('cfg-conn-text');
  var authText = document.getElementById('cfg-auth-text');
  var footerId = document.getElementById('footer-device-id');
  if (!connText) return;
  if (state.connection === 'authorized') {
    connText.textContent = 'Conectado';
    connText.className = 'status-val connected';
    if (authText) authText.textContent = '(autorizado)';
  } else if (state.connection === 'connected') {
    connText.textContent = 'Conectado';
    connText.className = 'status-val connected';
    if (authText) authText.textContent = '(nao autorizado)';
  } else {
    connText.textContent = 'Desconectado';
    connText.className = 'status-val disconnected';
    if (authText) authText.textContent = '';
  }
  if (footerId) footerId.textContent = state.deviceId || '\u2014';
  var pairBtn = document.querySelector('.pair-btn');
  if (pairBtn) pairBtn.textContent = state.connection !== 'disconnected' ? 'Desconectar Headset' : 'Parear Headset via Bluetooth';
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

function addDefaultAudio(catalogId) {
  var d = DEFAULT_AUDIOS_CATALOG.find(function (x) { return x.id === catalogId; });
  if (!d) return;
  // Se já existe
  var exists = state.audios.some(function (a) { return a.catalogId === catalogId; });
  if (exists) { showToast('Som ja foi adicionado', 'warn'); return; }

  state.audios.push({
    id: catalogId + '_' + Date.now(),
    catalogId: catalogId,
    name: d.name,
    file: d.file,
    ext: '.wav',
    size: '~2.5 MB',
    dbMin: d.dbMin,
    dbMax: d.dbMax,
    isDefault: true,
    src: 'static/audios/' + d.file,
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