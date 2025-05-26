let currentPage = 0;
const limit = 10;

async function fetchTodos() {
  const status = document.getElementById('statusFilter').value;
  const skip = currentPage * limit;
  const url = new URL(`${API_URL}/todos`);
  url.searchParams.append('limit', limit);
  url.searchParams.append('skip', skip);
  if (status) url.searchParams.append('status', status);

  const { response, data, error } = await apiFetch(url.pathname + url.search);
  if (response && response.ok) {
    const todosContainer = document.getElementById('todosContainer');
    todosContainer.innerHTML = '';
    data.forEach(todo => {
      const card = document.createElement('div');
      card.className = 'col-md-4 mb-3';
      card.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${todo.title}</h5>
            <p class="card-text">Status: ${todo.status}</p>
            <p class="card-text">Tags: ${todo.listOfTags.join(', ')}</p>
            <button class="btn btn-warning btn-sm" onclick="openEditTodoModal('${todo._id}', '${todo.title}', '${todo.status}', '${todo.listOfTags.join(', ')}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteTodo('${todo._id}')">Delete</button>
          </div>
        </div>
      `;
      todosContainer.appendChild(card);
    });
    document.getElementById('pageInfo').textContent = `Page ${currentPage + 1}`;
  } else {
    document.getElementById('authMessage').textContent = error ? 'Error fetching todos.' : 'Please log in.';
    navigateTo('index.html');
  }
}

async function handleAddTodo() {
  const title = document.getElementById('todoTitle').value;
  const tags = document.getElementById('todoTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
  const { response, error } = await apiFetch('/todos', {
    method: 'POST',
    body: JSON.stringify({ title, listOfTags: tags }),
  });

  if (response && response.ok) {
    fetchTodos();
    bootstrap.Modal.getInstance(document.getElementById('addTodoModal')).hide();
    document.getElementById('todoTitle').value = '';
    document.getElementById('todoTags').value = '';
  } else {
    alert('Failed to add todo.');
  }
}

function openEditTodoModal(id, title, status, tags) {
  document.getElementById('editTodoId').value = id;
  document.getElementById('editTodoTitle').value = title;
  document.getElementById('editTodoStatus').value = status;
  document.getElementById('editTodoTags').value = tags;
  bootstrap.Modal.getOrCreateInstance(document.getElementById('editTodoModal')).show();
}

async function handleEditTodo() {
  const id = document.getElementById('editTodoId').value;
  const title = document.getElementById('editTodoTitle').value;
  const status = document.getElementById('editTodoStatus').value;
  const tags = document.getElementById('editTodoTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
  const { response, error } = await apiFetch(`/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ title, status, listOfTags: tags }),
  });

  if (response && response.ok) {
    fetchTodos();
    bootstrap.Modal.getInstance(document.getElementById('editTodoModal')).hide();
  } else {
    alert('Failed to update todo.');
  }
}

async function deleteTodo(id) {
  const { response, error } = await apiFetch(`/todos/${id}`, { method: 'DELETE' });
  if (response && response.ok) {
    fetchTodos();
  } else {
    alert('Failed to delete todo.');
  }
}

function changePage(delta) {
  currentPage = Math.max(0, currentPage + delta);
  fetchTodos();
}

document.getElementById('logoutLink').addEventListener('click', async () => {
  await apiFetch('/auth/logout', { method: 'POST' });
  userRole = null;
  navigateTo('index.html');
});

fetchTodos();
updateNavbar();