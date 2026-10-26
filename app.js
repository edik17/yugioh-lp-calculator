// ============================================================================
// DUEL DISK PRO // Yu-Gi-Oh! Life Points & Tactical Companion
// ============================================================================

const STORAGE_KEY = 'yugioh_duel_disk_state_v1';

// ============================================================================
// ARCHETYPES & ICONIC FIELD SPELLS CATALOGUE
// ============================================================================
const ARCHETYPES = {
  monarch: {
    id: 'monarch',
    name: 'Monarchi',
    icon: '👑',
    fieldSpellName: 'Dominio dei Veri Monarchi',
    fieldCardCode: '84171830',
    artUrl: './images/fields/monarch.jpg',
    cardUrl: './images/fields/monarch_card.jpg',
    desc: 'Se non hai carte nel tuo Extra Deck e controlli un mostro Evocato tramite Tributo, il tuo avversario non può Evocare Specialmente dall\'Extra Deck. I mostri con Tributo guadagnano 800 ATK durante il calcolo dei danni.',
    accentColor: '#f59e0b',
    borderColor: 'rgba(245, 158, 11, 0.55)',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    particleType: 'lightning_monarch'
  },
  blueeyes: {
    id: 'blueeyes',
    name: 'Occhi Blu',
    icon: '🐉',
    fieldSpellName: 'Mausoleo di Bianco',
    fieldCardCode: '24382602',
    artUrl: './images/fields/blueeyes.jpg',
    cardUrl: './images/fields/blueeyes_card.jpg',
    desc: 'Durante la tua Main Phase, puoi Evocare Normalmente 1 mostro Tuner LUCE di Livello 1 in aggiunta alla tua Evocazione Normale. Puoi mandare 1 Mostro Normale al Cimitero.',
    accentColor: '#38bdf8',
    borderColor: 'rgba(56, 189, 248, 0.55)',
    glowColor: 'rgba(56, 189, 248, 0.3)',
    particleType: 'blue_stars'
  },
  darkmagician: {
    id: 'darkmagician',
    name: 'Mago Nero',
    icon: '🔮',
    fieldSpellName: 'Villaggio Segreto degl\'Incantatori',
    fieldCardCode: '68462976',
    artUrl: './images/fields/darkmagician.jpg',
    cardUrl: './images/fields/darkmagician_card.jpg',
    desc: 'Se controlli un mostro Incantatore e il tuo avversario no, il tuo avversario non può attivare Carte Magia.',
    accentColor: '#c084fc',
    borderColor: 'rgba(192, 132, 252, 0.55)',
    glowColor: 'rgba(192, 132, 252, 0.3)',
    particleType: 'arcane_glyphs'
  },
  hero: {
    id: 'hero',
    name: 'EROE Elementale',
    icon: '🦸',
    fieldSpellName: 'Città Grattacielo',
    fieldCardCode: '63035430',
    artUrl: './images/fields/hero.jpg',
    cardUrl: './images/fields/hero_card.jpg',
    desc: 'I mostri "EROE Elementale" guadagnano 1000 ATK durante il solo calcolo dei danni se attaccano un mostro con ATK superiore.',
    accentColor: '#ef4444',
    borderColor: 'rgba(239, 68, 68, 0.55)',
    glowColor: 'rgba(239, 68, 68, 0.3)',
    particleType: 'hero_searchlights'
  },
  branded: {
    id: 'branded',
    name: 'Brandito / Despia',
    icon: '🎭',
    fieldSpellName: 'Teatro Marchiato dei Despia',
    fieldCardCode: '99543666',
    artUrl: './images/fields/branded.jpg',
    cardUrl: './images/fields/branded_card.jpg',
    desc: 'Durante la tua Main Phase: puoi Evocare tramite Fusione 1 Mostro Fusione di Livello 8 o superiore dal tuo Extra Deck usando mostri dalla tua mano o Terreno.',
    accentColor: '#fb7185',
    borderColor: 'rgba(251, 113, 133, 0.55)',
    glowColor: 'rgba(251, 113, 133, 0.3)',
    particleType: 'abyss_flames'
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Drago',
    icon: '🤖',
    fieldSpellName: 'Notte dell\'Ingranaggio',
    fieldCardCode: '55948544',
    artUrl: './images/fields/cyber.jpg',
    cardUrl: './images/fields/cyber.jpg',
    desc: 'Tutti i mostri sul Terreno diventano Macchina. I mostri Macchina che controlli guadagnano 500 ATK/DEF.',
    accentColor: '#10b981',
    borderColor: 'rgba(16, 185, 129, 0.55)',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    particleType: 'cyber_grid'
  },
  zombie: {
    id: 'zombie',
    name: 'Mondo Zombie',
    icon: '🧟',
    fieldSpellName: 'Mondo Zombie',
    fieldCardCode: '4064256',
    artUrl: './images/fields/zombie.jpg',
    cardUrl: './images/fields/zombie.jpg',
    desc: 'Tutti i mostri sul Terreno e nei Cimiteri diventano Zombie. Nessun giocatore può Evocare tramite Tributo, eccetto mostri Zombie.',
    accentColor: '#84cc16',
    borderColor: 'rgba(132, 204, 22, 0.55)',
    glowColor: 'rgba(132, 204, 22, 0.3)',
    particleType: 'toxic_mist'
  },
  umi: {
    id: 'umi',
    name: 'Umi / Oceano',
    icon: '🌊',
    fieldSpellName: 'Un Oceano Leggendario',
    fieldCardCode: '295517',
    artUrl: './images/fields/umi.jpg',
    cardUrl: './images/fields/umi.jpg',
    desc: 'Il nome di questa carta è considerato "Umi". Tutti i mostri ACQUA guadagnano 200 ATK/DEF. Riduci il Livello di tutti i mostri ACQUA di 1.',
    accentColor: '#0ea5e9',
    borderColor: 'rgba(14, 165, 233, 0.55)',
    glowColor: 'rgba(14, 165, 233, 0.3)',
    particleType: 'ocean_bubbles'
  },
  sanctuary: {
    id: 'sanctuary',
    name: 'Fate / Luce',
    icon: '🏛️',
    fieldSpellName: 'Il Santuario nel Cielo',
    fieldCardCode: '56433456',
    artUrl: './images/fields/sanctuary.jpg',
    cardUrl: './images/fields/sanctuary.jpg',
    desc: 'Il danno da combattimento al controllore di un mostro Fata da una battaglia che coinvolge quel mostro diventa 0.',
    accentColor: '#facc15',
    borderColor: 'rgba(250, 204, 21, 0.55)',
    glowColor: 'rgba(250, 204, 21, 0.3)',
    particleType: 'divine_sunbeams'
  },
  classic: {
    id: 'classic',
    name: 'Arena KaibaCorp',
    icon: '🌌',
    fieldSpellName: 'Stadio Olografico KC',
    fieldCardCode: '00000000',
    artUrl: '',
    cardUrl: '',
    desc: 'Stadio di combattimento virtuale ad altissima definizione della Kaiba Corporation.',
    accentColor: '#38bdf8',
    borderColor: 'rgba(56, 189, 248, 0.45)',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    particleType: 'kc_arena'
  }
};

// Default Initial State (Face-to-Face Tabletop Mode enabled by default)
function createDefaultState(startLp = 8000) {
  return {
    startLp,
    soundEnabled: true,
    soundVolume: 0.85,
    tabletopMode: true,
    turn: 1,
    activePlayer: 1,
    phase: 'DP',
    timerDurationSec: 45 * 60,
    timerRemainingSec: 45 * 60,
    fieldSpellActive: false,
    activeField: 'monarch',
    fieldActivator: 1,
    particlesEnabled: true,
    players: {
      1: {
        name: 'Giocatore 1',
        lp: startLp,
        stars: 0,
        archetype: 'monarch',
        markers: []
      },
      2: {
        name: 'Giocatore 2',
        lp: startLp,
        stars: 0,
        archetype: 'blueeyes',
        markers: []
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
// ============================================================================
// 1. ORIGINAL YU-GI-OH! AUDIO ENGINE & SOUNDPACK LOADER
// ============================================================================
let audioCtx = null;

const SOUND_FILES = {
  damage: './sounds/damage.mp3',
  directattack: './sounds/directattack.mp3',
  lp_count_loop: './sounds/lp_count_loop.mp3',
  lp_stop: './sounds/lp_stop.mp3',
  lp_drop: './sounds/lp_drop.mp3',
  gainlp: './sounds/gainlp.mp3',
  activate: './sounds/activate.mp3',
  summon: './sounds/summon.mp3',
  destroyed: './sounds/destroyed.mp3',
  coinflip: './sounds/coinflip.mp3',
  diceroll: './sounds/diceroll.mp3',
  nextturn: './sounds/nextturn.mp3'
};

const audioBufferCache = {};
let activeLpCountSource = null;

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

function preloadSound(key) {
  if (audioBufferCache[key]) return Promise.resolve(audioBufferCache[key]);
  const url = SOUND_FILES[key];
  if (!url) return Promise.resolve(null);

  return fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.arrayBuffer();
    })
    .then((buf) => {
      const ctx = getAudioCtx();
      return ctx ? ctx.decodeAudioData(buf) : null;
    })
    .then((decoded) => {
      if (decoded) audioBufferCache[key] = decoded;
      return decoded;
    })
    .catch((err) => {
      console.warn(`Fallback audio for ${key}:`, err);
      return null;
    });
}

function preloadAllSounds() {
  Object.keys(SOUND_FILES).forEach((k) => preloadSound(k));
}

function playOriginalSound(key, loop = false) {
  if (!state.soundEnabled) return null;
  const ctx = getAudioCtx();
  if (!ctx) return null;

  const vol = getMasterVolume();
  const buffer = audioBufferCache[key];

  if (!buffer) {
    preloadSound(key);
    return null;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = loop;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(vol, ctx.currentTime);

  source.connect(gainNode);
  gainNode.connect(ctx.destination);
  source.start(0);

  return source;
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
  const sfxKey = damageAmount >= 2000 ? 'directattack' : 'damage';
  const played = playOriginalSound(sfxKey);
  if (!played) {
    playDamageSynthesizerFallback(damageAmount);
  }
}

// Fallback synthesizer if audio is still fetching
function playDamageSynthesizerFallback(damageAmount = 1000) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const vol = getMasterVolume();
  const now = ctx.currentTime;
  const isHeavy = damageAmount >= 1500;

  const subOsc = ctx.createOscillator();
  const subGain = ctx.createGain();
  subOsc.type = 'sawtooth';
  subOsc.frequency.setValueAtTime(isHeavy ? 165 : 130, now);
  subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.35);

  subGain.gain.setValueAtTime(0.38 * vol, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
  subOsc.connect(subGain);
  subGain.connect(ctx.destination);
  subOsc.start(now);
  subOsc.stop(now + 0.39);
}

// 1B. Half LP (÷2 Solemn Judgment / Dinomorphia) Slash SFX
function playSlashHalfSfx() {
  if (!state.soundEnabled) return;
  const played = playOriginalSound('damage');
  if (!played) {
    playDamageSynthesizerFallback(2000);
  }
}

// 1C. Iconic Yu-Gi-Oh! Anime Life Point Counter Cascade Tick (fallback if loop not loaded)
function playAnimeLpTick(isHeal = false, stepIdx = 0) {
  if (!state.soundEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;

  const vol = getMasterVolume();
  const now = ctx.currentTime;

  if (isHeal) {
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

  // Classic Yu-Gi-Oh! Duel Monsters dual metallic chime
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
}

// 1D. Iconic Anime LP Counter Stop Lock Chime ("PI-PI -> TING!")
function playLpStopChime(isHeal = false) {
  if (!state.soundEnabled) return;
  const played = playOriginalSound('lp_stop');
  if (!played) {
    playLpStopChimeFallback(isHeal);
  }
}

function playLpStopChimeFallback(isHeal = false) {
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

  playOriginalSound('damage');

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
        if (parsed.tabletopMode === undefined) {
          parsed.tabletopMode = true;
        }
        delete parsed.nibiruCount;
        if (parsed.players[1]?.flags) delete parsed.players[1].flags;
        if (parsed.players[2]?.flags) delete parsed.players[2].flags;
        if (parsed.fieldSpellActive === undefined) parsed.fieldSpellActive = false;
        if (!parsed.activeField || !ARCHETYPES[parsed.activeField]) parsed.activeField = 'monarch';
        if (parsed.fieldActivator === undefined) parsed.fieldActivator = 1;
        if (parsed.particlesEnabled === undefined) parsed.particlesEnabled = true;
        if (parsed.players[1] && !parsed.players[1].archetype) parsed.players[1].archetype = 'monarch';
        if (parsed.players[2] && !parsed.players[2].archetype) parsed.players[2].archetype = 'blueeyes';
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
  const duration = absDiff >= 2000 ? 1100 : 850;
  const startTime = performance.now();
  const isHeal = toVal > fromVal;
  let lastTickTime = 0;
  let tickStep = 0;

  // Start authentic Yu-Gi-Oh! anime audio
  if (!isHeal) {
    if (activeLpCountSource) {
      try { activeLpCountSource.stop(); } catch (e) {}
      activeLpCountSource = null;
    }
    activeLpCountSource = playOriginalSound('lp_count_loop', true);
  } else {
    playOriginalSound('gainlp');
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(fromVal + (toVal - fromVal) * eased);

    displayEl.textContent = current;

    // Fallback ticker if loop audio buffer is not ready
    if (!activeLpCountSource && now - lastTickTime > 38 && progress < 0.96) {
      playAnimeLpTick(isHeal, tickStep++);
      lastTickTime = now;
    }

    if (progress < 1) {
      activeAnimations[playerNum] = requestAnimationFrame(step);
    } else {
      if (activeLpCountSource) {
        try { activeLpCountSource.stop(); } catch (e) {}
        activeLpCountSource = null;
      }
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
  const reasonInput = document.getElementById('calcReasonInput');
  if (reasonInput) reasonInput.value = '';

  const dlg = document.getElementById('calcDialog');
  if (dlg) {
    if (state.tabletopMode && playerNum === 2) {
      dlg.classList.add('tabletop-p2');
    } else {
      dlg.classList.remove('tabletop-p2');
    }
  }

  syncCalculatorTabs();
  updateCalculatorScreen();
  if (dlg && !dlg.open) dlg.showModal();
  playUiBeep(820, 0.05);
}

function syncCalculatorTabs() {
  const tab1 = document.getElementById('calcTabP1');
  const tab2 = document.getElementById('calcTabP2');
  if (tab1) tab1.classList.toggle('active', calcTargetPlayer === 1);
  if (tab2) tab2.classList.toggle('active', calcTargetPlayer === 2);

  const t1Name = document.getElementById('calcTabP1Name');
  if (t1Name) t1Name.textContent = state.players[1].name;
  const t1Lp = document.getElementById('calcTabP1Lp');
  if (t1Lp) t1Lp.textContent = `${state.players[1].lp} LP`;

  const t2Name = document.getElementById('calcTabP2Name');
  if (t2Name) t2Name.textContent = state.players[2].name;
  const t2Lp = document.getElementById('calcTabP2Lp');
  if (t2Lp) t2Lp.textContent = `${state.players[2].lp} LP`;

  const dlg = document.getElementById('calcDialog');
  if (dlg && state.tabletopMode) {
    dlg.classList.toggle('tabletop-p2', calcTargetPlayer === 2);
  }
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
  const header = document.getElementById(`p${playerNum}MarkersHeader`);
  if (header) {
    header.textContent = `${state.players[playerNum].name} (P${playerNum})`;
  }

  // Also render mini markers directly on the player card playmat!
  const cardMarkers = document.getElementById(`p${playerNum}CardMarkers`);
  const markers = state.players[playerNum].markers;

  if (cardMarkers) {
    if (!markers || markers.length === 0) {
      cardMarkers.innerHTML = '';
    } else {
      cardMarkers.innerHTML = markers
        .map((m) => {
          const countBadge = m.count > 1 ? `<span class="chip-cnt">×${m.count}</span>` : '';
          const posBadge = m.type === 'token' ? (m.position === 'DEF' ? '🛡️' : '⚔️') : '';
          return `
            <div class="card-mini-chip" data-open-markers="${playerNum}" title="${escapeHtml(m.name)} (Tocca per gestire)">
              <span>${m.icon || '🔮'}</span>
              <span>${escapeHtml(m.name)}</span>
              ${posBadge}
              ${countBadge}
            </div>
          `;
        })
        .join('');
    }
  }

  if (!container) return;

  if (!markers || markers.length === 0) {
    container.innerHTML = `<div class="marker-empty">Nessun segnalino attivo per ${escapeHtml(state.players[playerNum].name)}.</div>`;
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
  if (type === 'token') {
    playOriginalSound('summon') || playUiBeep(880, 0.05);
  } else {
    playOriginalSound('activate') || playUiBeep(880, 0.05);
  }
}

// ============================================================================
// 7. COIN TOSS & DICE ROLLER (SINGLE & MULTI)
// ============================================================================
function launchCoins(count = 1) {
  const coinVisual = document.getElementById('coinVisual');
  const coinText = document.getElementById('coinResultText');
  const multiContainer = document.getElementById('coinMultiResults');

  if (coinVisual) {
    coinVisual.classList.remove('flipping');
    void coinVisual.offsetWidth;
    coinVisual.classList.add('flipping');
  }

  playOriginalSound('coinflip') || playUiBeep(980, 0.08);

  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(Math.random() < 0.5 ? 'TESTA' : 'CROCE');
  }

  setTimeout(() => {
    const primary = results[0];
    if (coinVisual) {
      coinVisual.classList.remove('flipping');
      coinVisual.classList.toggle('tails-coin', primary === 'CROCE');
    }

    if (coinText) {
      coinText.className = 'coin-result-banner ' + (primary === 'TESTA' ? 'res-head' : 'res-tail');
      coinText.textContent = primary === 'TESTA' ? 'TESTA (Occhio del Millennio)' : 'CROCE (Puzzle del Millennio)';
    }

    if (multiContainer) {
      multiContainer.innerHTML = results
        .map((r, idx) => `<span class="rng-pill ${r === 'TESTA' ? 'pill-head' : 'pill-tail'}">Moneta ${idx + 1}: <strong>${r}</strong></span>`)
        .join('');
    }

    addLogEntry(0, `🪙 Lancio Moneta (${count}): ${results.join(', ')}`);
    saveState();
  }, 480);
}

function rollDice(count = 1) {
  const diceVisual = document.getElementById('diceVisual');
  const dicePipFace = document.getElementById('dicePipFace');
  const diceText = document.getElementById('diceResultText');
  const multiContainer = document.getElementById('diceMultiResults');
  const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  if (diceVisual) {
    diceVisual.classList.remove('rolling');
    void diceVisual.offsetWidth;
    diceVisual.classList.add('rolling');
  }

  playOriginalSound('diceroll') || playUiBeep(620, 0.08);

  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(Math.floor(Math.random() * 6) + 1);
  }

  setTimeout(() => {
    if (diceVisual) diceVisual.classList.remove('rolling');
    const primary = results[0];

    if (dicePipFace) {
      dicePipFace.textContent = diceFaces[primary - 1];
    } else if (diceVisual) {
      diceVisual.textContent = diceFaces[primary - 1];
    }

    if (diceText) {
      diceText.className = 'dice-result-banner res-dice';
      diceText.textContent = `RISULTATO: ${primary}`;
    }

    if (multiContainer) {
      multiContainer.innerHTML = results
        .map((r, idx) => `<span class="rng-pill">Dado ${idx + 1}: <strong>${r}</strong></span>`)
        .join('');
    }

    addLogEntry(0, `🎲 Lancio Dado D6 (${count}): ${results.join(', ')}`);
    saveState();
  }, 380);
}

// ============================================================================
// 8. TURN & DUELIST TRACKER
// ============================================================================
function renderTurnAndPhase() {
  const turnEl = document.getElementById('turnNumber');
  if (turnEl) turnEl.textContent = state.turn;

  const card1 = document.getElementById('playerCard1');
  const card2 = document.getElementById('playerCard2');
  if (card1) card1.classList.toggle('active-turn-card', state.activePlayer === 1);
  if (card2) card2.classList.toggle('active-turn-card', state.activePlayer === 2);

  const b1 = document.getElementById('p1TurnBadge');
  const b2 = document.getElementById('p2TurnBadge');
  if (b1) {
    b1.textContent = state.activePlayer === 1 ? '⚡ TUO TURNO' : '💤 IN ATTESA';
    b1.classList.toggle('badge-active', state.activePlayer === 1);
  }
  if (b2) {
    b2.textContent = state.activePlayer === 2 ? '⚡ TUO TURNO' : '💤 IN ATTESA';
    b2.classList.toggle('badge-active', state.activePlayer === 2);
  }
}

function advanceTurn() {
  state.turn += 1;
  state.activePlayer = state.activePlayer === 1 ? 2 : 1;

  renderTurnAndPhase();
  addLogEntry(0, `⏭ Inizia il Turno ${state.turn} (${state.players[state.activePlayer].name})`);
  showToast(`Turno ${state.turn} — Tocca a ${state.players[state.activePlayer].name}`);
  playOriginalSound('nextturn') || playUiBeep(920, 0.07);
  saveState();
}


// ============================================================================
// 9. TOURNAMENT ROUND TIMER (45:00 DEFAULT)
// ============================================================================
function renderTimer() {
  const mins = Math.floor(state.timerRemainingSec / 60);
  const secs = state.timerRemainingSec % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const digitsEl = document.getElementById('timerDigits');
  if (digitsEl) digitsEl.textContent = formatted;

  const widget = document.getElementById('timerWidget');
  if (widget) {
    widget.classList.toggle('timer-running', timerRunning);
    widget.classList.toggle('timer-expired', state.timerRemainingSec === 0);
  }
  const playIcon = document.getElementById('timerPlayIcon');
  if (playIcon) playIcon.textContent = timerRunning ? '⏸' : '▶';
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
          showToast('⏰ TEMPO SCADUTO! Procedura di Fine Match!');
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
    phase: state.phase || 'DP',
    player: playerNum,
    text,
    time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
  state.log.unshift(entry);
  if (state.log.length > 150) state.log.pop();
  renderLogs();
}

function renderLogs() {
  const fullContainer = document.getElementById('fullLogContainer');
  if (!fullContainer) return;

  if (state.log.length === 0) {
    fullContainer.innerHTML = `<div class="marker-empty">Nessun evento registrato.</div>`;
    return;
  }

  fullContainer.innerHTML = state.log
    .map((item) => {
      const pClass = item.player === 1 ? 'log-p1' : item.player === 2 ? 'log-p2' : '';
      return `
        <div class="mini-log-item ${pClass}">
          <span><strong>[T${item.turn}]</strong> ${escapeHtml(item.text)}</span>
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

// ============================================================================
// 10. FIELD SPELL & DYNAMIC ANIMATED BACKGROUND SYSTEM
// ============================================================================
function renderField() {
  const currentArch = ARCHETYPES[state.activeField] || ARCHETYPES.monarch;
  const isFieldActive = Boolean(state.fieldSpellActive);

  // 1. Container & Artwork Layer
  const bgContainer = document.getElementById('fieldBgContainer');
  const artLayer = document.getElementById('fieldArtLayer');
  if (bgContainer) {
    bgContainer.classList.toggle('field-spell-active', isFieldActive);
  }
  if (artLayer) {
    if (isFieldActive && currentArch.artUrl) {
      artLayer.style.backgroundImage = `url('${currentArch.artUrl}')`;
    } else {
      artLayer.style.backgroundImage = 'none';
    }
  }

  // 2. Arena Frosted Tint & Colors
  const arena = document.getElementById('duelArena');
  if (arena) {
    arena.classList.toggle('field-spell-active', isFieldActive);
    if (isFieldActive) {
      arena.style.setProperty('--field-border', currentArch.borderColor || 'rgba(245, 183, 49, 0.5)');
      arena.style.setProperty('--field-glow', currentArch.glowColor || 'rgba(245, 183, 49, 0.25)');
    } else {
      arena.style.removeProperty('--field-border');
      arena.style.removeProperty('--field-glow');
    }
  }

  // 3. Central Bar Field Spell Tool Button
  const fieldBtn = document.getElementById('openFieldSpellBtn');
  const fieldIcon = document.getElementById('fieldSpellBtnIcon');
  const fieldLbl = document.getElementById('fieldSpellBtnLbl');
  if (fieldBtn) {
    fieldBtn.classList.toggle('active-field-spell', isFieldActive);
    if (fieldIcon) {
      fieldIcon.textContent = isFieldActive ? currentArch.icon : '🏟️';
    }
    if (fieldLbl) {
      fieldLbl.textContent = isFieldActive ? currentArch.name.split(' ')[0] : 'Terreno';
    }
  }

  // 4. Player Cards Archetype Badges
  const p1Arch = ARCHETYPES[state.players[1]?.archetype] || ARCHETYPES.monarch;
  const p2Arch = ARCHETYPES[state.players[2]?.archetype] || ARCHETYPES.blueeyes;

  const p1Icon = document.getElementById('p1ArchetypeIcon');
  const p1Name = document.getElementById('p1ArchetypeName');
  if (p1Icon) p1Icon.textContent = p1Arch.icon;
  if (p1Name) p1Name.textContent = p1Arch.name;

  const p2Icon = document.getElementById('p2ArchetypeIcon');
  const p2Name = document.getElementById('p2ArchetypeName');
  if (p2Icon) p2Icon.textContent = p2Arch.icon;
  if (p2Name) p2Name.textContent = p2Arch.name;

  // 5. Field Dialog Status Box
  const statusThumb = document.getElementById('fieldStatusThumb');
  const statusPill = document.getElementById('fieldStatusPill');
  const statusTitle = document.getElementById('fieldStatusCardName');
  const statusDesc = document.getElementById('fieldStatusDesc');
  const insertBtnText = document.getElementById('fieldSpellInsertBtnText');
  const removeBtn = document.getElementById('fieldSpellRemoveBtn');
  const particlesCheck = document.getElementById('particlesToggleCheck');

  if (statusThumb) {
    statusThumb.src = currentArch.artUrl || './icon.svg';
  }
  if (statusPill) {
    if (isFieldActive) {
      statusPill.textContent = `✨ ATTIVA SUL CAMPO (${state.players[state.fieldActivator || 1]?.name})`;
      statusPill.classList.add('pill-active');
    } else {
      statusPill.textContent = 'NESSUNA MAGIA TERRENO ATTIVA';
      statusPill.classList.remove('pill-active');
    }
  }
  if (statusTitle) {
    statusTitle.textContent = currentArch.fieldSpellName;
  }
  if (statusDesc) {
    statusDesc.textContent = currentArch.desc;
  }
  if (insertBtnText) {
    insertBtnText.textContent = isFieldActive ? 'Rinnova / Cambia Terreno' : 'Magia Terreno Inserita';
  }
  if (removeBtn) {
    removeBtn.style.display = isFieldActive ? 'inline-flex' : 'none';
  }
  if (particlesCheck) {
    particlesCheck.checked = Boolean(state.particlesEnabled);
  }

  // 6. Highlight active archetype in modal grid
  renderArchetypesSelectionGrid();
}

function activateFieldSpell(archetypeKey, activatorPlayer = 1, showBanner = true) {
  const arch = ARCHETYPES[archetypeKey] || ARCHETYPES.monarch;
  state.fieldSpellActive = true;
  state.activeField = arch.id;
  state.fieldActivator = activatorPlayer;

  // Play official card activation sound effect
  playOriginalSound('activate') || playTrapChainSfx();

  // Show Anime Activation Banner
  if (showBanner) {
    const banner = document.getElementById('fieldActivationBanner');
    const bannerImg = document.getElementById('bannerCardImg');
    const bannerName = document.getElementById('bannerCardName');

    if (bannerImg) bannerImg.src = arch.cardUrl || arch.artUrl || './images/fields/monarch.jpg';
    if (bannerName) bannerName.textContent = arch.fieldSpellName;

    if (banner) {
      banner.style.display = 'flex';
      void banner.offsetWidth;
      banner.classList.add('show-banner');
      setTimeout(() => {
        banner.classList.remove('show-banner');
        setTimeout(() => {
          banner.style.display = 'none';
        }, 320);
      }, 1900);
    }
  }

  const actPlayerName = state.players[activatorPlayer]?.name || `Giocatore ${activatorPlayer}`;
  addLogEntry(activatorPlayer, `🏟️ Magia Terreno Inserita: ${arch.fieldSpellName} (${actPlayerName})`);
  showToast(`✨ Magia Terreno: ${arch.fieldSpellName} Attiva!`);

  renderField();
  saveState();
}

function deactivateFieldSpell() {
  state.fieldSpellActive = false;
  playUiBeep(440, 0.08);

  addLogEntry(0, `💥 Magia Terreno Rimossa / Distrutta dal Terreno`);
  showToast(`💥 Magia Terreno Rimossa dal Campo`);

  renderField();
  saveState();
}

let archTargetPlayer = 1;

function renderArchetypesSelectionGrid() {
  const grid = document.getElementById('archetypesSelectionGrid');
  if (!grid) return;

  const targetPlayer = archTargetPlayer || 1;
  const currentAssignedArch = state.players[targetPlayer]?.archetype || 'monarch';

  grid.innerHTML = Object.values(ARCHETYPES)
    .map((arch) => {
      const isSelectedForPlayer = arch.id === currentAssignedArch;

      return `
        <button type="button" class="arch-card ${isSelectedForPlayer ? 'active' : ''}" data-arch-id="${arch.id}" title="${escapeHtml(arch.desc)}">
          <div class="arch-card-top">
            <span class="arch-card-icon">${arch.icon}</span>
            <span class="arch-card-name">${escapeHtml(arch.name)}</span>
          </div>
          <div class="arch-card-thumb-wrap">
            <img class="arch-card-thumb" src="${arch.artUrl || './icon.svg'}" alt="${escapeHtml(arch.fieldSpellName)}" loading="lazy" />
          </div>
          <div class="arch-field-title">${escapeHtml(arch.fieldSpellName)}</div>
        </button>
      `;
    })
    .join('');
}

// ============================================================================
// CANVAS PARTICLES & AMBIENT ANIMATION ENGINE
// ============================================================================
let canvasEl = null;
let canvasCtx = null;
let animFrameId = null;
let particles = [];
let lightningCooldown = 0;

function initFieldParticlesCanvas() {
  canvasEl = document.getElementById('fieldCanvas');
  if (!canvasEl) return;
  canvasCtx = canvasEl.getContext('2d');
  if (!canvasCtx) return;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasEl.width = window.innerWidth * dpr;
    canvasEl.height = window.innerHeight * dpr;
    canvasCtx.scale(dpr, dpr);
    createParticlesPool();
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();
  startAnimationLoop();
}

function createParticlesPool() {
  particles = [];
  const count = 35;
  const w = window.innerWidth;
  const h = window.innerHeight;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2.8 + 1.2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: -(Math.random() * 0.8 + 0.3),
      alpha: Math.random() * 0.7 + 0.2,
      baseAlpha: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.03 + 0.015,
      sineAngle: Math.random() * Math.PI * 2,
      glyphRadius: Math.random() * 22 + 14
    });
  }
}

function triggerLightningFlash() {
  const flashEl = document.getElementById('fieldLightningFlash');
  if (flashEl) {
    flashEl.classList.add('flash-active');
    setTimeout(() => {
      flashEl.classList.remove('flash-active');
    }, 90);
  }
}

function drawLightningBolt(ctx, x1, y1, x2, y2, displace) {
  if (displace < 4) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    return;
  }
  const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displace;
  const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displace;
  drawLightningBolt(ctx, x1, y1, midX, midY, displace / 2);
  drawLightningBolt(ctx, midX, midY, x2, y2, displace / 2);
}

function startAnimationLoop() {
  let tick = 0;

  function renderFrame() {
    animFrameId = requestAnimationFrame(renderFrame);

    if (!canvasCtx || !state.particlesEnabled) {
      if (canvasCtx) canvasCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      return;
    }

    tick++;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvasCtx.clearRect(0, 0, w, h);

    const activeArch = ARCHETYPES[state.activeField] || ARCHETYPES.monarch;
    const pType = activeArch.particleType || 'lightning_monarch';
    const isFieldActive = Boolean(state.fieldSpellActive);

    // 1. MONARCH LIGHTNING & DIVINE EMBER PARTICLES
    if (pType === 'lightning_monarch') {
      particles.forEach((p) => {
        p.sineAngle += 0.02;
        p.x += Math.sin(p.sineAngle) * 0.4 + p.speedX;
        p.y += p.speedY;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }

        const alpha = Math.sin(tick * p.pulseSpeed) * 0.3 + p.baseAlpha;
        canvasCtx.save();
        canvasCtx.beginPath();
        canvasCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        canvasCtx.fillStyle = `rgba(251, 191, 36, ${Math.max(0.1, alpha)})`;
        canvasCtx.shadowColor = '#f59e0b';
        canvasCtx.shadowBlur = 8;
        canvasCtx.fill();
        canvasCtx.restore();
      });

      if (isFieldActive) {
        lightningCooldown++;
        if (lightningCooldown > 220) {
          lightningCooldown = 0;
          triggerLightningFlash();

          canvasCtx.save();
          canvasCtx.strokeStyle = '#fffbeb';
          canvasCtx.shadowColor = '#f59e0b';
          canvasCtx.shadowBlur = 18;
          canvasCtx.lineWidth = 2.5;

          const startX = Math.random() * (w * 0.7) + w * 0.15;
          const endX = startX + (Math.random() - 0.5) * 120;
          drawLightningBolt(canvasCtx, startX, 0, endX, h * 0.65, 55);
          canvasCtx.restore();
        }
      }
    } else if (pType === 'blue_stars') {
      particles.forEach((p) => {
        p.y += p.speedY * 0.7;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        const alpha = Math.sin(tick * p.pulseSpeed + p.sineAngle) * 0.4 + 0.5;
        canvasCtx.save();
        canvasCtx.beginPath();
        canvasCtx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
        canvasCtx.fillStyle = `rgba(56, 189, 248, ${Math.max(0.1, alpha)})`;
        canvasCtx.shadowColor = '#38bdf8';
        canvasCtx.shadowBlur = 10;
        canvasCtx.fill();
        canvasCtx.restore();
      });
    } else if (pType === 'arcane_glyphs') {
      particles.slice(0, 3).forEach((p, idx) => {
        canvasCtx.save();
        canvasCtx.translate(w * (0.25 + idx * 0.25), h * 0.5);
        canvasCtx.rotate(tick * 0.003 * (idx % 2 === 0 ? 1 : -1));
        canvasCtx.strokeStyle = 'rgba(192, 132, 252, 0.18)';
        canvasCtx.lineWidth = 1.2;
        canvasCtx.beginPath();
        canvasCtx.arc(0, 0, p.glyphRadius * 2.5, 0, Math.PI * 2);
        canvasCtx.stroke();
        canvasCtx.beginPath();
        canvasCtx.rect(-p.glyphRadius * 1.6, -p.glyphRadius * 1.6, p.glyphRadius * 3.2, p.glyphRadius * 3.2);
        canvasCtx.stroke();
        canvasCtx.restore();
      });

      particles.forEach((p) => {
        p.y += p.speedY * 0.8;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        canvasCtx.fillStyle = `rgba(192, 132, 252, ${p.baseAlpha})`;
        canvasCtx.fillRect(p.x, p.y, p.size, p.size);
      });
    } else if (pType === 'hero_searchlights') {
      canvasCtx.save();
      const sweepAngle1 = Math.sin(tick * 0.015) * 0.35 - 0.4;
      const grad1 = canvasCtx.createLinearGradient(0, h, Math.cos(sweepAngle1) * w, 0);
      grad1.addColorStop(0, 'rgba(251, 191, 36, 0.22)');
      grad1.addColorStop(1, 'rgba(251, 191, 36, 0)');
      canvasCtx.fillStyle = grad1;
      canvasCtx.beginPath();
      canvasCtx.moveTo(0, h);
      canvasCtx.lineTo(Math.cos(sweepAngle1) * w * 0.9, 0);
      canvasCtx.lineTo(Math.cos(sweepAngle1 + 0.15) * w * 1.1, 0);
      canvasCtx.closePath();
      canvasCtx.fill();
      canvasCtx.restore();

      particles.forEach((p) => {
        p.y += p.speedY * 1.1;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        canvasCtx.fillStyle = `rgba(239, 68, 68, ${p.baseAlpha})`;
        canvasCtx.beginPath();
        canvasCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        canvasCtx.fill();
      });
    } else if (pType === 'abyss_flames') {
      particles.forEach((p) => {
        p.y += p.speedY * 1.4;
        p.x += (Math.random() - 0.5) * 0.8;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        const alpha = (p.y / h) * 0.8;
        canvasCtx.save();
        canvasCtx.fillStyle = `rgba(244, 63, 94, ${alpha})`;
        canvasCtx.shadowColor = '#e11d48';
        canvasCtx.shadowBlur = 6;
        canvasCtx.beginPath();
        canvasCtx.arc(p.x, p.y, p.size * (p.y / h + 0.5), 0, Math.PI * 2);
        canvasCtx.fill();
        canvasCtx.restore();
      });
    } else if (pType === 'ocean_bubbles') {
      particles.forEach((p) => {
        p.sineAngle += 0.03;
        p.x += Math.sin(p.sineAngle) * 0.6;
        p.y += p.speedY * 1.2;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        canvasCtx.save();
        canvasCtx.strokeStyle = 'rgba(14, 165, 233, 0.45)';
        canvasCtx.fillStyle = 'rgba(14, 165, 233, 0.12)';
        canvasCtx.lineWidth = 1.2;
        canvasCtx.beginPath();
        canvasCtx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        canvasCtx.fill();
        canvasCtx.stroke();
        canvasCtx.restore();
      });
    } else {
      particles.forEach((p) => {
        p.y += p.speedY * 0.6;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        canvasCtx.fillStyle = `rgba(56, 189, 248, ${p.baseAlpha * 0.6})`;
        canvasCtx.beginPath();
        canvasCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        canvasCtx.fill();
      });
    }
  }

  animFrameId = requestAnimationFrame(renderFrame);
}

function renderAll() {
  const p1Name = document.getElementById('p1Name');
  const p2Name = document.getElementById('p2Name');
  if (p1Name) p1Name.value = state.players[1].name;
  if (p2Name) p2Name.value = state.players[2].name;

  const p1LpDisp = document.getElementById('p1LpDisplay');
  const p2LpDisp = document.getElementById('p2LpDisplay');
  if (p1LpDisp) p1LpDisp.textContent = state.players[1].lp;
  if (p2LpDisp) p2LpDisp.textContent = state.players[2].lp;
  updateLpVisualState(1, state.players[1].lp);
  updateLpVisualState(2, state.players[2].lp);

  const formatBadge = document.getElementById('formatBadgeText');
  if (formatBadge) formatBadge.textContent = `${state.startLp}`;
  const soundIcon = document.getElementById('soundIcon');
  if (soundIcon) soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
  const soundBtn = document.getElementById('soundToggleBtn');
  if (soundBtn) soundBtn.classList.toggle('active-chip', state.soundEnabled);

  const volSlider = document.getElementById('volumeSlider');
  const volText = document.getElementById('volumeValueText');
  if (volSlider && volText) {
    const pct = Math.round(getMasterVolume() * 100);
    volSlider.value = pct;
    volText.textContent = `${pct}%`;
  }

  const arena = document.getElementById('duelArena');
  if (arena) arena.classList.toggle('tabletop-mode', state.tabletopMode);
  const ttBtn = document.getElementById('tabletopModeBtn');
  if (ttBtn) ttBtn.classList.toggle('active-chip', state.tabletopMode);

  renderTurnAndPhase();
  renderMarkers(1);
  renderMarkers(2);
  renderMatchStars();
  renderTimer();
  renderLogs();
  updateUndoRedoButtons();
  renderField();
}

function resetDuel(newStartLp = state.startLp) {
  const p1Name = state.players[1].name;
  const p2Name = state.players[2].name;
  const p1Stars = state.players[1].stars;
  const p2Stars = state.players[2].stars;
  const p1Arch = state.players[1].archetype;
  const p2Arch = state.players[2].archetype;
  const activeField = state.activeField;
  const fieldSpellActive = state.fieldSpellActive;
  const particlesEnabled = state.particlesEnabled;
  const soundEnabled = state.soundEnabled;
  const soundVolume = getMasterVolume();
  const tabletopMode = state.tabletopMode;

  state = createDefaultState(newStartLp);
  state.players[1].name = p1Name;
  state.players[2].name = p2Name;
  state.players[1].stars = p1Stars;
  state.players[2].stars = p2Stars;
  state.players[1].archetype = p1Arch || 'monarch';
  state.players[2].archetype = p2Arch || 'blueeyes';
  state.activeField = activeField || 'monarch';
  state.fieldSpellActive = fieldSpellActive;
  state.particlesEnabled = particlesEnabled;
  state.soundEnabled = soundEnabled;
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
  initFieldParticlesCanvas();

  // Field Spell & Archetypes Dialog Controls
  function openFieldDialog(targetPlayer = 1) {
    archTargetPlayer = targetPlayer;
    const p1Pill = document.getElementById('archTargetP1');
    const p2Pill = document.getElementById('archTargetP2');
    if (p1Pill) p1Pill.classList.toggle('active', archTargetPlayer === 1);
    if (p2Pill) p2Pill.classList.toggle('active', archTargetPlayer === 2);
    renderField();
    const dlg = document.getElementById('fieldDialog');
    if (dlg) dlg.showModal();
  }

  const openFieldBtn = document.getElementById('openFieldSpellBtn');
  if (openFieldBtn) {
    openFieldBtn.addEventListener('click', () => openFieldDialog(state.activePlayer || 1));
  }

  const p1ArchBtn = document.getElementById('p1ArchetypeBtn');
  if (p1ArchBtn) {
    p1ArchBtn.addEventListener('click', () => openFieldDialog(1));
  }

  const p2ArchBtn = document.getElementById('p2ArchetypeBtn');
  if (p2ArchBtn) {
    p2ArchBtn.addEventListener('click', () => openFieldDialog(2));
  }

  const fieldInsertBtn = document.getElementById('fieldSpellInsertBtn');
  if (fieldInsertBtn) {
    fieldInsertBtn.addEventListener('click', () => {
      const targetArch = state.players[archTargetPlayer]?.archetype || state.activeField || 'monarch';
      activateFieldSpell(targetArch, archTargetPlayer, true);
    });
  }

  const fieldRemoveBtn = document.getElementById('fieldSpellRemoveBtn');
  if (fieldRemoveBtn) {
    fieldRemoveBtn.addEventListener('click', () => {
      deactivateFieldSpell();
    });
  }

  const archTargetP1Btn = document.getElementById('archTargetP1');
  const archTargetP2Btn = document.getElementById('archTargetP2');
  if (archTargetP1Btn && archTargetP2Btn) {
    archTargetP1Btn.addEventListener('click', () => {
      archTargetPlayer = 1;
      archTargetP1Btn.classList.add('active');
      archTargetP2Btn.classList.remove('active');
      renderArchetypesSelectionGrid();
    });
    archTargetP2Btn.addEventListener('click', () => {
      archTargetPlayer = 2;
      archTargetP2Btn.classList.add('active');
      archTargetP1Btn.classList.remove('active');
      renderArchetypesSelectionGrid();
    });
  }

  const archGrid = document.getElementById('archetypesSelectionGrid');
  if (archGrid) {
    archGrid.addEventListener('click', (e) => {
      const card = e.target.closest('[data-arch-id]');
      if (!card) return;
      const archId = card.getAttribute('data-arch-id');
      const arch = ARCHETYPES[archId];
      if (!arch) return;

      state.players[archTargetPlayer].archetype = archId;
      state.activeField = archId;

      if (state.fieldSpellActive) {
        activateFieldSpell(archId, archTargetPlayer, true);
      } else {
        renderField();
        saveState();
        playUiBeep(880, 0.04);
        showToast(`Mazzo ${state.players[archTargetPlayer].name}: ${arch.name}`);
      }
    });
  }

  const particlesCheck = document.getElementById('particlesToggleCheck');
  if (particlesCheck) {
    particlesCheck.addEventListener('change', (e) => {
      state.particlesEnabled = e.target.checked;
      saveState();
      showToast(state.particlesEnabled ? 'Effetti Particellari Attivati ⚡' : 'Effetti Particellari Disattivati');
    });
  }

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
  const p1Visor = document.getElementById('p1LpVisor');
  const p2Visor = document.getElementById('p2LpVisor');
  if (p1Visor) p1Visor.addEventListener('click', () => openCalculator(1));
  if (p2Visor) p2Visor.addEventListener('click', () => openCalculator(2));
  const openCalcBtn = document.getElementById('openCalcCenterBtn');
  if (openCalcBtn) openCalcBtn.addEventListener('click', () => openCalculator(state.activePlayer));

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
  const useBattleDiffBtn = document.getElementById('useBattleDiffBtn');
  if (useBattleDiffBtn) {
    useBattleDiffBtn.addEventListener('click', () => {
      const atk1 = parseInt(document.getElementById('battleAtk1').value, 10) || 0;
      const atk2 = parseInt(document.getElementById('battleAtk2').value, 10) || 0;
      const diff = Math.abs(atk1 - atk2);
      calcMode = 'sub';
      calcInputStr = String(diff);
      const reasonEl = document.getElementById('calcReasonInput');
      if (reasonEl) reasonEl.value = `Danno Battaglia (${atk1} vs ${atk2})`;
      updateCalculatorScreen();
      playUiBeep(860, 0.05);
    });
  }

  const calcApplyBtn = document.getElementById('calcApplyBtn');
  if (calcApplyBtn) calcApplyBtn.addEventListener('click', submitCalculator);

  // Undo / Redo
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');
  if (undoBtn) undoBtn.addEventListener('click', handleUndo);
  if (redoBtn) redoBtn.addEventListener('click', handleRedo);

  // Turn advance badge
  const turnCounterBtn = document.getElementById('turnCounterBtn');
  if (turnCounterBtn) turnCounterBtn.addEventListener('click', advanceTurn);

  const nextTurnBtn = document.getElementById('nextTurnBtn');
  if (nextTurnBtn) nextTurnBtn.addEventListener('click', advanceTurn);

  const activePlayerToggle = document.getElementById('activePlayerToggle');
  if (activePlayerToggle) {
    activePlayerToggle.addEventListener('click', () => {
      state.activePlayer = state.activePlayer === 1 ? 2 : 1;
      renderTurnAndPhase();
      saveState();
    });
  }

  // Phase buttons (if present)
  document.querySelectorAll('.phase-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const phase = btn.getAttribute('data-phase');
      state.phase = phase;
      renderTurnAndPhase();
      saveState();
      playUiBeep(780, 0.04);
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

  // Coin & Dice Modal & Direct Click
  document.getElementById('openCoinDiceBtn').addEventListener('click', () => {
    document.getElementById('coinDiceDialog').showModal();
  });

  const coinVisualEl = document.getElementById('coinVisual');
  const coinStageEl = document.getElementById('coinStage');
  if (coinStageEl) {
    coinStageEl.addEventListener('click', () => launchCoins(1));
  } else if (coinVisualEl) {
    coinVisualEl.addEventListener('click', () => launchCoins(1));
  }

  const diceVisualEl = document.getElementById('diceVisual');
  if (diceVisualEl) {
    diceVisualEl.addEventListener('click', () => rollDice(1));
  }

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

  // Center Bar Controls
  const ttBtn = document.getElementById('tabletopModeBtn');
  if (ttBtn) {
    ttBtn.addEventListener('click', () => {
      state.tabletopMode = !state.tabletopMode;
      renderAll();
      saveState();
      showToast(state.tabletopMode ? '⇅ Modalità Fronte a Fronte (180°) Attivata' : 'Modalità Standard Attivata');
    });
  }

  const sndBtn = document.getElementById('soundToggleBtn');
  if (sndBtn) {
    sndBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      renderAll();
      saveState();
      showToast(state.soundEnabled ? '🔊 Effetti Sonori Attivati' : '🔇 Audio Disattivato');
    });
  }

  const newDuelBtn = document.getElementById('newDuelBtn');
  if (newDuelBtn) {
    newDuelBtn.addEventListener('click', () => {
      const confirmDlg = document.getElementById('resetConfirmDialog');
      if (confirmDlg) {
        confirmDlg.showModal();
      } else {
        resetDuel(state.startLp);
      }
    });
  }

  const confirmResetBtn = document.getElementById('confirmResetBtn');
  if (confirmResetBtn) {
    confirmResetBtn.addEventListener('click', () => {
      resetDuel(state.startLp);
      const confirmDlg = document.getElementById('resetConfirmDialog');
      if (confirmDlg) closeTopLayer(confirmDlg);
      showToast('⚡ Nuovo duello iniziato! LP resettati.');
    });
  }

  // Center Bar Scroll Affordance Indicator
  const cbarEl = document.getElementById('centerDuelBar');
  const scrollInd = document.getElementById('cbarScrollIndicator');
  if (cbarEl && scrollInd) {
    cbarEl.addEventListener('scroll', () => {
      const isAtEnd = cbarEl.scrollLeft + cbarEl.clientWidth >= cbarEl.scrollWidth - 12;
      scrollInd.classList.toggle('hidden', isAtEnd);
    }, { passive: true });
  }

  // Keyboard Shortcuts (Ctrl+Z: Undo, Ctrl+Y / Ctrl+Shift+Z: Redo)
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      undoLpChange();
    } else if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')) {
      e.preventDefault();
      redoLpChange();
    }
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

  // Preload all authentic Yu-Gi-Oh! anime sound files
  preloadAllSounds();

  // Demo Original Anime Damage Sequence Button
  function playDemoDamageSequence() {
    state.soundEnabled = true;
    renderAll();
    playDamageImpactSfx(2500);
    triggerScreenDamageEffect('red', true);
    const loopSrc = playOriginalSound('lp_count_loop', true);
    setTimeout(() => {
      if (loopSrc) {
        try { loopSrc.stop(); } catch (e) {}
      }
      playLpStopChime(false);
    }, 1400);
  }

  const testDmgBtn = document.getElementById('testDamageSfxBtn');
  if (testDmgBtn) {
    testDmgBtn.addEventListener('click', playDemoDamageSequence);
  }

  // Duel SFX Soundboard Buttons (Original Anime Clips)
  document.querySelectorAll('[data-sfx]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.soundEnabled = true;
      renderAll();
      const sfx = btn.getAttribute('data-sfx');
      if (sfx === 'damage') {
        playDamageImpactSfx(1000);
        triggerScreenDamageEffect('red', false);
        showToast('💥 Danno Anime Originale');
      } else if (sfx === 'directattack') {
        playDamageImpactSfx(3000);
        triggerScreenDamageEffect('red', true);
        showToast('⚡ Attacco Diretto Anime!');
      } else if (sfx === 'activate') {
        playOriginalSound('activate') || playTrapChainSfx();
        showToast('🪤 Attivazione Magia / Trappola!');
      } else if (sfx === 'summon') {
        playOriginalSound('summon') || playBossSummonSfx();
        showToast('🌟 Mostro Evocato sul Terreno!');
      } else if (sfx === 'destroyed') {
        playOriginalSound('destroyed') || playMonsterShatterSfx();
        triggerScreenDamageEffect('red', false);
        showToast('💎 Mostro Distrutto!');
      } else if (sfx === 'lp-drop') {
        playOriginalSound('lp_drop');
        showToast('📟 Conteggio Life Points Originale Anime');
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
