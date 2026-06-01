/* ═══════════════════════════════════════════════════════════
   LE MARIN HÔTEL – db.js
   Internal Database Module (localStorage + IndexedDB)
   Handles: Reservations, Reviews, Admin Auth, Cart
   ═══════════════════════════════════════════════════════════ */

'use strict';

const LM_DB = (() => {
  // ─── Keys ─────────────────────────────────────────────────
  const KEYS = {
    RESERVATIONS: 'lm_reservations_v3',
    REVIEWS:      'lm_reviews_v3',
    ADMINS:       'lm_admins_v3',
    CART:         'lm_cart_v3',
    THEME:        'lm_theme_v3',
    COUNTER:      'lm_counter_v3',
  };

  // ─── Simple hash function (for admin passwords) ───────────
  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  // ─── ID Generator ─────────────────────────────────────────
  function generateId(prefix = 'LM') {
    const stored = parseInt(localStorage.getItem(KEYS.COUNTER) || '1000');
    const next = stored + 1;
    localStorage.setItem(KEYS.COUNTER, next.toString());
    const rand = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}-${next}-${rand}`;
  }

  // ─── Generic CRUD helpers ─────────────────────────────────
  function getAll(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  }

  function saveAll(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // ═══════════════════════════════════════════════════════════
  // RESERVATIONS
  // ═══════════════════════════════════════════════════════════
  const Reservations = {
    getAll() { return getAll(KEYS.RESERVATIONS); },

    add(data) {
      const all = this.getAll();
      const reservation = {
        id:        generateId('RES'),
        createdAt: new Date().toISOString(),
        status:    'pending', // pending | confirmed | cancelled
        ...data
      };
      all.unshift(reservation);
      saveAll(KEYS.RESERVATIONS, all);
      return reservation;
    },

    update(id, updates) {
      const all = this.getAll();
      const idx = all.findIndex(r => r.id === id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
        saveAll(KEYS.RESERVATIONS, all);
        return all[idx];
      }
      return null;
    },

    delete(id) {
      const filtered = this.getAll().filter(r => r.id !== id);
      saveAll(KEYS.RESERVATIONS, filtered);
    },

    getByStatus(status) {
      return this.getAll().filter(r => r.status === status);
    },

    exportCSV() {
      const data = this.getAll();
      if (!data.length) return '';
      const headers = ['ID', 'Date', 'Prénom', 'Nom', 'Téléphone', 'Email', 'Chambre', 'Arrivée', 'Départ', 'Personnes', 'Prix Total', 'Statut', 'Demandes'];
      const rows = data.map(r => [
        r.id, new Date(r.createdAt).toLocaleDateString('fr-DZ'),
        r.prenom, r.nom, r.telephone, r.email,
        r.chambre, r.checkin, r.checkout, r.personnes,
        r.prixTotal || '—', r.status, (r.demandes || '—').replace(/,/g, ';')
      ]);
      return [headers, ...rows].map(row => row.map(c => `"${c}"`).join(',')).join('\n');
    }
  };

  // ═══════════════════════════════════════════════════════════
  // REVIEWS
  // ═══════════════════════════════════════════════════════════
  const SEED_REVIEWS = [
    { id: 'REV-SEED-1', prenom: 'Fatima', nom: 'B.', note: 5, commentaire: 'Un séjour absolument inoubliable ! La vue sur mer depuis notre balcon était à couper le souffle. Le personnel est extrêmement professionnel et attentionné. Je reviendrai sans hésiter !', date: '2025-08-14', approved: true, ville: 'Alger' },
    { id: 'REV-SEED-2', prenom: 'Karim', nom: 'M.', note: 5, commentaire: 'Hôtel magnifique, vraiment 5 étoiles dans l\'âme même si classé 2 étoiles officiellement. La décoration intérieure est somptueuse, les chambres sont grandes et très propres. Le petit-déjeuner est délicieux !', date: '2025-07-28', approved: true, ville: 'Oran' },
    { id: 'REV-SEED-3', prenom: 'Amira', nom: 'H.', note: 5, commentaire: 'La meilleure adresse à Ain El Turk ! Nous avons séjourné avec toute la famille et tout était parfait. L\'emplacement est idéal, à deux pas de la mer. Les enfants ont adoré les balcons !', date: '2025-08-02', approved: true, ville: 'Constantine' },
    { id: 'REV-SEED-4', prenom: 'Yassine', nom: 'T.', note: 4, commentaire: 'Très bon hôtel avec une ambiance luxueuse. La réception est accueillante et le cadre est élégant. L\'équipe répond rapidement sur WhatsApp. Quelques petits détails à améliorer mais globalement excellent !', date: '2025-07-15', approved: true, ville: 'Tlemcen' },
    { id: 'REV-SEED-5', prenom: 'Nadia', nom: 'K.', note: 5, commentaire: 'Coup de cœur total ! Dès l\'entrée, l\'hôtel nous a émerveillés avec son architecture et ses lumières dorées. La suite était spacieuse et le panorama sur la Méditerranée… magique. Merci Le Marin !', date: '2025-08-20', approved: true, ville: 'Annaba' },
    { id: 'REV-SEED-6', prenom: 'Rachid', nom: 'L.', note: 5, commentaire: 'Parfait pour un séjour romantique. Chambre propre, lit très confortable, personnel souriant. La cafétéria sert d\'excellents petits-déjeuners. Le parking est un vrai plus. Nous recommandons vivement !', date: '2025-08-10', approved: true, ville: 'Mostaganem' },
    { id: 'REV-SEED-7', prenom: 'Selma', nom: 'D.', note: 4, commentaire: 'Hôtel de charme avec une belle décoration. Les escaliers sont majestueux. La vue est splendide. Très bien situé à Ain El Turk. Service WhatsApp très réactif pour la réservation.', date: '2025-09-01', approved: true, ville: 'Sidi Bel Abbès' },
    { id: 'REV-SEED-8', prenom: 'Omar', nom: 'F.', note: 5, commentaire: 'Je recommande Le Marin les yeux fermés ! Chaque coin de l\'hôtel respire l\'élégance. La terrasse est sublime au coucher du soleil. Personnel très aimable. Le meilleur rapport qualité/prix de la région !', date: '2025-09-12', approved: true, ville: 'Saïda' },
    { id: 'REV-SEED-9', prenom: 'Lina', nom: 'S.', note: 5, commentaire: 'Quel plaisir de séjourner au Marin ! La vue depuis le balcon au lever du soleil est tout simplement magique. Le personnel nous a accueillis comme des rois. L\'hôtel est impeccable, la literie est confortable. Un vrai havre de paix.', date: '2025-09-25', approved: true, ville: 'Blida' },
    { id: 'REV-SEED-10', prenom: 'Mehdi', nom: 'R.', note: 5, commentaire: 'J\'ai organisé notre anniversaire de mariage au Marin et ce fut un moment mémorable. La suite royale est sublime, le service irréprochable. La cafétéria offre des pâtisseries exquises. Merci à toute l\'équipe !', date: '2025-10-03', approved: true, ville: 'Béjaïa' },
    { id: 'REV-SEED-11', prenom: 'Samia', nom: 'A.', note: 5, commentaire: 'Troisième séjour et toujours aussi enchantée ! L\'hôtel s\'améliore à chaque visite. Les escaliers en marbre, le hall magnifiquement éclairé, et surtout cette vue mer incomparable. Le meilleur hôtel d\'Ain El Turk sans discussion.', date: '2025-10-15', approved: true, ville: 'Sétif' },
    { id: 'REV-SEED-12', prenom: 'Walid', nom: 'C.', note: 4, commentaire: 'Très bel hôtel, propre et bien entretenu. La chambre double est spacieuse avec tout le confort nécessaire. Le petit-déjeuner est copieux et varié. Le WiFi fonctionne bien. Juste le parking un peu petit en haute saison.', date: '2025-11-01', approved: true, ville: 'Batna' },
    { id: 'REV-SEED-13', prenom: 'Houda', nom: 'Z.', note: 5, commentaire: 'Un bijou architectural ! Chaque recoin de l\'hôtel est pensé avec goût. Les lumières dorées la nuit donnent une atmosphère féérique. Le jacuzzi dans la suite était parfait après une journée à la plage. Je recommande à 1000% !', date: '2025-11-20', approved: true, ville: 'Djelfa' },
    { id: 'REV-SEED-14', prenom: 'Amine', nom: 'B.', note: 5, commentaire: 'Rapport qualité-prix imbattable ! Pour le tarif d\'un 2 étoiles, on obtient un service digne d\'un palace. La réception est disponible 24h/24, le personnel parle français et arabe parfaitement. Bravo Le Marin !', date: '2026-01-10', approved: true, ville: 'Chlef' },
  ];

  const Reviews = {
    init() {
      if (!localStorage.getItem(KEYS.REVIEWS)) {
        saveAll(KEYS.REVIEWS, SEED_REVIEWS);
      }
    },

    getAll() { return getAll(KEYS.REVIEWS); },

    getApproved() { return this.getAll().filter(r => r.approved); },

    add(data) {
      const all = this.getAll();
      const review = {
        id:        generateId('REV'),
        date:      new Date().toLocaleDateString('fr-DZ'),
        approved:  true, // Auto-approve for now
        ...data
      };
      all.unshift(review);
      saveAll(KEYS.REVIEWS, all);
      return review;
    },

    delete(id) {
      const filtered = this.getAll().filter(r => r.id !== id);
      saveAll(KEYS.REVIEWS, filtered);
    },

    approve(id) {
      const all = this.getAll();
      const idx = all.findIndex(r => r.id === id);
      if (idx !== -1) { all[idx].approved = true; saveAll(KEYS.REVIEWS, all); }
    },

    getAvgRating() {
      const approved = this.getApproved();
      if (!approved.length) return 0;
      return (approved.reduce((s, r) => s + r.note, 0) / approved.length).toFixed(1);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // ADMIN AUTHENTICATION
  // ═══════════════════════════════════════════════════════════
  const DEFAULT_ADMINS = [];

  const Auth = {
    init() {
      // Do not seed default admins client-side. Admins must be managed via server.
      if (!localStorage.getItem(KEYS.ADMINS)) {
        saveAll(KEYS.ADMINS, []);
      }
    },

    getAdmins() { return getAll(KEYS.ADMINS); },

    login(username, password) {
      // Client-side admin login disabled for security. Use server /api/admins/login instead.
      return null;
    },

    addAdmin(username, password, nom, role = 'staff') {
      // Disabled on client — admin creation must occur server-side.
      return false;
    },

    deleteAdmin(id) {
      const filtered = this.getAdmins().filter(a => a.id !== id);
      saveAll(KEYS.ADMINS, filtered);
    },

    isLoggedIn() {
      return sessionStorage.getItem('lm_admin_session') !== null;
    },

    getSession() {
      try { return JSON.parse(sessionStorage.getItem('lm_admin_session')); }
      catch { return null; }
    },

    startSession(admin) {
      const session = { ...admin, loginAt: new Date().toISOString() };
      delete session.passwordHash;
      sessionStorage.setItem('lm_admin_session', JSON.stringify(session));
    },

    endSession() {
      sessionStorage.removeItem('lm_admin_session');
    }
  };

  // ═══════════════════════════════════════════════════════════
  // CART (Reservation In Progress)
  // ═══════════════════════════════════════════════════════════
  const Cart = {
    get() {
      try { return JSON.parse(localStorage.getItem(KEYS.CART)) || null; }
      catch { return null; }
    },

    set(data) {
      localStorage.setItem(KEYS.CART, JSON.stringify({ ...data, updatedAt: new Date().toISOString() }));
    },

    clear() { localStorage.removeItem(KEYS.CART); },

    calculateTotal(chambre, checkin, checkout) {
      const PRICES = {
        'Chambre Double': 7000,
        'Suite': 9000,
        'Suite Supérieure': 14000,
        'Appartement': 15000,
        'Suite Royale': 25000,
      };
      const nights = Math.max(1, Math.round((new Date(checkout) - new Date(checkin)) / 86400000));
      const pricePerNight = PRICES[chambre] || 7000;
      return { nights, pricePerNight, total: nights * pricePerNight };
    }
  };

  // ═══════════════════════════════════════════════════════════
  // THEME
  // ═══════════════════════════════════════════════════════════
  const Theme = {
    get() { return localStorage.getItem(KEYS.THEME) || 'dark'; },
    set(theme) { localStorage.setItem(KEYS.THEME, theme); },
  };

  // ─── Initialize ───────────────────────────────────────────
  function init() {
    Reviews.init();
    Auth.init();
  }

  return { Reservations, Reviews, Auth, Cart, Theme, init, simpleHash };
})();

// Auto-init when loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => LM_DB.init());
}
