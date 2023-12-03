const authUserUrl = 'http://localhost:8080/api/user';
const usersUrl = 'http://localhost:8080/api/admin/users';
const rolesUrl = 'http://localhost:8080/api/admin/roles';

async function fetchData(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Request error');
    }
    return response.json();
}

async function loadInfoAuthUser() {
    try {
        const userProfile = await fetchData(authUserUrl);
        document.querySelector('#nav-username').textContent = userProfile.email;
        document.querySelector('#nav-roles').textContent = userProfile.roles.map(role => role.name.replace('ROLE_', '')).join(' ');
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

function addUserRow(user) {
    const row = `
        <tr data-user-id="${user.id}">
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${user.roles.map(role => role.name.replace('ROLE_', '')).join(' ')}</td>
            <td><button class="btn btn-primary edit-btn" data-user-id="${user.id}">Edit</button></td>
            <td><button class="btn btn-danger delete-btn" data-user-id="${user.id}">Delete</button></td>
        </tr>
    `;

    const tbody = document.querySelector('tbody');
    tbody.innerHTML += row;
}

async function loadUsers() {
    try {
        const users = await fetchData(usersUrl);
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';
        users.forEach(user => addUserRow(user));
        addEventListenersToButtons(tbody);
    } catch (error) {
        console.error('Error loading user list:', error);
    }
}

function addEventListenersToButtons(tbody) {
    tbody.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-btn')) {
            const userId = e.target.getAttribute('data-user-id');
            openEditModal(userId);
        } else if (e.target.classList.contains('delete-btn')) {
            const userId = e.target.getAttribute('data-user-id');
            openDeleteModal(userId);
        }
    });
}

async function loadRoles() {
    try {
        const roles = await fetchData(rolesUrl);
        const select = document.querySelector('#select-new-roles');
        roles.forEach(role => {
            select.appendChild(new Option(role.name.replace('ROLE_', ''), role.id));
        });
    } catch (error) {
        console.error('Error loading roles:', error);
    }
}

document.getElementById('form-new-user').addEventListener('submit', async function (e) {
    e.preventDefault();

    const selectedRoles = Array.from(document.getElementById('select-new-roles').selectedOptions)
        .map(option => {
            return {
                id: option.value,
                name: option.text,
                authority: option.text
            };
        });

    const formData = new FormData(this);
    const data = {
        firstName: formData.get('input-new-first-name'),
        lastName: formData.get('input-new-last-name'),
        age: formData.get('input-new-age'),
        email: formData.get('input-new-email'),
        password: formData.get('input-new-password'),
        roles: selectedRoles
    };

    try {
        const response = await fetch(usersUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const user = await response.json();
            addUserRow(user);
            document.getElementById("users-tab").click();
            this.reset();
        } else {
            console.error('Error creating user');
        }
    } catch (error) {
        console.error('Error sending data:', error);
    }
});

async function openEditModal(userId) {
    try {
        const user = await fetchData(usersUrl + '/' + userId);

        document.getElementById('input-edit-id').value = user.id;
        document.getElementById('input-edit-first-name').value = user.firstName;
        document.getElementById('input-edit-last-name').value = user.lastName;
        document.getElementById('input-edit-age').value = user.age;
        document.getElementById('input-edit-email').value = user.email;

        const rolesSelect = document.getElementById('select-edit-roles');
        rolesSelect.innerHTML = '';
        const allRoles = await fetchData(rolesUrl);

        allRoles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.name.replace('ROLE_', '');
            option.selected = user.roles.some(userRole => userRole.id === role.id);
            rolesSelect.appendChild(option);
        });


        $('#modal-edit-user').modal('show');
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

document.getElementById('form-edit-user').addEventListener('submit', async function (e) {
    e.preventDefault();

    const userId = document.getElementById('input-edit-id').value;

    const selectedRoles = Array.from(document.getElementById('select-edit-roles').selectedOptions)
        .map(option => ({id: option.value}));

    const data = {
        firstName: document.getElementById('input-edit-first-name').value,
        lastName: document.getElementById('input-edit-last-name').value,
        age: document.getElementById('input-edit-age').value,
        email: document.getElementById('input-edit-email').value,
        password: document.getElementById('input-edit-password').value,
        roles: selectedRoles
    };

    try {
        const response = await fetch(usersUrl + '/' + userId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            $('#modal-edit-user').modal('hide');
            loadUsers();
        } else {
            console.error('Error saving changes');
        }
    } catch (error) {
        console.error('Error sending data:', error);
    }
});

async function openDeleteModal(userId) {
    try {
        const user = await fetchData(usersUrl + '/' + userId);

        document.getElementById('input-delete-id').value = user.id;
        document.getElementById('input-delete-first-name').value = user.firstName;
        document.getElementById('input-delete-last-name').value = user.lastName;
        document.getElementById('input-delete-age').value = user.age;
        document.getElementById('input-delete-email').value = user.email;

        const rolesSelect = document.getElementById('select-delete-roles');
        rolesSelect.innerHTML = '';

        user.roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.name.replace('ROLE_', '');
            rolesSelect.appendChild(option);
        });

        $('#modal-delete-user').modal('show');
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

document.getElementById('form-delete-user').addEventListener('submit', async function (e) {
    e.preventDefault();

    const userId = document.getElementById('input-delete-id').value;
    try {
        const response = await fetch(usersUrl + '/' + userId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        });

        if (response.ok) {
            $('#modal-delete-user').modal('hide');
            const userRow = document.querySelector(`tr[data-user-id="${userId}"]`);
            if (userRow) {
                userRow.remove();
            }
        } else {
            console.error('Error when deleting user');
        }
    } catch (error) {
        console.error('Error sending deletion request:', error);
    }
});

loadInfoAuthUser();
loadUsers();
loadRoles();