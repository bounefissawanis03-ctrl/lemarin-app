// public/js/admin.js
(() => {
  const API = '/api';
  const loginForm = document.getElementById('login-form');
  const loginStatus = document.getElementById('login-status');
  const dashboard = document.getElementById('dashboard');
  const reservationsTableBody = document.querySelector('#reservations-table tbody');
  const reviewsTableBody = document.querySelector('#reviews-table tbody');
  const logoutBtn = document.getElementById('logout-btn');

  // ---- Helpers ----
  const setToken = token => localStorage.setItem('adminToken', token);
  const getToken = () => localStorage.getItem('adminToken');
  const clearToken = () => localStorage.removeItem('adminToken');
  const authHeaders = () => ({ 'Authorization': `Bearer ${getToken()}` });

  // ---- Login ----
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;
    try {
      const res = await fetch(`${API}/admins/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        loginStatus.textContent = 'Connexion réussie';
        initDashboard();
      } else {
        loginStatus.textContent = data.error || 'Erreur de connexion';
      }
    } catch (err) {
      console.error(err);
      loginStatus.textContent = 'Erreur réseau';
    }
  });

  // ---- Dashboard init ----
  const initDashboard = async () => {
    // hide login, show dashboard
    document.querySelector('.admin-section').style.display = 'none'; // login section
    dashboard.style.display = 'block';
    await loadReservations();
    await loadReviews();
  };

  // ---- Load reservations ----
  const loadReservations = async () => {
    try {
      const res = await fetch(`${API}/reservations`, { headers: authHeaders() });
      const rows = await res.json();
      reservationsTableBody.innerHTML = '';
      rows.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${r.id}</td>
          <td>${r.lastName}</td>
          <td>${r.firstName}</td>
          <td>${r.email}</td>
          <td>${r.roomType || ''}</td>
          <td>${r.checkIn}</td>
          <td>${r.checkOut}</td>
          <td><button class="del-res" data-id="${r.id}">🗑️</button></td>
        `;
        reservationsTableBody.appendChild(tr);
      });
      // attach delete handlers
      document.querySelectorAll('.del-res').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          if (!confirm('Supprimer cette réservation ?')) return;
          await fetch(`${API}/reservations/${id}`, { method: 'DELETE', headers: authHeaders() });
          await loadReservations();
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ---- Load reviews ----
  const loadReviews = async () => {
    try {
      const res = await fetch(`${API}/reviews`, { headers: authHeaders() });
      const data = await res.json();
      const rows = data.reviews || [];
      reviewsTableBody.innerHTML = '';
      rows.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${r.id}</td>
          <td>${r.reservationId || ''}</td>
          <td>${r.rating}</td>
          <td>${r.comment}</td>
          <td><button class="del-rev" data-id="${r.id}">🗑️</button></td>
        `;
        reviewsTableBody.appendChild(tr);
      });
      document.querySelectorAll('.del-rev').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          if (!confirm('Supprimer cet avis ?')) return;
          await fetch(`${API}/reviews/${id}`, { method: 'DELETE', headers: authHeaders() });
          await loadReviews();
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ---- Logout ----
  logoutBtn.addEventListener('click', () => {
    clearToken();
    location.reload();
  });

  // ---- Auto‑login if token present ----
  if (getToken()) {
    initDashboard();
  }
})();
