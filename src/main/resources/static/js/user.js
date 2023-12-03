const authUserUrl = 'http://localhost:8080/api/user';

async function loadInfo(){
    try {
        const user = await (await fetch(authUserUrl)).json();
        document.querySelector('#nav-username').textContent = user.email;
        document.querySelector('#nav-roles').textContent = user.roles.map(role => role.name.replace('ROLE_', '')).join(' ');

        const isAdmin = user.roles.some(role => role.name === 'ROLE_ADMIN');

        if (!isAdmin) {
            $('#link-admin').remove();
        }

        const row = `<tr>
                        <td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${user.roles.map(role => role.name.replace('ROLE_', '')).join(' ')}</td>
                     </tr>`;

        document.querySelector('tbody').innerHTML = row;
    } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
    }
}

loadInfo();