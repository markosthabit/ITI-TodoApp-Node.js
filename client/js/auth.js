document.getElementById('loginTab').addEventListener('click', () => {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('loginTab').classList.add('active');
  document.getElementById('signupTab').classList.remove('active');
});

document.getElementById('signupTab').addEventListener('click', () => {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'block';
  document.getElementById('signupTab').classList.add('active');
  document.getElementById('loginTab').classList.remove('active');
});

async function handleLogin() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  const messageEl = document.getElementById('authMessage');

  const { response, data, error } = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  if (response && response.ok) {
    messageEl.textContent = data.message || 'Login successful';
    await checkUserRole();
    navigateTo('todos.html');
  } else {
    messageEl.textContent = error ? 'Error during login.' : 'Login failed. Check credentials.';
  }
}

async function handleSignup() {
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;
  const firstName = document.getElementById('signupFirstName').value;
  const lastName = document.getElementById('signupLastName').value;
  const dateOfBirth = document.getElementById('signupDateOfBirth').value;
  const messageEl = document.getElementById('authMessage');

  const { response, data, error } = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, firstName, lastName, dateOfBirth }),
  });

  if (response && response.ok) {
    messageEl.textContent = 'Signup successful! Please log in.';
    document.getElementById('loginTab').click();
  } else {
    messageEl.textContent = error ? 'Error during signup.' : 'Signup failed.';
  }
}

document.getElementById('logoutLink').addEventListener('click', async () => {
  await apiFetch('/auth/logout', { method: 'POST' });
  userRole = null;
  navigateTo('index.html');
});

updateNavbar();