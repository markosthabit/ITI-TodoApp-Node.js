async function fetchUsers() {
  const { response, data, error } = await apiFetch('/users');
  if (response && response.ok) {
    const usersTable = document.getElementById('usersTable');
    usersTable.innerHTML = '';
    data.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${new Date(user.dateOfBirth).toLocaleDateString()}</td>
        <td>
          <button class="btn btn-info btn-sm" onclick="viewUser('${user._id}')">View</button>
          <button class="btn btn-warning btn-sm" onclick="openEditUserModal('${user._id}', '${user.username}', '${user.firstName}', '${user.lastName}', '${user.dateOfBirth}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">Delete</button>
        </td>
      `;
      usersTable.appendChild(row);
    });
  } else {
    document.getElementById('authMessage')?.textContent = error ? 'Error fetching users.' : 'Access denied.';
    navigateTo('index.html');
  }
}

async function viewUser(id) {
  const { response, data, error } = await apiFetch(`/users/${id}`);
  if (response && response.ok) {
    document.getElementById('userDetails').innerHTML = `
      <p><strong>Username:</strong> ${data.username}</p>
      <p><strong>First Name:</strong> ${data.firstName}</p>
      <p><strong>Last Name:</strong> ${data.lastName}</p>
      <p><strong>Date of Birth:</strong> ${new Date(data.dateOfBirth).toLocaleDateString()}</p>
    `;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('userDetailsModal')).show();
  } else {
    alert('Failed to fetch user.');
  }
}

function openEditUserModal(id, username, firstName, lastName, dateOfBirth) {
  document.getElementById('editUserId').value = id;
  document.getElementById('editUserUsername').value = username;
  document.getElementById('editUserFirstName').value = firstName;
  document.getElementById('editUserLastName').value = lastName;
  document.getElementById('editUserDateOfBirth').value = dateOfBirth.split('T')[0];
  bootstrap.Modal.getOrCreateInstance(document.getElementById('editUserModal')).show();
}

async function handleEditUser() {
  const id = document.getElementById('editUserId').value;
  const username = document.getElementById('editUserUsername').value;
  const firstName = document.getElementById('editUserFirstName').value;
  const lastName = document.getElementById('editUserLastName').value;
  const dateOfBirth = document.getElementById('editUserDateOfBirth').value;
  const { response, error } = await apiFetch(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ username, firstName, lastName, dateOfBirth }),
  });

  if (response && response.ok) {
    fetchUsers();
    bootstrap.Modal.getInstance(document.getElementById('editUserModal')).hide();
  } else {
    alert('Failed to update user.');
  }
}

async function deleteUser(id) {
  const { response, error } = await apiFetch(`/users/${id}`, { method: 'DELETE' });
  if (response && response.ok) {
    fetchUsers();
  } else {
    alert('Failed to delete user.');
  }
}

document.getElementById('logoutLink').addEventListener('click', async () => {
  await apiFetch('/auth/logout', { method: 'POST' });
  userRole = null;
  navigateTo('index.html');
});

fetchUsers();
updateNavbar();