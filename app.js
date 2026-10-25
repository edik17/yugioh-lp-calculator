// ============================================================================
// DUEL DISK PRO // Yu-Gi-Oh! Life Points & Tactical Companion
// ============================================================================

const STORAGE_KEY = 'yugioh_duel_disk_state_v1';

// Default Initial State
function createDefaultState(startLp = 8000) {
  return {
    startLp,
    soundEnabled: true,
    soundProfile: 'dm', // 'dm' | 'gx' | 'md'
    soundVolume: 0.85,
    tabletopMode: false,
    turn: 1,
    activePlayer: 1,
    phase: 'DP',
    nibiruCount: 0,
    timerDurationSec: 45 * 60,
    timerRemainingSec: 45 * 60,
    players: {
      1: {
        name: 'Giocatore 1',
        lp: startLp,
        stars: 0,
        flags: { ns: false, lock: false, droll: false, shifter: false, maxxc: false },
        markers: [
          { id: 'c-init-1', type: 'counter', name: 'Segnalino Magia', icon: '✨', count: 0 }
        ]
      },
      2: {
        name: 'Giocatore 2',
        lp: startLp,
        stars: 0,
        flags: { ns: false, lock: false, droll: false, shifter: false, maxxc: false },
        markers: [
          { id: 'c-init-2', type: 'counter', name: 'Segnalino Kaiju', icon: '🦖', count: 0 }
        ]
      }
    },
    log: [
      {
        id: Date.now(),
        turn: 1,
        phase: 'DP',
        player: 0,
        text: `Duello iniziato! (${startLp} LP)`,
        time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    ]
  };
}

let state = loadState();
let undoStack = [];
let redoStack = [];

// Calculator transient state
let calcTargetPlayer = 1;
let calcMode = 'sub'; // 'sub' | 'add' | 'half' | 'set'
let calcInputStr = '0';

// Counter/Token modal target player
let markerTargetPlayer = 1;

// Tournament Timer interval
let timerInterval = null;
let timerRunning = false;

// ============================================================================
// 1. WEB AUDIO SYNTHESIZER (AUTHENTIC YU-GI-OH! ANIME LP COUNTER & DAMAGE SFX)
// ============================================================================
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function getMasterVolume() {
  return typeof state.soundVolume === 'number' ? state.soundVolume : 0.85;
}

function createNoiseBuffer(ctx, durationSec = 0.5) {
  const sampleRate = ctx.sampleRate;
  const frameCount = Math.floor(sampleRate * durationSec);
  const buffer = ctx.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function triggerScreenDamageEffect(type = 'red', heavyShake = false) {
  const overlay = document.getElementById('damageFlashOverlay');
  if (overlay) {
    overlay.classList.remove('flash-red', 'flash-electric');
    void overlay.offsetWidth;
    overlay.classList.add(type === 'electric' ? 'flash-electric' : 'flash-red');
  }
  if (heavyShake) {
    const arena = document.getElementById('duelArena');
    if (arena) {
      arena.classList.remove('arena-heavy-shake');
      void arena.offsetWidth;
      arena.classList.add('arena-heavy-shake');
    }
  }
}

// 1A. Monster Attack / Damage Explosion Impact SFX
function playDamageImpactSfx(damageAmount = 1000) {
  if (!state.soundEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;

  const vol = getMasterVolume();
  const now = ctx.currentTime;
  const isHeavy = damageAmount >= 1500;

  // Sub-bass shockwave boom
  const subOsc = ctx.createOscillator();
  const subGain = ctx.createGain();
  subOsc.type = 'sawtooth';
  subOsc.frequency.setValueAtTime(isHeavy ? 165 : 130, now);
  subOsc.frequency.exponentialRampToValueAtTime(28, now + (isHeavy ? 0.42 : 0.26));

  subGain.gain.setValueAtTime(0.38 * vol, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + (isHeavy ? 0.45 : 0.28));
  subOsc.connect(subGain);
  subGain.connect(ctx.destination);
  subOsc.start(now);
  subOsc.stop(now + (isHeavy ? 0.46 : 0.29));

  // Explosive filtered noise burst
  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = createNoiseBuffer(ctx, isHeavy ? 0.48 : 0.28);
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(isHeavy ? 1100 : 1400, now);
  filter.frequency.exponentialRampToValueAtTime(180, now + (isHeavy ? 0.44 : 0.25));
  filter.Q.value = 1.8;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.42 * vol, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + (isHeavy ? 0.46 : 0.27));

  noiseSrc.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noiseSrc.start(now);

  // High-voltage electric crackle on direct hit
  const zapOsc = ctx.createOscillator();
  const zapGain = ctx.createGain();
  zapOsc.type = 'square';
  zapOsc.frequency.setValueAtTime(2600, now);
  zapOsc.frequency.exponentialRampToValueAtTime(320, now + 0.14);
  zapGain.gain.setValueAtTime(0.16 * vol, now);
  zapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  zapOsc.connect(zapGain);
  zapGain.connect(ctx.destination);
  zapOsc.start(now);
  zapOsc.stop(now + 0.16);
}

// 1B. Half LP (÷2 Solemn Judgment / Dinomorphia) Laser Guillotine Slash SFX
function playSlashHalfSfx() {
  if (!state.soundEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;

  const vol = getMasterVolume();
  const now = ctx.currentTime;

  // Metallic laser slice sweep
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sawtooth';
  osc2.type = 'square';
  osc1.frequency.setValueAtTime(3400, now);
  osc1.frequency.exponentialRampToValueAtTime(140, now + 0.28);
  osc2.frequency.setValueAtTime(1700, now);
  osc2.frequency.exponentialRampToValueAtTime(70, now + 0.28);

  gain.gain.setValueAtTime(0.32 * vol, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.31);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.32);
  osc2.stop(now + 0.32);
}

// 1C. Iconic Yu-Gi-Oh! Anime Life Point Counter Cascade Tick
function playAnimeLpTick(isHeal = false, stepIdx = 0) {
  if (!state.soundEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;

  const vol = getMasterVolume();
  const now = ctx.currentTime;
  const profile = state.soundProfile || 'dm';

  if (isHeal) {
    // Shimmering crystal recovery cascade
    const healNotes = [1046.5, 1318.5, 1567.98, 2093.0];
    const freq = healNotes[stepIdx % healNotes.length];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.15, now + 0.05);
    gain.gain.setValueAtTime(0.18 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
    return;
  }

  if (profile === 'dm') {
    // Classic Yu-Gi-Oh! Duel Monsters ("Pi-ri-ri-ri-ri-ri!") dual metallic chime
    const dmNotes = [1864.66, 2489.02, 2217.46, 2793.83];
    const baseFreq = dmNotes[stepIdx % dmNotes.length];

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'square';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc2.frequency.setValueAtTime(baseFreq * 1.5, now);

    gain.gain.setValueAtTime(0.16 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.042);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.045);
    osc2.stop(now + 0.045);
  } else if (profile === 'gx') {
    // Yu-Gi-Oh! GX / 5D's digital Duel Disk counter
    const gxNotes = [1567.98, 2093.0, 1760.0];
    const freq = gxNotes[stepIdx % gxNotes.length];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.setValueAtTime(freq * 0.85, now + 0.02);
    gain.gain.setValueAtTime(0.15 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.042);
  } else {
    // Master Duel modern cyber tick
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1318.5, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.032);
    gain.gain.setValueAtTime(0.2 * vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.038);
  }
}

// 1D. Iconic Anime LP Counter Stop Lock Chime ("PI-PI -> TING!")
function playLpStopChime(isHeal = false) {
  if (!state.soundEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;

  const vol = getMasterVolume();
  const now = ctx.currentTime;

  const notes = isHeal ? [1567.98, 2093.0] : [1760.0, 2349.32];
  notes.forEach((freq, idx) => {
    const start = now + idx * 0.065;
    const dur = idx === 1 ? 0.24 : 0.06;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.18 * vol, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.01);
  });
}

// 1E. Low LP Critical Emergency Siren (<= 2000 LP)
function playCriticalLpAlarm() {
  if (!state.soundEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;

  const vol = getMasterVolume();
  const now = ctx.currentTime;

  [0, 0.22].forEach((offset) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now + offset);
    osc.frequency.setValueAtTime(622.25, now + offset + 0.09);
    gain.gain.setValueAtTime(0.18 * vol, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.19);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + offset);
    osc.stop(now + offset + 0.2);
  });
}

// 1F. Dramatic Zero LP Anime Defeat Sound (Explosion + Power Down + Buzzer)
function playAnimeLpZero() {
  if (!state.soundEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;

  const vol = getMasterVolume();
  const now = ctx.currentTime;

  // 1. Heavy final blast
  playDamageImpactSfx(4000);

  // 2. Classic anime descending power-down synth sweep
  const sweepOsc = ctx.createOscillator();
  const sweepGain = ctx.createGain();
  sweepOsc.type = 'sawtooth';
  sweepOsc.frequency.setValueAtTime(1480, now + 0.08);
  sweepOsc.frequency.exponentialRampToValueAtTime(65, now + 0.85);

  sweepGain.gain.setValueAtTime(0.32 * vol, now + 0.08);
  sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.88);
  sweepOsc.connect(sweepGain);
  sweepGain.connect(ctx.destination);
  sweepOsc.start(now + 0.08);
  sweepOsc.stop(now + 0.9);

  // 3. Defeat alarm pulses
  const freqs = [587.33, 440, 329.63, 220];
  freqs.forEach((f, idx) => {
    const t = now + 0.25 + idx * 0.14;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(f, t);
    gain.gain.setValueAtTime(0.22 * vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.29);
  });
}

// 1G. Extra Duel Soundboard SFX (Trap Activation, Boss Summon, Monster Shatter)
function playTrapChainSfx() {
  if (!state.soundEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;

  const vol = getMasterVolume();
  const now = ctx.currentTime;
  const chord = [1174.66, 1479.98, 1760.0, 2349.32];
  chord.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + i * 0.045);
    gain.gain.setValueAtTime(0.22 * vol, now + i * 0.045);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.32);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.045);
    osc.stop(now + i * 0.045 + 0.34);
  });
}

function playBossSummonSfx() {
  if (!state.soundEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;

  const vol = getMasterVolume();
  const now = ctx.currentTime;
  const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 1046.5];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now + i * 0.06);
    gain.gain.setValueAtTime(0.18 * vol, now + i * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.06);
    osc.stop(now + i * 0.06 + 0.46);
  });
}

function playMonsterShatterSfx() {
  if (!state.soundEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;

  const vol = getMasterVolume();
  const now = ctx.currentTime;

  // Glass/hologram shatter noise + high crystal shards
  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = createNoiseBuffer(ctx, 0.35);
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(1800, now);
  const nGain = ctx.createGain();
  nGain.gain.setValueAtTime(0.32 * vol, now);
  nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
  noiseSrc.connect(filter);
  filter.connect(nGain);
  nGain.connect(ctx.destination);
  noiseSrc.start(now);

  [2637, 2093, 1567, 1174].forEach((freq, idx) => {
    const t = now + idx * 0.05;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.18 * vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  });
}

function playUiBeep(freq = 740, duration = 0.06) {
  if (!state.soundEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;

  const vol = getMasterVolume();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.09 * vol, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);
}

// ============================================================================
// 2. MODERN TOP-LAYER DIALOGS & FALLBACKS (modern-web-guidance)
// ============================================================================
let supportsDisplayTransition;
function canTransitionDisplay() {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
    return false;
  }
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = 'none';
  supportsDisplayTransition = getComputedStyle(probe).display === 'block';
  probe.remove();
  return supportsDisplayTransition;
}

function supportsTopLayerExit() {
  return window.CSS?.supports?.('overlay', 'auto') && canTransitionDisplay();
}

async function closeTopLayer(dialog) {
  if (!dialog || !dialog.open) return;
  if (!supportsTopLayerExit()) {
    dialog.setAttribute('data-closing', '');
    const animations = dialog.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((r) => setTimeout(r, 2000)),
      ]);
    }
    if (!dialog.hasAttribute('data-closing')) return;
    dialog.removeAttribute('data-closing');
  }
  dialog.close();
}

function setupModernDialogs() {
  const dialogs = document.querySelectorAll('dialog.duel-dialog');
  dialogs.forEach((dialog) => {
    // Route native cancel (Esc / closedby) through closeTopLayer for smooth exit animation
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeTopLayer(dialog);
    });

    // Fallback for browsers without <dialog closedby="any"> support
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (isDialogContent) return;
        closeTopLayer(dialog);
      });
    }
  });

  document.querySelectorAll('[data-close-dialog]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-close-dialog');
      const dlg = document.getElementById(id);
      closeTopLayer(dlg);
    });
  });
}

// ============================================================================
// 3. STATE PERSISTENCE & TOAST
// ============================================================================
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.players && parsed.players[1] && parsed.players[2]) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Impossibile leggere lo stato salvato:', e);
  }
  return createDefaultState(8000);
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Impossibile salvare lo stato:', e);
  }
}

let toastTimeout = null;
function showToast(msg) {
  const toast = document.getElementById('duelToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// ============================================================================
// 4. LIFE POINTS ANIMATION & CALCULATION ENGINE
// ============================================================================
const activeAnimations = { 1: null, 2: null };

function animateLpDigits(playerNum, fromVal, toVal) {
  const displayEl = document.getElementById(`p${playerNum}LpDisplay`);
  if (!displayEl) return;

  if (activeAnimations[playerNum]) {
    cancelAnimationFrame(activeAnimations[playerNum]);
  }

  if (fromVal === toVal) {
    displayEl.textContent = toVal;
    updateLpVisualState(playerNum, toVal);
    return;
  }

  const absDiff = Math.abs(toVal - fromVal);
  const duration = absDiff >= 2000 ? 960 : 740;
  const startTime = performance.now();
  const isHeal = toVal > fromVal;
  let lastTickTime = 0;
  let tickStep = 0;

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(fromVal + (toVal - fromVal) * eased);

    displayEl.textContent = current;

    if (now - lastTickTime > 38 && progress < 0.96) {
      playAnimeLpTick(isHeal, tickStep++);
      lastTickTime = now;
    }

    if (progress < 1) {
      activeAnimations[playerNum] = requestAnimationFrame(step);
    } else {
      displayEl.textContent = toVal;
      updateLpVisualState(playerNum, toVal);
      if (toVal === 0) {
        playAnimeLpZero();
        showToast(`💥 ${state.players[playerNum].name} è sceso a 0 LP!`);
      } else {
        playLpStopChime(isHeal);
        if (!isHeal && toVal <= 2000) {
          setTimeout(() => playCriticalLpAlarm(), 190);
        }
      }
    }
  }

  activeAnimations[playerNum] = requestAnimationFrame(step);
}

function updateLpVisualState(playerNum, lpVal) {
  const displayEl = document.getElementById(`p${playerNum}LpDisplay`);
  const barEl = document.getElementById(`p${playerNum}LpBar`);
  if (!displayEl || !barEl) return;

  displayEl.classList.toggle('lp-critical', lpVal > 0 && lpVal <= 2000);
  displayEl.classList.toggle('lp-zero', lpVal === 0);

  const pct = Math.max(0, Math.min(100, (lpVal / state.startLp) * 100));
  barEl.style.width = `${pct}%`;
  barEl.classList.remove('bar-warn', 'bar-danger');
  if (lpVal <= 2000) {
    barEl.classList.add('bar-danger');
  } else if (lpVal <= state.startLp * 0.5) {
    barEl.classList.add('bar-warn');
  }
}

function applyLpChange(playerNum, newLp, labelText, reason = '', isHalfOp = false) {
  const p = state.players[playerNum];
  const oldLp = p.lp;
  const clampedLp = Math.max(0, Math.min(999999, Math.round(newLp)));

  if (oldLp === clampedLp && !reason) return;

  // Push to undo stack
  undoStack.push({
    playerNum,
    oldLp,
    newLp: clampedLp,
    labelText,
    reason
  });
  redoStack = [];
  updateUndoRedoButtons();

  p.lp = clampedLp;
  const diff = clampedLp - oldLp;

  // Trigger authentic Yu-Gi-Oh! Damage Impact Sound & Screen Flash
  if (diff < 0) {
    const dmgAmount = Math.abs(diff);
    if (isHalfOp) {
      playSlashHalfSfx();
      triggerScreenDamageEffect('electric', true);
    } else {
      playDamageImpactSfx(dmgAmount);
      triggerScreenDamageEffect('red', dmgAmount >= 1000);
    }
  }

  // Visual flash & delta badge
  const visor = document.getElementById(`p${playerNum}LpVisor`);
  const deltaEl = document.getElementById(`p${playerNum}Delta`);

  if (visor) {
    visor.classList.remove('flash-dmg', 'flash-heal');
    void visor.offsetWidth;
    visor.classList.add(diff < 0 ? 'flash-dmg' : 'flash-heal');
  }

  if (deltaEl) {
    deltaEl.textContent = labelText || (diff >= 0 ? `+${diff}` : `${diff}`);
    deltaEl.className = `lp-delta ${diff < 0 ? 'delta-dmg' : 'delta-heal'}`;
  }

  animateLpDigits(playerNum, oldLp, clampedLp);
  updateLpVisualState(playerNum, clampedLp);

  // Add to Duel Log
  const reasonSuffix = reason ? ` [${reason}]` : '';
  addLogEntry(
    playerNum,
    `${p.name}: ${labelText} (${oldLp} → ${clampedLp} LP)${reasonSuffix}`
  );

  saveState();
  syncCalculatorTabs();
}

function modifyLpByOp(playerNum, op, val = 0, reason = '') {
  const currentLp = state.players[playerNum].lp;
  if (op === 'add') {
    const newLp = currentLp + val;
    const sign = val >= 0 ? `+${val}` : `${val}`;
    applyLpChange(playerNum, newLp, `${sign} LP`, reason, false);
  } else if (op === 'half') {
    // Official Yu-Gi-Oh! TCG rule: halving odd LP rounds UP to nearest integer
    const newLp = Math.ceil(currentLp / 2);
    applyLpChange(playerNum, newLp, '÷2 (Dimezzati)', reason || 'Costo Dimezza LP', true);
  } else if (op === 'double') {
    const newLp = currentLp * 2;
    applyLpChange(playerNum, newLp, '×2 (Raddoppiati)', reason, false);
  } else if (op === 'set') {
    applyLpChange(playerNum, val, `= ${val} LP`, reason, false);
  }
}

function updateUndoRedoButtons() {
  document.getElementById('undoBtn').disabled = undoStack.length === 0;
  document.getElementById('redoBtn').disabled = redoStack.length === 0;
}

function handleUndo() {
  if (undoStack.length === 0) return;
  const last = undoStack.pop();
  redoStack.push(last);

  const p = state.players[last.playerNum];
  const prevLp = p.lp;
  p.lp = last.oldLp;

  animateLpDigits(last.playerNum, prevLp, last.oldLp);
  updateLpVisualState(last.playerNum, last.oldLp);
  addLogEntry(last.playerNum, `↩ Annullato: ${p.name} torna a ${last.oldLp} LP`);
  updateUndoRedoButtons();
  saveState();
  syncCalculatorTabs();
}

function handleRedo() {
  if (redoStack.length === 0) return;
  const item = redoStack.pop();
  undoStack.push(item);

  const p = state.players[item.playerNum];
  const prevLp = p.lp;
  p.lp = item.newLp;

  animateLpDigits(item.playerNum, prevLp, item.newLp);
  updateLpVisualState(item.playerNum, item.newLp);
  addLogEntry(item.playerNum, `↪ Ripetuto: ${p.name} va a ${item.newLp} LP`);
  updateUndoRedoButtons();
  saveState();
  syncCalculatorTabs();
}

// ============================================================================
// 5. TACTICAL CALCULATOR MODAL LOGIC
// ============================================================================
function openCalculator(playerNum = 1) {
  calcTargetPlayer = playerNum;
  calcMode = 'sub';
  calcInputStr = '0';
  document.getElementById('calcReasonInput').value = '';
  syncCalculatorTabs();
  updateCalculatorScreen();
  const dlg = document.getElementById('calcDialog');
  if (!dlg.open) dlg.showModal();
  playUiBeep(820, 0.05);
}

function syncCalculatorTabs() {
  const tab1 = document.getElementById('calcTabP1');
  const tab2 = document.getElementById('calcTabP2');
  tab1.classList.toggle('active', calcTargetPlayer === 1);
  tab2.classList.toggle('active', calcTargetPlayer === 2);

  document.getElementById('calcTabP1Name').textContent = state.players[1].name;
  document.getElementById('calcTabP1Lp').textContent = `${state.players[1].lp} LP`;
  document.getElementById('calcTabP2Name').textContent = state.players[2].name;
  document.getElementById('calcTabP2Lp').textContent = `${state.players[2].lp} LP`;
}

function updateCalculatorScreen() {
  const currentLp = state.players[calcTargetPlayer].lp;
  const inputVal = parseInt(calcInputStr, 10) || 0;
  const badgeEl = document.getElementById('calcOpBadge');
  const inputEl = document.getElementById('calcCurrentInput');
  const previewEl = document.getElementById('calcPreviewLine');

  document.querySelectorAll('.cmode-btn').forEach((btn) => {
    btn.className = 'cmode-btn';
    const m = btn.getAttribute('data-cmode');
    if (m === calcMode) {
      if (m === 'sub') btn.classList.add('active-minus');
      else if (m === 'add') btn.classList.add('active-plus');
      else btn.classList.add('active-special');
    }
  });

  if (calcMode === 'sub') {
    badgeEl.textContent = '− DANNO / PAGA';
    badgeEl.className = 'calc-op-badge minus';
    const res = Math.max(0, currentLp - inputVal);
    inputEl.textContent = inputVal;
    previewEl.textContent = `${currentLp} − ${inputVal} = ${res} LP`;
  } else if (calcMode === 'add') {
    badgeEl.textContent = '+ GUADAGNA LP';
    badgeEl.className = 'calc-op-badge plus';
    const res = currentLp + inputVal;
    inputEl.textContent = inputVal;
    previewEl.textContent = `${currentLp} + ${inputVal} = ${res} LP`;
  } else if (calcMode === 'half') {
    badgeEl.textContent = '÷2 DIMEZZA LP';
    badgeEl.className = 'calc-op-badge special';
    const res = Math.ceil(currentLp / 2);
    inputEl.textContent = '÷ 2';
    previewEl.textContent = `${currentLp} ÷ 2 = ${res} LP (Arrotondato per eccesso)`;
  } else if (calcMode === 'set') {
    badgeEl.textContent = '= IMPOSTA LP';
    badgeEl.className = 'calc-op-badge special';
    inputEl.textContent = inputVal;
    previewEl.textContent = `Nuovi LP di ${state.players[calcTargetPlayer].name} = ${inputVal} LP`;
  }
}

function handleCalcKey(key) {
  playUiBeep(680, 0.035);
  if (calcMode === 'half') {
    calcMode = 'sub';
  }
  if (key === 'CLR') {
    calcInputStr = '0';
  } else if (key === 'BACK') {
    calcInputStr = calcInputStr.length > 1 ? calcInputStr.slice(0, -1) : '0';
  } else {
    if (calcInputStr === '0') {
      calcInputStr = (key === '00' || key === '000') ? '0' : key;
    } else if (calcInputStr.length + key.length <= 6) {
      calcInputStr += key;
    }
  }
  updateCalculatorScreen();
}

function submitCalculator() {
  const inputVal = parseInt(calcInputStr, 10) || 0;
  const reason = document.getElementById('calcReasonInput').value.trim();

  if (calcMode === 'sub') {
    if (inputVal > 0) modifyLpByOp(calcTargetPlayer, 'add', -inputVal, reason);
  } else if (calcMode === 'add') {
    if (inputVal > 0) modifyLpByOp(calcTargetPlayer, 'add', inputVal, reason);
  } else if (calcMode === 'half') {
    modifyLpByOp(calcTargetPlayer, 'half', 0, reason);
  } else if (calcMode === 'set') {
    modifyLpByOp(calcTargetPlayer, 'set', inputVal, reason);
  }

  closeTopLayer(document.getElementById('calcDialog'));
}

// ============================================================================
// 6. COUNTERS (SEGNALINI) & MONSTER TOKENS (SEGNA-MOSTRO)
// ============================================================================
function renderMarkers(playerNum) {
  const container = document.getElementById(`p${playerNum}MarkersList`);
  if (!container) return;

  const markers = state.players[playerNum].markers;
  if (!markers || markers.length === 0) {
    container.innerHTML = `<div class="marker-empty">Nessun segnalino o token attivo sul terreno.</div>`;
    return;
  }

  container.innerHTML = '';
  markers.forEach((m) => {
    const row = document.createElement('div');
    row.className = 'marker-item';

    if (m.type === 'counter') {
      row.innerHTML = `
        <div class="marker-info">
          <span class="marker-icon">${m.icon || '🔮'}</span>
          <div class="marker-title-wrap">
            <span class="marker-name">${escapeHtml(m.name)}</span>
            <span class="marker-sub">Segnalino (Counter)</span>
          </div>
        </div>
        <div class="marker-controls">
          <button class="m-btn" data-m-act="dec" data-player="${playerNum}" data-id="${m.id}" aria-label="Riduci segnalino">−</button>
          <span class="m-val">${m.count}</span>
          <button class="m-btn" data-m-act="inc" data-player="${playerNum}" data-id="${m.id}" aria-label="Aumenta segnalino">+</button>
          <button class="m-btn" data-m-act="del" data-player="${playerNum}" data-id="${m.id}" title="Rimuovi">✕</button>
        </div>
      `;
    } else {
      const posClass = m.position === 'DEF' ? 'pos-def' : 'pos-atk';
      const posText = m.position === 'DEF' ? '🛡️ DEF' : '⚔️ ATK';
      row.innerHTML = `
        <div class="marker-info">
          <span class="marker-icon">${m.icon || '👾'}</span>
          <div class="marker-title-wrap">
            <span class="marker-name">${escapeHtml(m.name)}</span>
            <span class="marker-sub">${escapeHtml(m.stats || 'Segna-Mostro')}</span>
          </div>
        </div>
        <div class="marker-controls">
          <button class="m-btn m-pos-btn ${posClass}" data-m-act="pos" data-player="${playerNum}" data-id="${m.id}" title="Cambia Posizione ATK/DEF">${posText}</button>
          <button class="m-btn" data-m-act="dec" data-player="${playerNum}" data-id="${m.id}">−</button>
          <span class="m-val">×${m.count}</span>
          <button class="m-btn" data-m-act="inc" data-player="${playerNum}" data-id="${m.id}">+</button>
          <button class="m-btn" data-m-act="del" data-player="${playerNum}" data-id="${m.id}" title="Distruggi Token">✕</button>
        </div>
      `;
    }
    container.appendChild(row);
  });
}

function addMarker(playerNum, type, name, icon, stats = '') {
  const list = state.players[playerNum].markers;
  const existing = list.find((item) => item.type === type && item.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    existing.count += 1;
  } else {
    list.push({
      id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      name,
      icon,
      stats,
      position: 'ATK',
      count: 1
    });
  }
  renderMarkers(playerNum);
  addLogEntry(
    playerNum,
    `${state.players[playerNum].name}: +1 ${name} (${type === 'token' ? 'Segna-Mostro' : 'Segnalino'})`
  );
  saveState();
  playUiBeep(880, 0.05);
}

// ============================================================================
// 7. COIN TOSS & DICE ROLLER (SINGLE & MULTI)
// ============================================================================
function launchCoins(count = 1) {
  const coinVisual = document.getElementById('coinVisual');
  const coinText = document.getElementById('coinResultText');
  const multiContainer = document.getElementById('coinMultiResults');

  coinVisual.classList.remove('flipping', 'tails-coin');
  void coinVisual.offsetWidth;
  coinVisual.classList.add('flipping');
  playUiBeep(980, 0.08);

  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(Math.random() < 0.5 ? 'TESTA' : 'CROCE');
  }

  setTimeout(() => {
    const primary = results[0];
    coinText.textContent = primary;
    coinVisual.classList.toggle('tails-coin', primary === 'CROCE');

    multiContainer.innerHTML = results
      .map((r, idx) => `<span class="rng-pill">Moneta ${idx + 1}: <strong>${r}</strong></span>`)
      .join('');

    addLogEntry(0, `🪙 Lancio Moneta (${count}): ${results.join(', ')}`);
    saveState();
  }, 320);
}

function rollDice(count = 1) {
  const diceVisual = document.getElementById('diceVisual');
  const diceText = document.getElementById('diceResultText');
  const multiContainer = document.getElementById('diceMultiResults');
  const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  diceVisual.classList.remove('rolling');
  void diceVisual.offsetWidth;
  diceVisual.classList.add('rolling');
  playUiBeep(620, 0.08);

  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(Math.floor(Math.random() * 6) + 1);
  }

  setTimeout(() => {
    const primary = results[0];
    diceVisual.textContent = diceFaces[primary - 1];
    diceText.textContent = `RISULTATO: ${primary}`;

    multiContainer.innerHTML = results
      .map((r, idx) => `<span class="rng-pill">Dado ${idx + 1}: <strong>${r}</strong></span>`)
      .join('');

    addLogEntry(0, `🎲 Lancio Dado D6 (${count}): ${results.join(', ')}`);
    saveState();
  }, 280);
}

// ============================================================================
// 8. TURN, PHASE & NIBIRU TRACKER
// ============================================================================
function renderTurnAndPhase() {
  document.getElementById('turnNumber').textContent = state.turn;
  const activeName = state.players[state.activePlayer].name;
  const pill = document.getElementById('activePlayerToggle');
  document.getElementById('activePlayerLabel').textContent = activeName;
  pill.classList.toggle('p2-active', state.activePlayer === 2);

  document.getElementById('playerCard1').classList.toggle('active-turn-card', state.activePlayer === 1);
  document.getElementById('playerCard2').classList.toggle('active-turn-card', state.activePlayer === 2);

  document.querySelectorAll('.phase-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-phase') === state.phase);
  });

  // Nibiru Counter
  const nibCountEl = document.getElementById('nibCount');
  const nibWidget = document.getElementById('nibiruWidget');
  nibCountEl.textContent = state.nibiruCount;
  nibWidget.classList.toggle('nibiru-live', state.nibiruCount >= 5);
}

function advanceTurn() {
  state.turn += 1;
  state.activePlayer = state.activePlayer === 1 ? 2 : 1;
  state.phase = 'DP';
  state.nibiruCount = 0;

  // Reset single-turn status flags (Normal Summon, Droll, Maxx C/Fuwalos)
  [1, 2].forEach((pNum) => {
    state.players[pNum].flags.ns = false;
    state.players[pNum].flags.droll = false;
    state.players[pNum].flags.maxxc = false;
  });

  renderTurnAndPhase();
  renderFlags();
  addLogEntry(0, `⏭ Inizia il Turno ${state.turn} (${state.players[state.activePlayer].name})`);
  showToast(`Turno ${state.turn} — Tocca a ${state.players[state.activePlayer].name}`);
  playUiBeep(920, 0.07);
  saveState();
}

function renderFlags() {
  document.querySelectorAll('.flag-chip').forEach((chip) => {
    const pNum = parseInt(chip.getAttribute('data-player'), 10);
    const flagKey = chip.getAttribute('data-flag');
    const isOn = Boolean(state.players[pNum]?.flags?.[flagKey]);
    chip.classList.toggle('flag-on', isOn);
  });
}

// ============================================================================
// 9. TOURNAMENT ROUND TIMER (45:00 DEFAULT)
// ============================================================================
function renderTimer() {
  const mins = Math.floor(state.timerRemainingSec / 60);
  const secs = state.timerRemainingSec % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  document.getElementById('timerDigits').textContent = formatted;

  const widget = document.getElementById('timerWidget');
  widget.classList.toggle('timer-running', timerRunning);
  widget.classList.toggle('timer-expired', state.timerRemainingSec === 0);
  document.getElementById('timerPlayIcon').textContent = timerRunning ? '⏸' : '▶';
}

function toggleTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
  } else {
    if (state.timerRemainingSec <= 0) {
      state.timerRemainingSec = state.timerDurationSec;
    }
    timerRunning = true;
    timerInterval = setInterval(() => {
      if (state.timerRemainingSec > 0) {
        state.timerRemainingSec -= 1;
        renderTimer();
        if (state.timerRemainingSec === 0) {
          clearInterval(timerInterval);
          timerRunning = false;
          playAnimeLpZero();
          showToast('⏰ TEMPO SCADuto! Procedura di Fine Match (Controlla i LP alla fine della fase!)');
          addLogEntry(0, '⏰ TEMPO DEL ROUND SCADUTO (End of Match Procedure)');
          renderTimer();
        }
      }
    }, 1000);
  }
  renderTimer();
  playUiBeep(760, 0.05);
}

function resetTimer(newMinutes = null) {
  clearInterval(timerInterval);
  timerRunning = false;
  if (newMinutes) {
    state.timerDurationSec = newMinutes * 60;
  }
  state.timerRemainingSec = state.timerDurationSec;
  renderTimer();
  saveState();
}

// ============================================================================
// 10. DUEL LOG & FULL UI RENDERING
// ============================================================================
function addLogEntry(playerNum, text) {
  const entry = {
    id: Date.now() + Math.random(),
    turn: state.turn,
    phase: state.phase,
    player: playerNum,
    text,
    time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
  state.log.unshift(entry);
  if (state.log.length > 150) state.log.pop();
  renderLogs();
}

function renderLogs() {
  const miniList = document.getElementById('miniLogList');
  const fullContainer = document.getElementById('fullLogContainer');
  const countEl = document.getElementById('miniLogCount');

  countEl.textContent = `${state.log.length} eventi`;

  if (state.log.length === 0) {
    miniList.innerHTML = `<li class="mini-log-empty">Nessun evento registrato.</li>`;
    fullContainer.innerHTML = `<div class="marker-empty">Nessun evento registrato.</div>`;
    return;
  }

  miniList.innerHTML = state.log
    .slice(0, 12)
    .map((item) => {
      const pClass = item.player === 1 ? 'log-p1' : item.player === 2 ? 'log-p2' : '';
      return `
        <li class="mini-log-item ${pClass}">
          <span><strong>[T${item.turn}-${item.phase}]</strong> ${escapeHtml(item.text)}</span>
        </li>
      `;
    })
    .join('');

  fullContainer.innerHTML = state.log
    .map((item) => {
      const pClass = item.player === 1 ? 'log-p1' : item.player === 2 ? 'log-p2' : '';
      return `
        <div class="mini-log-item ${pClass}">
          <span><strong>[Turno ${item.turn} • ${item.phase}]</strong> ${escapeHtml(item.text)}</span>
          <small style="color:#94a3b8">${item.time}</small>
        </div>
      `;
    })
    .join('');
}

function renderMatchStars() {
  document.querySelectorAll('.star-btn').forEach((btn) => {
    const pNum = parseInt(btn.getAttribute('data-player'), 10);
    const starIdx = parseInt(btn.getAttribute('data-star'), 10);
    btn.classList.toggle('won', state.players[pNum].stars >= starIdx);
  });
}

function renderAll() {
  document.getElementById('p1Name').value = state.players[1].name;
  document.getElementById('p2Name').value = state.players[2].name;

  document.getElementById('p1LpDisplay').textContent = state.players[1].lp;
  document.getElementById('p2LpDisplay').textContent = state.players[2].lp;
  updateLpVisualState(1, state.players[1].lp);
  updateLpVisualState(2, state.players[2].lp);

  document.getElementById('formatBadgeText').textContent = `${state.startLp} LP`;
  document.getElementById('soundIcon').textContent = state.soundEnabled ? '🔊' : '🔇';
  document.getElementById('soundToggleBtn').classList.toggle('active-chip', state.soundEnabled);

  const profileSelect = document.getElementById('sfxProfileSelect');
  if (profileSelect) {
    profileSelect.value = state.soundProfile || 'dm';
  }

  const volSlider = document.getElementById('volumeSlider');
  const volText = document.getElementById('volumeValueText');
  if (volSlider && volText) {
    const pct = Math.round(getMasterVolume() * 100);
    volSlider.value = pct;
    volText.textContent = `${pct}%`;
  }

  document.getElementById('duelArena').classList.toggle('tabletop-mode', state.tabletopMode);
  document.getElementById('tabletopModeBtn').classList.toggle('active-chip', state.tabletopMode);

  renderTurnAndPhase();
  renderFlags();
  renderMarkers(1);
  renderMarkers(2);
  renderMatchStars();
  renderTimer();
  renderLogs();
  updateUndoRedoButtons();
}

function resetDuel(newStartLp = state.startLp) {
  const p1Name = state.players[1].name;
  const p2Name = state.players[2].name;
  const p1Stars = state.players[1].stars;
  const p2Stars = state.players[2].stars;
  const soundEnabled = state.soundEnabled;
  const soundProfile = state.soundProfile || 'dm';
  const soundVolume = getMasterVolume();
  const tabletopMode = state.tabletopMode;

  state = createDefaultState(newStartLp);
  state.players[1].name = p1Name;
  state.players[2].name = p2Name;
  state.players[1].stars = p1Stars;
  state.players[2].stars = p2Stars;
  state.soundEnabled = soundEnabled;
  state.soundProfile = soundProfile;
  state.soundVolume = soundVolume;
  state.tabletopMode = tabletopMode;

  undoStack = [];
  redoStack = [];
  document.getElementById('p1Delta').textContent = '';
  document.getElementById('p2Delta').textContent = '';

  renderAll();
  saveState();
  playUiBeep(1040, 0.09);
  showToast(`⚡ Nuovo Duello Avviato! (${newStartLp} LP)`);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================================
// 11. EVENT LISTENERS INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  setupModernDialogs();
  renderAll();

  // Player Names
  ['1', '2'].forEach((pNum) => {
    const input = document.getElementById(`p${pNum}Name`);
    input.addEventListener('change', () => {
      state.players[pNum].name = input.value.trim() || `Giocatore ${pNum}`;
      renderTurnAndPhase();
      saveState();
    });
  });

  // Match Stars (Bo3)
  document.querySelectorAll('.star-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pNum = parseInt(btn.getAttribute('data-player'), 10);
      const starIdx = parseInt(btn.getAttribute('data-star'), 10);
      const current = state.players[pNum].stars;
      state.players[pNum].stars = current === starIdx ? starIdx - 1 : starIdx;
      renderMatchStars();
      saveState();
      playUiBeep(940, 0.05);
    });
  });

  // Clicking LP Visor opens Calculator for that player
  document.getElementById('p1LpVisor').addEventListener('click', () => openCalculator(1));
  document.getElementById('p2LpVisor').addEventListener('click', () => openCalculator(2));
  document.getElementById('openCalcCenterBtn').addEventListener('click', () => openCalculator(state.activePlayer));

  // Quick LP Buttons on each player card
  document.querySelectorAll('.qlp-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pNum = parseInt(btn.getAttribute('data-player'), 10);
      if (btn.classList.contains('calc-open-btn')) {
        openCalculator(pNum);
        return;
      }
      const op = btn.getAttribute('data-op');
      const val = parseInt(btn.getAttribute('data-val') || '0', 10);
      modifyLpByOp(pNum, op, val);
    });
  });

  // Calculator Tabs, Modes & Numpad
  document.querySelectorAll('.calc-ptab').forEach((tab) => {
    tab.addEventListener('click', () => {
      calcTargetPlayer = parseInt(tab.getAttribute('data-target-player'), 10);
      syncCalculatorTabs();
      updateCalculatorScreen();
    });
  });

  document.querySelectorAll('.cmode-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      calcMode = btn.getAttribute('data-cmode');
      updateCalculatorScreen();
    });
  });

  document.querySelectorAll('.num-key').forEach((btn) => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      if (preset) {
        const current = parseInt(calcInputStr, 10) || 0;
        calcInputStr = String(current + parseInt(preset, 10));
        updateCalculatorScreen();
        playUiBeep(750, 0.04);
        return;
      }
      const key = btn.getAttribute('data-key');
      if (key) handleCalcKey(key);
    });
  });

  // Battle Damage Difference Helper
  document.getElementById('useBattleDiffBtn').addEventListener('click', () => {
    const atk1 = parseInt(document.getElementById('battleAtk1').value, 10) || 0;
    const atk2 = parseInt(document.getElementById('battleAtk2').value, 10) || 0;
    const diff = Math.abs(atk1 - atk2);
    calcMode = 'sub';
    calcInputStr = String(diff);
    document.getElementById('calcReasonInput').value = `Danno Battaglia (${atk1} vs ${atk2})`;
    updateCalculatorScreen();
    playUiBeep(860, 0.05);
  });

  document.getElementById('calcApplyBtn').addEventListener('click', submitCalculator);

  // Undo / Redo
  document.getElementById('undoBtn').addEventListener('click', handleUndo);
  document.getElementById('redoBtn').addEventListener('click', handleRedo);

  // Turn & Phases
  document.getElementById('turnCounterBtn').addEventListener('click', advanceTurn);
  document.getElementById('nextTurnBtn').addEventListener('click', advanceTurn);
  document.getElementById('activePlayerToggle').addEventListener('click', () => {
    state.activePlayer = state.activePlayer === 1 ? 2 : 1;
    renderTurnAndPhase();
    saveState();
  });

  document.querySelectorAll('.phase-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const phase = btn.getAttribute('data-phase');
      if (state.turn === 1 && phase === 'BP') {
        showToast('⚠️ Regola Yu-Gi-Oh!: Nessuna Battle Phase nel Turno 1!');
        playUiBeep(320, 0.12);
        return;
      }
      state.phase = phase;
      renderTurnAndPhase();
      saveState();
      playUiBeep(780, 0.04);
    });
  });

  // Nibiru Summon Counter
  document.getElementById('nibPlusBtn').addEventListener('click', () => {
    state.nibiruCount += 1;
    renderTurnAndPhase();
    if (state.nibiruCount === 5) {
      showToast('☄️ 5ª EVOCAZIONE! Nibiru, l\'Essere Primordiale è ora attivabile!');
      playUiBeep(420, 0.18);
    } else {
      playUiBeep(720, 0.04);
    }
    saveState();
  });

  document.getElementById('nibMinusBtn').addEventListener('click', () => {
    state.nibiruCount = Math.max(0, state.nibiruCount - 1);
    renderTurnAndPhase();
    saveState();
  });

  // Turn Status Flags
  document.querySelectorAll('.flag-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const pNum = parseInt(chip.getAttribute('data-player'), 10);
      const flag = chip.getAttribute('data-flag');
      state.players[pNum].flags[flag] = !state.players[pNum].flags[flag];
      renderFlags();
      saveState();
      playUiBeep(700, 0.04);
    });
  });

  // Markers (Counters & Tokens) Controls on Player Cards
  ['1', '2'].forEach((pNum) => {
    document.getElementById(`p${pNum}MarkersList`).addEventListener('click', (e) => {
      const btn = e.target.closest('[data-m-act]');
      if (!btn) return;
      const act = btn.getAttribute('data-m-act');
      const id = btn.getAttribute('data-id');
      const player = parseInt(btn.getAttribute('data-player'), 10);
      const list = state.players[player].markers;
      const itemIdx = list.findIndex((m) => m.id === id);
      if (itemIdx === -1) return;

      if (act === 'inc') {
        list[itemIdx].count += 1;
      } else if (act === 'dec') {
        list[itemIdx].count = Math.max(0, list[itemIdx].count - 1);
      } else if (act === 'pos') {
        list[itemIdx].position = list[itemIdx].position === 'DEF' ? 'ATK' : 'DEF';
      } else if (act === 'del') {
        list.splice(itemIdx, 1);
      }
      renderMarkers(player);
      saveState();
      playUiBeep(760, 0.035);
    });
  });

  // Open Counters / Tokens Modal
  function openCountersModal(targetPlayer = 1) {
    markerTargetPlayer = targetPlayer;
    document.getElementById('markerTargetP1').classList.toggle('active', markerTargetPlayer === 1);
    document.getElementById('markerTargetP2').classList.toggle('active', markerTargetPlayer === 2);
    document.getElementById('countersDialog').showModal();
  }

  document.getElementById('openCountersModalBtn').addEventListener('click', () => openCountersModal(state.activePlayer));
  document.querySelectorAll('[data-action="add-counter"], [data-action="add-token"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pNum = parseInt(btn.getAttribute('data-player'), 10);
      openCountersModal(pNum);
    });
  });

  document.querySelectorAll('[data-mtarget]').forEach((pill) => {
    pill.addEventListener('click', () => {
      markerTargetPlayer = parseInt(pill.getAttribute('data-mtarget'), 10);
      document.getElementById('markerTargetP1').classList.toggle('active', markerTargetPlayer === 1);
      document.getElementById('markerTargetP2').classList.toggle('active', markerTargetPlayer === 2);
    });
  });

  document.querySelectorAll('.preset-card').forEach((card) => {
    card.addEventListener('click', () => {
      const type = card.getAttribute('data-add-type');
      const name = card.getAttribute('data-name');
      const icon = card.getAttribute('data-icon');
      const stats = card.getAttribute('data-stats') || '';
      addMarker(markerTargetPlayer, type, name, icon, stats);
      showToast(`Aggiunto "${name}" a ${state.players[markerTargetPlayer].name}`);
    });
  });

  document.getElementById('addCustomCounterBtn').addEventListener('click', () => {
    const input = document.getElementById('customCounterName');
    const name = input.value.trim() || 'Segnalino Personalizzato';
    addMarker(markerTargetPlayer, 'counter', name, '🔮');
    input.value = '';
    showToast(`Creato "${name}" per ${state.players[markerTargetPlayer].name}`);
  });

  document.getElementById('addCustomTokenBtn').addEventListener('click', () => {
    const input = document.getElementById('customTokenName');
    const name = input.value.trim() || 'Segna-Mostro Personalizzato';
    addMarker(markerTargetPlayer, 'token', name, '👾', 'Token Personalizzato');
    input.value = '';
    showToast(`Evocato "${name}" per ${state.players[markerTargetPlayer].name}`);
  });

  // Coin & Dice Modal
  document.getElementById('openCoinDiceBtn').addEventListener('click', () => {
    document.getElementById('coinDiceDialog').showModal();
  });

  document.querySelectorAll('[data-coin-count]').forEach((btn) => {
    btn.addEventListener('click', () => {
      launchCoins(parseInt(btn.getAttribute('data-coin-count'), 10));
    });
  });

  document.querySelectorAll('[data-dice-count]').forEach((btn) => {
    btn.addEventListener('click', () => {
      rollDice(parseInt(btn.getAttribute('data-dice-count'), 10));
    });
  });

  // Log Modal
  document.getElementById('openLogModalBtn').addEventListener('click', () => {
    renderLogs();
    document.getElementById('logDialog').showModal();
  });

  document.getElementById('copyLogBtn').addEventListener('click', () => {
    const text = state.log
      .map((l) => `[Turno ${l.turn} - ${l.phase}] (${l.time}) ${l.text}`)
      .join('\n');
    navigator.clipboard?.writeText(text);
    showToast('📋 Cronologia del duello copiata negli appunti!');
  });

  document.getElementById('clearLogBtn').addEventListener('click', () => {
    state.log = [];
    renderLogs();
    saveState();
    showToast('Storico svuotato.');
  });

  // Top Bar Controls
  document.getElementById('tabletopModeBtn').addEventListener('click', () => {
    state.tabletopMode = !state.tabletopMode;
    renderAll();
    saveState();
    showToast(state.tabletopMode ? '⇅ Modalità Tavolo 180° Attivata' : 'Modalità Standard Attivata');
  });

  document.getElementById('soundToggleBtn').addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    renderAll();
    saveState();
    showToast(state.soundEnabled ? '🔊 Effetti Sonori Anime Attivati' : '🔇 Audio Disattivato');
  });

  document.getElementById('newDuelBtn').addEventListener('click', () => {
    resetDuel(state.startLp);
  });

  // Timer Controls
  document.getElementById('timerPlayPauseBtn').addEventListener('click', toggleTimer);
  document.getElementById('timerResetBtn').addEventListener('click', () => {
    resetTimer();
    showToast('⏱️ Timer Torneo Resettato');
  });
  document.getElementById('timerDisplayWrap').addEventListener('click', () => {
    document.getElementById('settingsDialog').showModal();
  });

  // Settings Modal
  document.getElementById('settingsOpenBtn').addEventListener('click', () => {
    document.getElementById('settingsDialog').showModal();
  });

  document.querySelectorAll('.format-card').forEach((card) => {
    card.addEventListener('click', () => {
      const lp = parseInt(card.getAttribute('data-start-lp'), 10);
      document.querySelectorAll('.format-card').forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      document.getElementById('customStartLpInput').value = lp;
      resetDuel(lp);
      closeTopLayer(document.getElementById('settingsDialog'));
    });
  });

  document.getElementById('applyCustomStartLpBtn').addEventListener('click', () => {
    const val = parseInt(document.getElementById('customStartLpInput').value, 10) || 8000;
    resetDuel(Math.max(100, val));
    closeTopLayer(document.getElementById('settingsDialog'));
  });

  document.querySelectorAll('.timer-preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mins = parseInt(btn.getAttribute('data-minutes'), 10);
      resetTimer(mins);
      showToast(`⏱️ Timer impostato a ${mins} minuti`);
      closeTopLayer(document.getElementById('settingsDialog'));
    });
  });

  // Sound Profile Selector & Volume Slider
  const profileSelect = document.getElementById('sfxProfileSelect');
  if (profileSelect) {
    profileSelect.addEventListener('change', () => {
      state.soundProfile = profileSelect.value;
      saveState();
      playAnimeLpTick(false, 0);
      setTimeout(() => playAnimeLpTick(false, 1), 45);
      setTimeout(() => playLpStopChime(false), 110);
      showToast(`🔊 Profilo Audio: ${profileSelect.options[profileSelect.selectedIndex].text}`);
    });
  }

  const volSlider = document.getElementById('volumeSlider');
  const volText = document.getElementById('volumeValueText');
  if (volSlider && volText) {
    volSlider.addEventListener('input', () => {
      const pct = parseInt(volSlider.value, 10);
      state.soundVolume = pct / 100;
      volText.textContent = `${pct}%`;
      saveState();
    });
  }

  // Demo Full Anime Damage Sequence Button
  function playDemoDamageSequence() {
    state.soundEnabled = true;
    renderAll();
    playDamageImpactSfx(2500);
    triggerScreenDamageEffect('red', true);
    let step = 0;
    const demoInterval = setInterval(() => {
      playAnimeLpTick(false, step++);
      if (step >= 14) {
        clearInterval(demoInterval);
        setTimeout(() => playLpStopChime(false), 45);
      }
    }, 40);
  }

  const testDmgBtn = document.getElementById('testDamageSfxBtn');
  if (testDmgBtn) {
    testDmgBtn.addEventListener('click', playDemoDamageSequence);
  }

  // Duel SFX Soundboard Buttons
  document.querySelectorAll('[data-sfx]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.soundEnabled = true;
      renderAll();
      const sfx = btn.getAttribute('data-sfx');
      if (sfx === 'heavy-hit') {
        playDemoDamageSequence();
      } else if (sfx === 'slash-half') {
        playSlashHalfSfx();
        triggerScreenDamageEffect('electric', true);
        let step = 0;
        const intv = setInterval(() => {
          playAnimeLpTick(false, step++);
          if (step >= 12) {
            clearInterval(intv);
            setTimeout(() => playLpStopChime(false), 45);
          }
        }, 40);
      } else if (sfx === 'trap-chain') {
        playTrapChainSfx();
        showToast('🪤 Carta Trappola / Effetto Rapido Attivato!');
      } else if (sfx === 'boss-summon') {
        playBossSummonSfx();
        showToast('🌟 Evocazione Speciale Mostro Boss!');
      } else if (sfx === 'shatter') {
        playMonsterShatterSfx();
        triggerScreenDamageEffect('red', false);
        showToast('💎 Mostro Distrutto!');
      } else if (sfx === 'zero-ko') {
        triggerScreenDamageEffect('red', true);
        playAnimeLpZero();
        showToast('🚨 0 LIFE POINTS — K.O.!');
      }
    });
  });

  // Register Service Worker for 100% Offline PWA on Smartphones
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.log('SW registration note:', err);
    });
  }
});
