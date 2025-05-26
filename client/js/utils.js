const API_URL = 'http://localhost:3000';
let userRole = null;

async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });
    return { response, data: response.ok ? await response.json() : null };
  } catch (error) {
    return { response: null, data: null, error };
  }
}

async function checkUserRole() {
  const { response } = await apiFetch('/users', { method: 'GET' });
  userRole = response.ok ? 'admin' : 'user';
}

function navigateTo(page) {
  window.location.href = page;
}

function updateNavbar() {
  const isLoggedIn = !!userRole;
  const todosLink = document.getElementById('todosLink');
  const adminLink = document.getElementById('adminLink');
  const logoutLink = document.getElementById('logoutLink');
  if (todosLink) todosLink.style.display = isLoggedIn ? 'block' : 'none';
  if (adminLink) adminLink.style.display = isLoggedIn && userRole === 'admin' ? 'block' : 'none';
  if (logoutLink) logoutLink.style.display = isLoggedIn ? 'block' : 'none';
}