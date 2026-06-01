// public/js/app.js
// Core front‑end logic: theme toggle, fetch services, gallery, reservation & review handling
document.addEventListener('DOMContentLoaded', () => {
  // ---------- Theme ----------
  const themeToggle = document.getElementById('theme-toggle');
  const current = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', current);
  themeToggle.textContent = current === 'dark' ? '☀️' : '☾';
  themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '☾';
  });

  // ---------- Sound Effects ----------
  const doorSound = new Audio('audio/door.mp3');
  const clickSound = new Audio('audio/click.mp3');
  // Play door sound on first load
  doorSound.play().catch(() => {});
  document.body.addEventListener('click', () => clickSound.play().catch(() => {}));

  // ---------- Services ----------
  fetch('/api/services')
    .then(r => r.json())
    .then(services => {
      const container = document.getElementById('service-list');
      services.forEach(s => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `<span class="icon">${s.icon}</span><h3>${s.name}</h3><p>${s.description}</p>`;
        container.appendChild(card);
      });
    })
    .catch(console.error);

  // ---------- Gallery ----------
  fetch('media/gallery/gallery.json')
    .then(r => r.json())
    .then(data => {
      const grid = document.getElementById('gallery-grid');
      data.forEach(file => {
        const img = document.createElement('img');
        img.src = `media/gallery/${file}`;
        img.alt = 'Galerie image';
        img.addEventListener('click', () => openLightbox(img.src));
        grid.appendChild(img);
      });
    })
    .catch(console.error);

  // Lightbox implementation
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.innerHTML = '<img src="" alt="Lightbox image" />';
  document.body.appendChild(lightbox);
  lightbox.addEventListener('click', () => (lightbox.style.display = 'none'));
  function openLightbox(src) {
    const img = lightbox.querySelector('img');
    img.src = src;
    lightbox.style.display = 'flex';
  }

  // ---------- Reservation ----------
  const reservationForm = document.getElementById('reservation-form');
  const statusMsg = document.getElementById('reservation-status');
  reservationForm.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(reservationForm);
    const payload = Object.fromEntries(formData.entries());
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        statusMsg.textContent = 'Réservation créée avec succès !';
        // WhatsApp link with name
        const waLink = `https://wa.me/1234567890?text=Nouvelle%20réservation%20de%20${encodeURIComponent(payload.firstName)}%20${encodeURIComponent(payload.lastName)}`;
        statusMsg.innerHTML += ` <a href="${waLink}" target="_blank">Message WhatsApp</a>`;
        reservationForm.reset();
      } else {
        statusMsg.textContent = data.error || 'Erreur lors de la réservation.';
      }
    } catch (err) {
      console.error(err);
      statusMsg.textContent = 'Erreur réseau.';
    }
  });

  // ---------- Reviews ----------
  const reviewsList = document.getElementById('reviews-list');
  function loadReviews() {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => {
        reviewsList.innerHTML = '';
        data.reviews.forEach(r => {
          const card = document.createElement('div');
          card.className = 'review-card';
          const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
          card.innerHTML = `<p class="star">${stars}</p><p>${r.comment}</p><small>— ${r.firstName || ''} ${r.lastName || ''}</small>`;
          reviewsList.appendChild(card);
        });
      })
      .catch(console.error);
  }
  loadReviews();

  const reviewForm = document.getElementById('review-form');
  reviewForm.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(reviewForm);
    const payload = {
      rating: Number(fd.get('rating')),
      comment: fd.get('comment'),
      reservationId: null // optional, could be set later
    };
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        reviewForm.reset();
        loadReviews();
      } else {
        alert(data.error || 'Erreur lors de l\'envoi du commentaire');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau');
    }
  });
});
