/* ═══════════════════════════════════════════════════════════
   LE MARIN HÔTEL – app.js
   Three.js particles · GSAP animations · Booking DB · i18n
═══════════════════════════════════════════════════════════ */

'use strict';

// ─── PHOTO MAP ───────────────────────────────────────────
const PHOTOS = {
  exterior_night:  'assets/images/hotel_night_wide.jpg',
  entrance_night:  'assets/images/entrance_night.jpg',
  hotel_day:       'assets/images/hotel_day.jpg',
  reception_main:  'assets/images/reception_main.jpg',
  reception_blue:  'assets/images/reception_blue.jpg',
  hall_wide:       'assets/images/hall_wide.jpg',
  lobby_seating:   'assets/images/lobby_seating.jpg',
  stairs_purple:   'assets/images/stairs_purple.jpg',
  stairs_grand:    'assets/images/stairs_grand.jpg',
  corridor:        'assets/images/corridor.jpg',
  cafeteria:       'assets/images/cafeteria.jpg',
  restaurant_bar:  'assets/images/restaurant_bar.jpg',
  room_studio:     'assets/images/room_studio.jpg',
  suite_blue:      'assets/images/suite_blue.jpg',
  chambre_double:  'assets/images/chambre_double.jpg',
  appartement:     'assets/images/appartement.jpg',
  lounge_day:      'assets/images/lounge_day.jpg',
  lounge_night:    'assets/images/lounge_night.jpg',
  glass_entrance:  'assets/images/glass_entrance.jpg',
  breakfast:       'assets/images/breakfast.jpg',
};

// User's real gallery photos (from C:\Users\HP\Pictures\Saved Pictures\30052026)
const USER_PHOTOS = [
  'assets/images/gallery/031f8414-8dda-40a0-831f-cd64db0c2a82.jfif',
  'assets/images/gallery/39efeac4-a0b2-470d-b332-f7f81612a14e.jfif',
  'assets/images/gallery/611888cd-b89c-4c8b-a359-b7fb278e5488.jfif',
  'assets/images/gallery/6a8e729a-0d4e-4bc0-9d84-2917d92b4700.jfif',
  'assets/images/gallery/869837c7-db87-4c6e-ae84-7d3066a4d046.jfif',
  'assets/images/gallery/91b2f793-5071-4443-a5a1-a8540236cf38.jfif',
  'assets/images/gallery/9f573636-f4ea-4f5d-a172-d87c6f0f1740.jfif',
  'assets/images/gallery/a0411537-d6c7-44b7-ba11-8c6b9371ebb1.jfif',
  'assets/images/gallery/a792cb6e-6401-41ac-812b-43d04d8dd62f.jfif',
  'assets/images/gallery/ba03e2b9-fc76-4b0c-94a6-f32de04267ac.jfif',
];

// Combined gallery: user's real photos first, then hotel stock photos
const GALLERY_IMAGES = [
  { src: 'assets/images/gallery/IMG_1827.MOV', caption: 'Vidéo – Le Marin Hôtel', isVideo: true },
  { src: USER_PHOTOS[0],           caption: 'Le Marin – Photo Réelle' },
  { src: USER_PHOTOS[1],           caption: 'Le Marin – Photo Réelle' },
  { src: USER_PHOTOS[2],           caption: 'Le Marin – Photo Réelle' },
  { src: USER_PHOTOS[3],           caption: 'Le Marin – Photo Réelle' },
  { src: USER_PHOTOS[4],           caption: 'Le Marin – Photo Réelle' },
  { src: USER_PHOTOS[5],           caption: 'Le Marin – Photo Réelle' },
  { src: USER_PHOTOS[6],           caption: 'Le Marin – Photo Réelle' },
  { src: USER_PHOTOS[7],           caption: 'Le Marin – Photo Réelle' },
  { src: USER_PHOTOS[8],           caption: 'Le Marin – Photo Réelle' },
  { src: USER_PHOTOS[9],           caption: 'Le Marin – Photo Réelle' },
  { src: PHOTOS.exterior_night,    caption: 'Vue Extérieure – Nuit' },
  { src: PHOTOS.entrance_night,    caption: 'Entrée Principale – Nuit' },
  { src: PHOTOS.reception_main,    caption: 'Hall de Réception' },
  { src: PHOTOS.stairs_purple,     caption: 'Escaliers Intérieurs' },
  { src: PHOTOS.hall_wide,         caption: 'Grand Hall' },
  { src: PHOTOS.lobby_seating,     caption: 'Salon de Lobby' },
  { src: PHOTOS.corridor,          caption: 'Couloir des Chambres' },
  { src: PHOTOS.stairs_grand,      caption: 'Grand Escalier' },
  { src: PHOTOS.cafeteria,         caption: 'Cafétéria & Restauration' },
  { src: PHOTOS.restaurant_bar,    caption: 'Restaurant & Bar' },
  { src: PHOTOS.suite_blue,        caption: 'Suite Ambiance Bleue' },
  { src: PHOTOS.chambre_double,    caption: 'Chambre Double' },
  { src: PHOTOS.appartement,       caption: 'Appartement avec Cuisine' },
  { src: PHOTOS.lounge_day,        caption: 'Salon – Vue de Jour' },
  { src: PHOTOS.breakfast,         caption: 'Petit-Déjeuner Le Marin' },
  { src: PHOTOS.glass_entrance,    caption: 'Espace Vitré – Entrée' },
  { src: PHOTOS.lounge_night,      caption: 'Salon de Nuit' },
  { src: PHOTOS.hotel_day,         caption: 'Façade de Jour' },
  { src: PHOTOS.reception_blue,    caption: 'Réception – Éclairage Bleu' },
];

// ─── WEB AUDIO SOUND ENGINE ───────────────────────────────
const SFX = (() => {
  let ctx = null;
  let soundEnabled = true;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  // Synth door-chime effect (like a hotel door)
  function doorChime() {
    if (!soundEnabled) return;
    try {
      const ac = getCtx();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
      notes.forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ac.currentTime + i * 0.18);
        gain.gain.setValueAtTime(0, ac.currentTime + i * 0.18);
        gain.gain.linearRampToValueAtTime(0.18, ac.currentTime + i * 0.18 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + i * 0.18 + 1.2);
        osc.start(ac.currentTime + i * 0.18);
        osc.stop(ac.currentTime + i * 0.18 + 1.3);
      });
    } catch(e) {}
  }

  // Soft click
  function click() {
    if (!soundEnabled) return;
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ac.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ac.currentTime + 0.06);
      gain.gain.setValueAtTime(0.12, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + 0.12);
    } catch(e) {}
  }

  // Whoosh / page open
  function whoosh() {
    if (!soundEnabled) return;
    try {
      const ac = getCtx();
      const buf = ac.createBuffer(1, ac.sampleRate * 0.3, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const src = ac.createBufferSource();
      src.buffer = buf;
      const filter = ac.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2000;
      filter.Q.value = 0.5;
      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.08, ac.currentTime);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);
      src.start();
    } catch(e) {}
  }

  function toggle() {
    soundEnabled = !soundEnabled;
    const on = document.getElementById('soundIconOn');
    const off = document.getElementById('soundIconOff');
    if (on) on.style.display = soundEnabled ? '' : 'none';
    if (off) off.style.display = soundEnabled ? 'none' : '';
    if (soundEnabled) click();
  }

  return { doorChime, click, whoosh, toggle, isEnabled: () => soundEnabled };
})();

// ─── AMBIENT MUSIC ENGINE ─────────────────────────────────
const MUSIC = (() => {
  let ctx = null;
  let isPlaying = false;
  let gainNode = null;
  let oscillators = [];

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  // Generate a smooth, modern lounge/jazz ambient pad
  function startAmbient() {
    if (isPlaying) return;
    try {
      const ac = getCtx();
      gainNode = ac.createGain();
      gainNode.gain.setValueAtTime(0, ac.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.06, ac.currentTime + 2);
      gainNode.connect(ac.destination);

      // Ambient pad with warm chords (Cmaj7 voicing)
      const notes = [261.63, 329.63, 392, 493.88]; // C4 E4 G4 B4
      notes.forEach((freq, i) => {
        const osc = ac.createOscillator();
        const oscGain = ac.createGain();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ac.currentTime);
        // Slow vibrato
        const lfo = ac.createOscillator();
        const lfoGain = ac.createGain();
        lfo.frequency.setValueAtTime(0.3 + i * 0.1, ac.currentTime);
        lfoGain.gain.setValueAtTime(1.5, ac.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        oscGain.gain.setValueAtTime(0.15 - i * 0.02, ac.currentTime);
        osc.connect(oscGain);
        oscGain.connect(gainNode);
        osc.start();
        oscillators.push(osc, lfo);
      });

      // Add soft noise for warmth
      const bufSize = ac.sampleRate * 4;
      const noiseBuf = ac.createBuffer(1, bufSize, ac.sampleRate);
      const noiseData = noiseBuf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) noiseData[i] = (Math.random() * 2 - 1) * 0.02;
      const noiseSrc = ac.createBufferSource();
      noiseSrc.buffer = noiseBuf;
      noiseSrc.loop = true;
      const noiseFilter = ac.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = 800;
      noiseSrc.connect(noiseFilter);
      noiseFilter.connect(gainNode);
      noiseSrc.start();
      oscillators.push(noiseSrc);

      isPlaying = true;
    } catch(e) { console.log('Music error:', e); }
  }

  function stop() {
    if (!isPlaying) return;
    try {
      if (gainNode) gainNode.gain.linearRampToValueAtTime(0, (ctx?.currentTime || 0) + 1.5);
      setTimeout(() => {
        oscillators.forEach(o => { try { o.stop(); } catch(e) {} });
        oscillators = [];
        isPlaying = false;
      }, 2000);
    } catch(e) {}
  }

  function toggle() {
    if (isPlaying) stop(); else startAmbient();
    return isPlaying;
  }

  return { startAmbient, stop, toggle, isPlaying: () => isPlaying };
})();

// ─── TRANSLATIONS ─────────────────────────────────────────
const translations = {
  fr: {
    'Accueil': 'Accueil', 'Chambres': 'Chambres', 'Suites': 'Suites',
    'Appartements': 'Appartements', 'Galerie': 'Galerie',
    'Localisation': 'Localisation', 'Contact': 'Contact',
    'Réserver': 'Réserver', 'Réserver Maintenant': 'Réserver Maintenant',
    'Disponible': 'Disponible',
  },
  ar: {
    'Accueil': 'الرئيسية', 'Chambres': 'الغرف', 'Suites': 'الأجنحة',
    'Appartements': 'الشقق', 'Galerie': 'المعرض',
    'Localisation': 'الموقع', 'Contact': 'التواصل',
    'Réserver': 'احجز', 'Réserver Maintenant': 'احجز الآن',
    'Disponible': 'متاح',
  }
};

let currentLang = 'fr';
let currentScene = 0;
let lightboxIndex = 0;
let sceneInterval;
let bookingRoomType = '';
let bookingBasePrice = 0;

// ─── DOM READY ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initSounds();
  initHeroImages();
  initThreeJS();
  initNavbar();
  initDroneShow();
  initTimeSlider();
  initGallery();
  initScrollReveal();
  initLangSwitcher();
  initDayNightToggle();
  initBookingForm();
  initAdminPanel();
  initReviewsSystem();
  preloadImages();
  updateHeroImages();
});

// ─── INIT SOUNDS ──────────────────────────────────────────
function initSounds() {
  // Sound toggle button
  document.getElementById('soundToggleNav')?.addEventListener('click', SFX.toggle);

  // Door chime on page load (after 1s delay)
  setTimeout(() => SFX.doorChime(), 1200);

  // Click sound on all buttons
  document.addEventListener('click', (e) => {
    const el = e.target.closest('button, a, .gallery-item, .room-card, .service-card, .star-btn');
    if (el) SFX.click();
  });

  // Whoosh on gallery open
  document.querySelector('[href="#galerie"]')?.addEventListener('click', () => setTimeout(SFX.whoosh, 300));
}

// ─── LOADER ───────────────────────────────────────────────
function initLoader() {
  const bar = document.getElementById('loaderBar');
  const text = document.getElementById('loaderText');
  const texts = ['Bienvenue…', 'Chargement des photos…', 'Préparation de votre expérience…', 'Prêt!'];
  let progress = 0;
  let textIdx = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress > 100) progress = 100;
    bar.style.width = progress + '%';
    textIdx = Math.floor((progress / 100) * (texts.length - 1));
    text.textContent = texts[Math.min(textIdx, texts.length - 1)];

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        // Drone HUD removed
      }, 600);
    }
  }, 80);
}

// ─── HERO IMAGES SETUP ────────────────────────────────────
const HERO_SCENES = [
  { layer: 'layerAerial',    img: 'heroImgAerial',    src: PHOTOS.exterior_night,  alt: 'Vue aérienne hôtel' },
  { layer: 'layerEntrance',  img: 'heroImgEntrance',  src: PHOTOS.entrance_night,  alt: 'Entrée hôtel' },
  { layer: 'layerReception', img: 'heroImgReception', src: PHOTOS.reception_main,  alt: 'Réception hôtel' },
  { layer: 'layerStairs',    img: 'heroImgStairs',    src: PHOTOS.stairs_purple,   alt: 'Escaliers hôtel' },
];

function updateHeroImages() {
  HERO_SCENES.forEach(s => {
    const imgEl = document.getElementById(s.img);
    if (imgEl) { imgEl.src = s.src; imgEl.alt = s.alt; }
  });
}

function initHeroImages() {
  // Set first layer active
  const layer = document.getElementById('layerAerial');
  if (layer) layer.classList.add('active');
}

function startDroneSequence() {
  showScene(0);
  sceneInterval = setInterval(() => {
    currentScene = (currentScene + 1) % HERO_SCENES.length;
    showScene(currentScene);
  }, 5000);

  // Dot click
  document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(sceneInterval);
      currentScene = parseInt(dot.dataset.scene);
      showScene(currentScene);
      sceneInterval = setInterval(() => {
        currentScene = (currentScene + 1) % HERO_SCENES.length;
        showScene(currentScene);
      }, 5000);
    });
  });
}

function showScene(idx) {
  HERO_SCENES.forEach((s, i) => {
    const layer = document.getElementById(s.layer);
    if (layer) layer.classList.toggle('active', i === idx);
  });
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));

  // Update HUD altitude
  const alts = ['120m', '45m', '8m', '15m'];
  const hudBl = document.querySelector('.hud-bl');
  if (hudBl) hudBl.textContent = `ALT: ${alts[idx]}`;
}

// ─── THREE.JS PARTICLE FIELD ──────────────────────────────
function initThreeJS() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  camera.position.z = 30;

  // Stars / particles
  const geometry = new THREE.BufferGeometry();
  const count = 800;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

    // Gold and blue hues
    const t = Math.random();
    if (t < 0.5) {
      // Gold particles
      colors[i * 3]     = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 1] = 0.65 + Math.random() * 0.2;
      colors[i * 3 + 2] = 0.2 + Math.random() * 0.2;
    } else {
      // Blue particles
      colors[i * 3]     = 0.15 + Math.random() * 0.1;
      colors[i * 3 + 1] = 0.25 + Math.random() * 0.2;
      colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.25,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation loop
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;

    particles.rotation.y += 0.0008;
    particles.rotation.x += 0.0003;

    // Parallax
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 3 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

// ─── NAVBAR ───────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    // Active link
    const sections = ['accueil','chambres','galerie','localisation','contact'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const link = document.querySelector(`[href="#${id}"]`);
      if (link) link.classList.toggle('active', rect.top <= 100 && rect.bottom > 100);
    });
  });

  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ─── PARALLAX SCROLL ENGINE ───────────────────────────────
function initDroneShow() {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    // Hero parallax
    const hero = document.querySelector('.hero-section');
    if (hero) {
      const heroH = hero.offsetHeight;
      const progress = Math.min(scrolled / heroH, 1);
      const video = document.getElementById('heroVideo');
      if (video) video.style.transform = `scale(${1 + progress * 0.15}) translateY(${progress * 50}px)`;
      const content = document.getElementById('heroContent');
      if (content) {
        content.style.opacity = 1 - progress * 1.5;
        content.style.transform = `translateY(${progress * -60}px)`;
      }
    }

    // Services section parallax
    const servicesParallax = document.querySelector('.services-parallax-bg .parallax-img');
    if (servicesParallax) {
      const rect = servicesParallax.closest('section')?.getBoundingClientRect();
      if (rect) {
        const offset = rect.top / window.innerHeight;
        servicesParallax.style.transform = `translateY(${offset * -60}px) scale(1.15)`;
      }
    }

    // Rooms section parallax
    const roomsBg = document.querySelector('.rooms-bg-img');
    if (roomsBg) {
      const rect = roomsBg.closest('section')?.getBoundingClientRect();
      if (rect) {
        const offset = rect.top / window.innerHeight;
        roomsBg.style.transform = `translateY(${offset * -40}px) scale(1.1)`;
      }
    }

    // Gallery parallax
    document.querySelectorAll('.gallery-item').forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const speed = 0.03 + (i % 3) * 0.01;
        const yOffset = (rect.top - window.innerHeight / 2) * speed;
        item.style.transform = `translateY(${yOffset}px)`;
      }
    });
  });
}

// ─── TIME SLIDER (DAY / NIGHT) ────────────────────────────
function initTimeSlider() {
  const slider = document.getElementById('timeSlider');
  const nightPhoto = document.getElementById('nightPhoto');
  const dayPhoto = document.getElementById('dayPhoto');
  const badge = document.getElementById('timeBadge');
  const fill = document.getElementById('timeSliderFill');

  if (!slider) return;

  // Assign real photos
  if (nightPhoto) nightPhoto.src = PHOTOS.exterior_night;
  if (dayPhoto)   dayPhoto.src   = PHOTOS.hotel_day;

  slider.addEventListener('input', () => {
    const val = parseInt(slider.value); // 0=day, 100=night
    if (val >= 50) {
      nightPhoto.classList.add('active');
      dayPhoto.classList.remove('active');
      badge.textContent = '🌙 NUIT';
      badge.style.borderColor = 'rgba(77,111,255,0.6)';
      badge.style.color = '#a0b4ff';
    } else {
      dayPhoto.classList.add('active');
      nightPhoto.classList.remove('active');
      badge.textContent = '🌅 JOUR';
      badge.style.borderColor = 'rgba(201,168,76,0.6)';
      badge.style.color = 'var(--gold)';
    }
  });
}

// ─── GALLERY ──────────────────────────────────────────────
function initGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = '';

  // Show all photos in a masonry-style layout
  // First item is video, next 10 are user's real photos, rest are stock
  GALLERY_IMAGES.forEach((img, idx) => {
    const item = document.createElement('div');
    // Alternate large/tall/normal layout
    let cls = '';
    if (idx === 0 || idx === 11) cls = 'large';
    else if (idx === 3 || idx === 8 || idx === 16) cls = 'tall';
    item.className = 'gallery-item' + (cls ? ' ' + cls : '');
    item.setAttribute('data-index', idx);

    // Day/night effect: user photos get a special night overlay
    const isUserPhoto = idx > 0 && idx < 11;

    if (img.isVideo) {
      item.innerHTML = `
        <div class="gallery-video-wrap">
          <video src="${img.src}" muted loop preload="metadata" class="gallery-video-thumb"></video>
          <div class="gallery-play-icon">▶</div>
        </div>
        <div class="gallery-overlay"><span>${img.caption}</span></div>
      `;
      item.onmouseenter = () => item.querySelector('video')?.play();
      item.onmouseleave = () => { const v = item.querySelector('video'); if(v){v.pause();v.currentTime=0;} };
      item.onclick = () => { SFX.whoosh(); openVideoLightbox(img.src); };
    } else {
      item.onclick = () => { SFX.whoosh(); openLightbox(idx); };
      item.innerHTML = `
        <img src="${img.src}" alt="${img.caption}" loading="lazy" />
        ${isUserPhoto ? '<div class="gallery-night-overlay"></div>' : ''}
        <div class="gallery-overlay"><span>${img.caption}${isUserPhoto ? ' <em style="font-size:.7em;opacity:.7">★ Photo authentique</em>' : ''}</span></div>
      `;
    }
    grid.appendChild(item);
  });

  // Day/Night slider controls brightness/saturation
  const slider = document.getElementById('dayNightSlider');
  slider?.addEventListener('input', () => {
    const val = parseInt(slider.value); // 100=day, 0=night
    const brightness = 0.75 + (val / 100) * 0.25; // 0.75 to 1.0
    const saturate = 0.8 + (val / 100) * 0.2;     // 0.8 to 1.0
    const hueShift = (1 - val / 100) * 15;        // Subtle warm blue shift
    const galleryEl = document.getElementById('galleryGrid');
    if (galleryEl) {
      galleryEl.style.filter = `brightness(${brightness}) saturate(${saturate}) hue-rotate(${hueShift}deg)`;
      galleryEl.style.transition = 'filter 1.5s ease';
    }
    // Night overlay on user photos
    document.querySelectorAll('.gallery-night-overlay').forEach(overlay => {
      overlay.style.opacity = (1 - val / 100) * 0.3; // Max 0.3 opacity for premium aesthetics
      overlay.style.background = `linear-gradient(180deg, rgba(10,22,40,${(1-val/100)*0.15}), rgba(20,40,80,${(1-val/100)*0.25}))`;
    });
    // Stars effect at night
    const gallerySection = document.getElementById('galerie');
    if (gallerySection) {
      gallerySection.classList.toggle('gallery-night-mode', val < 40);
    }
  });

  // Sync gallery slider with initial theme
  if (slider) {
    const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    slider.value = initialTheme === 'light' ? 100 : 0;
    slider.dispatchEvent(new Event('input'));
  }

  // Auto-play ambient music when gallery comes into view
  const gallerySection = document.getElementById('galerie');
  if (gallerySection) {
    const musicObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && SFX.isEnabled()) {
          MUSIC.startAmbient();
        } else {
          MUSIC.stop();
        }
      });
    }, { threshold: 0.3 });
    musicObserver.observe(gallerySection);
  }
}

// Lightbox
function openLightbox(idx) {
  lightboxIndex = idx;
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  const counter = document.getElementById('lightboxCounter');
  lb.classList.add('open');
  img.src = GALLERY_IMAGES[idx].src;
  cap.textContent = GALLERY_IMAGES[idx].caption;
  if (counter) counter.textContent = `${idx + 1} / ${GALLERY_IMAGES.length}`;
  document.body.style.overflow = 'hidden';
}
// Video Lightbox
function openVideoLightbox(src) {
  const lb = document.getElementById('lightbox');
  const imgEl = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  lb.classList.add('open');
  imgEl.style.display = 'none';
  // Create video element
  let videoEl = lb.querySelector('.lightbox-video');
  if (!videoEl) {
    videoEl = document.createElement('video');
    videoEl.className = 'lightbox-video';
    videoEl.controls = true;
    videoEl.autoplay = true;
    videoEl.style.cssText = 'max-width:90vw;max-height:80vh;border-radius:12px;';
    imgEl.parentNode.insertBefore(videoEl, imgEl);
  }
  videoEl.src = src;
  videoEl.style.display = '';
  cap.textContent = 'Vidéo – Le Marin Hôtel';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('open');
  const videoEl = lb.querySelector('.lightbox-video');
  if (videoEl) { videoEl.pause(); videoEl.style.display = 'none'; }
  const imgEl = document.getElementById('lightboxImg');
  if (imgEl) imgEl.style.display = '';
  document.body.style.overflow = '';
}
function prevLight() {
  SFX.click();
  lightboxIndex = (lightboxIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  openLightbox(lightboxIndex);
}
function nextLight() {
  SFX.click();
  lightboxIndex = (lightboxIndex + 1) % GALLERY_IMAGES.length;
  openLightbox(lightboxIndex);
}
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft')  prevLight();
  if (e.key === 'ArrowRight') nextLight();
});

// View ALL photos modal
function openAllPhotosModal() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  // Show all hidden items (if any are hidden)
  document.querySelectorAll('.gallery-item.gallery-hidden').forEach(el => {
    el.classList.remove('gallery-hidden');
  });
  // Open lightbox from first photo
  openLightbox(0);
  SFX.whoosh();
}

// ─── SCROLL REVEAL ────────────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll(
    '.reveal, .room-card, .wt-scene, .info-item, .feature-item, .loc-item, .walkthrough-header, .rooms-header, .gallery-header, .time-container, .section-heading'
  );
  els.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
}

// ─── LANGUAGE SWITCHER ────────────────────────────────────
function initLangSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b === btn));
      applyLang(currentLang);
    });
  });
}

function applyLang(lang) {
  // Update dir
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  if (lang === 'ar') {
    document.body.style.fontFamily = "'Amiri', serif";
  } else {
    document.body.style.fontFamily = '';
  }

  const attr = `data-${lang}`;
  document.querySelectorAll(`[${attr}]`).forEach(el => {
    el.textContent = el.getAttribute(attr);
  });
}

// ─── DAY / NIGHT TOGGLE ───────────────────────────────────
function initDayNightToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  // Détection de l'heure locale et application automatique
  const savedTheme = localStorage.getItem('lm_theme_v3');
  let themeToApply = savedTheme;

  if (!savedTheme) {
    const hour = new Date().getHours();
    const isDayTime = hour >= 6 && hour < 19; // De 6h à 19h
    themeToApply = isDayTime ? 'light' : 'dark';
  }

  // Application du thème au chargement
  applyTheme(themeToApply);

  btn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('lm_theme_v3', theme);

  // Synchronisation du curseur de la galerie s'il existe
  const slider = document.getElementById('dayNightSlider');
  if (slider) {
    slider.value = theme === 'light' ? 100 : 0;
    // Déclencher manuellement l'événement d'input pour appliquer les filtres
    slider.dispatchEvent(new Event('input'));
  }
}

// ─── BOOKING MODAL ────────────────────────────────────────
function initBookingForm() {
  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  const checkIn = document.getElementById('bCheckIn');
  const checkOut = document.getElementById('bCheckOut');
  if (checkIn) checkIn.min = today;
  if (checkOut) checkOut.min = today;

  checkIn?.addEventListener('change', () => {
    if (checkOut) checkOut.min = checkIn.value;
    updateBookingSummary();
  });
  checkOut?.addEventListener('change', updateBookingSummary);
  document.getElementById('bRoomType')?.addEventListener('change', updateBookingSummary);
  document.getElementById('bGuests')?.addEventListener('change', updateBookingSummary);
}

function updateBookingSummary() {
  const checkIn  = document.getElementById('bCheckIn')?.value;
  const checkOut = document.getElementById('bCheckOut')?.value;
  const roomType = document.getElementById('bRoomType')?.value;
  const summary  = document.getElementById('bookingSummary');
  if (!checkIn || !checkOut || !summary) return;

  const nights = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000));
  const priceMatch = roomType.match(/(\d[\d\s]*)\s*DA/);
  const pricePerNight = priceMatch ? parseInt(priceMatch[1].replace(/\s/g, '')) : 7000;
  const total = nights * pricePerNight;

  summary.innerHTML = `
    🌙 <strong>${nights} nuit(s)</strong> · 
    ${roomType.split('–')[0].trim()} · 
    <strong style="color:var(--gold-light)">${total.toLocaleString('fr-DZ')} DA</strong> total
  `;
  summary.classList.add('visible');
}

function openBookingModal(roomName, price) {
  bookingRoomType = roomName;
  bookingBasePrice = price;
  const modal = document.getElementById('bookingModal');
  const nameEl = document.getElementById('modalRoomName');
  if (nameEl) nameEl.textContent = roomName ? `— ${roomName} — ${price.toLocaleString('fr-DZ')} DA/Nuit` : '';

  // Pre-select room
  const sel = document.getElementById('bRoomType');
  if (sel && roomName) {
    for (let opt of sel.options) {
      if (opt.value.toLowerCase().includes(roomName.toLowerCase().split(' ')[0].toLowerCase())) {
        opt.selected = true; break;
      }
    }
  }
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  updateBookingSummary();
}

function closeBookingModal() {
  document.getElementById('bookingModal').style.display = 'none';
  document.body.style.overflow = '';
}

async function submitBooking(e) {
  e.preventDefault();
  const data = {
    prenom:      document.getElementById('bFirstName')?.value,
    nom:         document.getElementById('bLastName')?.value,
    email:       document.getElementById('bEmail')?.value,
    telephone:   document.getElementById('bPhone')?.value,
    checkin:     document.getElementById('bCheckIn')?.value,
    checkout:    document.getElementById('bCheckOut')?.value,
    chambre:     document.getElementById('bRoomType')?.value,
    personnes:   document.getElementById('bGuests')?.value,
    demandes:    document.getElementById('bRequests')?.value || '—',
  };

  try {
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erreur serveur');
    }

    const result = await res.json();
    closeBookingModal();

    const successEl = document.getElementById('bookingSuccess');
    const msgEl = document.getElementById('successMessage');
    if (msgEl) msgEl.textContent = `Bonjour ${data.prenom} ${data.nom}! Votre réservation #${result.id || '—'} pour le ${data.checkin} a été envoyée.`;
    if (successEl) successEl.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    e.target.reset();
    document.getElementById('bookingSummary')?.classList.remove('visible');
  } catch (err) {
    console.error('Booking API failed:', err);
    const resLocal = LM_DB.Reservations.add(data);
    closeBookingModal();

    const successEl = document.getElementById('bookingSuccess');
    const msgEl = document.getElementById('successMessage');
    if (msgEl) msgEl.textContent = `Bonjour ${resLocal.prenom} ${resLocal.nom}! Votre réservation #${resLocal.id} a été enregistrée localement.`;
    if (successEl) successEl.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    showNotification('Réservation enregistrée localement, API indisponible.', 'error');
    e.target.reset();
    document.getElementById('bookingSummary')?.classList.remove('visible');
  }
}

// ─── WHATSAPP BOOKING ─────────────────────────────────────
function whatsappBook(roomName, price) {
  const msg = encodeURIComponent(
    `Bonjour Le Marin Hôtel! 🏨\n\nJe souhaite réserver:\n• Chambre: ${roomName}\n• Prix: ${price.toLocaleString('fr-DZ')} DA / Nuit\n\nMerci de me confirmer la disponibilité.`
  );
  window.open(`https://wa.me/213552035894?text=${msg}`, '_blank');
}

function whatsappFromModal() {
  const prenom    = document.getElementById('bFirstName')?.value || '';
  const nom       = document.getElementById('bLastName')?.value || '';
  const checkIn   = document.getElementById('bCheckIn')?.value || '';
  const checkOut  = document.getElementById('bCheckOut')?.value || '';
  const chambre   = document.getElementById('bRoomType')?.value || '';
  const personnes = document.getElementById('bGuests')?.value || '';

  const msg = encodeURIComponent(
    `Bonjour Le Marin Hôtel! 🏨\n\n` +
    `📋 DEMANDE DE RÉSERVATION\n` +
    `• Nom: ${prenom} ${nom}\n` +
    `• Chambre: ${chambre}\n` +
    `• Arrivée: ${checkIn}\n` +
    `• Départ: ${checkOut}\n` +
    `• Personnes: ${personnes}\n\n` +
    `Merci de confirmer ma réservation.`
  );
  window.open(`https://wa.me/213552035894?text=${msg}`, '_blank');
}

// ─── CONTACT FORM ─────────────────────────────────────────
function submitContact(e) {
  e.preventDefault();
  const prenom  = document.getElementById('contactFirst')?.value || '';
  const nom     = document.getElementById('contactLast')?.value || '';
  const phone   = document.getElementById('contactPhone')?.value || '';
  const message = document.getElementById('contactMessage')?.value || '';

  const msg = encodeURIComponent(
    `Message de: ${prenom} ${nom}\nTél: ${phone}\n\n${message}`
  );
  window.open(`https://wa.me/213552035894?text=${msg}`, '_blank');
  e.target.reset();
  showNotification('Message envoyé via WhatsApp!', 'success');
}

// ─── INTERNAL RESERVATION DATABASE (localStorage) ─────────
const DB_KEY = 'lemarinhote_reservations';

function saveReservation(data) {
  const existing = getReservations();
  existing.push(data);
  localStorage.setItem(DB_KEY, JSON.stringify(existing));
}

function getReservations() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY)) || [];
  } catch { return []; }
}

function deleteReservation(id) {
  const updated = getReservations().filter(r => r.id !== id);
  localStorage.setItem(DB_KEY, JSON.stringify(updated));
  renderAdminReservations();
}

// ─── ADMIN PANEL ──────────────────────────────────────────
function initAdminPanel() {
  // Secret: URL hash #admin or triple-click footer
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#admin') showAdmin();
  });
  if (window.location.hash === '#admin') showAdmin();

  let clickCount = 0;
  document.querySelector('.footer-marin')?.addEventListener('click', () => {
    clickCount++;
    if (clickCount >= 3) { clickCount = 0; showAdmin(); }
    setTimeout(() => clickCount = 0, 1500);
  });
}

function showAdmin() {
  renderAdminReservations();
  document.getElementById('adminPanel').style.display = 'flex';
}

function renderAdminReservations() {
  const list = document.getElementById('reservationsList');
  if (!list) return;
  const data = getReservations();
  if (data.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">Aucune réservation enregistrée</p>';
    return;
  }
  list.innerHTML = `<p style="color:var(--gold);margin-bottom:12px;font-size:.85rem">${data.length} réservation(s)</p>` +
    data.map(r => `
      <div class="reservation-row">
        <div><span>N° Réservation</span><strong>${r.id}</strong></div>
        <div><span>Date demande</span><strong>${r.date} ${r.heure}</strong></div>
        <div><span>Client</span><strong>${r.prenom} ${r.nom}</strong></div>
        <div><span>Email</span><strong>${r.email}</strong></div>
        <div><span>Téléphone</span><strong>${r.telephone}</strong></div>
        <div><span>Arrivée</span><strong>${r.checkin}</strong></div>
        <div><span>Départ</span><strong>${r.checkout}</strong></div>
        <div><span>Chambre</span><strong>${r.chambre}</strong></div>
        <div><span>Personnes</span><strong>${r.personnes}</strong></div>
        <div><span>Statut</span><strong style="color:#5ef59e">${r.statut}</strong></div>
        <div>
          <button onclick="deleteReservation('${r.id}')" style="background:rgba(255,80,80,.15);border:1px solid rgba(255,80,80,.3);color:#ff8080;padding:4px 10px;border-radius:4px;font-size:.65rem;cursor:pointer">🗑 Supprimer</button>
        </div>
      </div>
    `).join('');
}

function clearReservations() {
  if (confirm('Supprimer toutes les réservations?')) {
    localStorage.removeItem(DB_KEY);
    renderAdminReservations();
  }
}

function exportReservations() {
  const data = getReservations();
  if (data.length === 0) { alert('Aucune réservation à exporter'); return; }

  const headers = ['ID', 'Date', 'Heure', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Arrivée', 'Départ', 'Chambre', 'Personnes', 'Statut'];
  const rows = data.map(r => [r.id, r.date, r.heure, r.prenom, r.nom, r.email, r.telephone, r.checkin, r.checkout, r.chambre, r.personnes, r.statut]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `reservations_lemarin_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── NOTIFICATION TOAST ───────────────────────────────────
function showNotification(msg, type = 'info') {
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed;bottom:100px;right:28px;z-index:9999;
    background:${type === 'success' ? 'rgba(30,180,80,.9)' : 'rgba(201,168,76,.9)'};
    color:#fff;padding:14px 22px;border-radius:8px;
    font-size:.8rem;font-family:'Montserrat',sans-serif;
    box-shadow:0 8px 30px rgba(0,0,0,.4);
    animation:fadeUp .4s ease;
    max-width:300px;
  `;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// ─── PRELOAD KEY IMAGES ───────────────────────────────────
function preloadImages() {
  const priority = [
    PHOTOS.exterior_night,
    PHOTOS.entrance_night,
    PHOTOS.reception_main,
    PHOTOS.stairs_purple,
    PHOTOS.hotel_day,
  ];
  priority.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// ─── CLOSE MODALS ON OVERLAY CLICK ────────────────────────
document.getElementById('bookingModal')?.addEventListener('click', function(e) {
  if (e.target === this) closeBookingModal();
});
document.getElementById('bookingSuccess')?.addEventListener('click', function(e) {
  if (e.target === this) this.style.display = 'none';
});
document.getElementById('adminPanel')?.addEventListener('click', function(e) {
  if (e.target === this) this.style.display = 'none';
});

// ─── SMOOTH SCROLL ────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (id === 'admin') return;
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// ─── WALKTHROUGH HORIZONTAL SCROLL DRAG ───────────────────
(function() {
  const strip = document.getElementById('walkthroughStrip');
  if (!strip) return;
  let isDown = false, startX, scrollLeft;
  strip.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - strip.offsetLeft; scrollLeft = strip.scrollLeft; strip.style.cursor = 'grabbing'; });
  strip.addEventListener('mouseleave', () => { isDown = false; strip.style.cursor = ''; });
  strip.addEventListener('mouseup',   () => { isDown = false; strip.style.cursor = ''; });
  strip.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - strip.offsetLeft;
    strip.scrollLeft = scrollLeft - (x - startX) * 1.2;
  });
})();

// ─── WALKTHROUGH AUTO-SCROLL HINT ─────────────────────────
setTimeout(() => {
  const strip = document.getElementById('walkthroughStrip');
  if (strip && strip.scrollLeft === 0) {
    strip.scrollTo({ left: 200, behavior: 'smooth' });
    setTimeout(() => strip.scrollTo({ left: 0, behavior: 'smooth' }), 800);
  }
}, 3000);

// ─── REVIEWS SYSTEM (localStorage) ───────────────────────
let currentReviews = [];

function initReviewsSystem() {
  LM_DB.Reviews.init();
  fetch('/api/reviews')
    .then(res => {
      if (!res.ok) throw new Error('API error');
      return res.json();
    })
    .then(data => {
      currentReviews = Array.isArray(data.reviews) ? data.reviews : [];
      renderReviews(currentReviews);
      updateGlobalRating(currentReviews);
    })
    .catch(err => {
      console.error('Review API failed:', err);
      currentReviews = LM_DB.Reviews.getApproved();
      renderReviews(currentReviews);
      updateGlobalRating(currentReviews);
    });
}

function renderReviews(reviews = []) {
  const carousel = document.getElementById('reviewsCarousel');
  if (!carousel) return;
  const list = reviews.length ? reviews : LM_DB.Reviews.getApproved();
  carousel.innerHTML = list.map(r => `
    <div class="review-card">
      <div class="review-header">
        <div class="review-avatar">${(r.prenom || 'A')[0].toUpperCase()}</div>
        <div>
          <strong class="review-name">${r.prenom || 'Anonyme'} ${r.nom ? r.nom + '.' : ''}</strong>
          <span class="review-ville">${r.ville || ''}</span>
        </div>
        <div class="review-stars-display">${'★'.repeat(Math.round(r.note || r.rating || 5))}${'☆'.repeat(5 - Math.round(r.note || r.rating || 5))}</div>
      </div>
      <p class="review-text">“${r.commentaire || r.comment || ''}”</p>
      <span class="review-date">${r.date || new Date(r.createdAt || '').toLocaleDateString('fr-FR') || ''}</span>
    </div>
  `).join('');
}

function updateGlobalRating(reviews = []) {
  const list = reviews.length ? reviews : LM_DB.Reviews.getApproved();
  const avg = list.length ? (list.reduce((sum, r) => sum + (Number(r.note || r.rating) || 0), 0) / list.length).toFixed(1) : '0.0';
  const el = document.getElementById('globalScore');
  const stars = document.getElementById('globalStars');
  const feat = document.getElementById('featAvgRating');
  if (el) el.textContent = avg;
  if (feat) feat.textContent = `${avg} ÉTOILES`;
  if (stars) {
    const n = Math.round(Number(avg));
    stars.innerHTML = '★'.repeat(n) + '☆'.repeat(5 - n);
  }
}

async function submitReview(e) {
  e.preventDefault();
  const prenom = document.getElementById('reviewPrenom')?.value?.trim();
  const nom    = document.getElementById('reviewNom')?.value?.trim();
  const ville  = document.getElementById('reviewVille')?.value?.trim();
  const note   = parseInt(document.getElementById('reviewNote')?.value) || 5;
  const text   = document.getElementById('reviewComment')?.value?.trim();

  if (!prenom || !text) { showNotification('Prénom et avis requis', 'error'); return; }

  const payload = { prenom, nom, ville, rating: note, comment: text };
  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erreur serveur');
    }
    const result = await res.json();
    const review = { id: result.review?.id || `rev-${Date.now()}`, ...payload, createdAt: new Date().toISOString() };
    currentReviews.unshift(review);
    renderReviews(currentReviews);
    updateGlobalRating(currentReviews);
    e.target.reset();
    document.getElementById('reviewNote').value = 5;
    resetStars();
    showNotification('Merci pour votre avis! ⭐', 'success');
    SFX.click();
    setTimeout(() => document.getElementById('avis')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
  } catch (err) {
    console.error('Review submit failed:', err);
    LM_DB.Reviews.add({ prenom, nom, ville, note, commentaire: text });
    const fallbackReviews = LM_DB.Reviews.getApproved();
    currentReviews = fallbackReviews;
    renderReviews(currentReviews);
    updateGlobalRating(currentReviews);
    showNotification('Avis enregistré localement, API indisponible.', 'error');
    e.target.reset();
    document.getElementById('reviewNote').value = 5;
    resetStars();
    setTimeout(() => document.getElementById('avis')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
  }
}

// Star rating buttons
function resetStars() {
  document.querySelectorAll('.star-btn').forEach(btn => btn.classList.remove('active'));
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.star-btn');
  if (!btn) return;
  const val = parseInt(btn.dataset.val);
  document.getElementById('reviewNote').value = val;
  document.querySelectorAll('.star-btn').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.val) <= val);
  });
});

// Review carousel navigation
let reviewOffset = 0;
document.getElementById('reviewsPrev')?.addEventListener('click', () => {
  const c = document.getElementById('reviewsCarousel');
  if (c) { reviewOffset = Math.max(0, reviewOffset - 1); c.scrollBy({ left: -320, behavior: 'smooth' }); }
  SFX.click();
});
document.getElementById('reviewsNext')?.addEventListener('click', () => {
  const c = document.getElementById('reviewsCarousel');
  if (c) { c.scrollBy({ left: 320, behavior: 'smooth' }); }
  SFX.click();
});

console.log('%c🏨 Le Marin Hôtel – Admin: ajouter #admin à l\'URL', 'color:#c9a84c;font-size:12px;font-weight:bold');

