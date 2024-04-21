const addForm = document.getElementById('addForm');
const selectContact = document.getElementById('selectContact');
const selectedContactName = document.getElementById('selectedContactName');
const contactDetails = document.getElementById('contactDetails');
const allContactsList = document.getElementById('allContactsList');

// Функція для збереження абонента в локальне сховище
function saveContact(name, phoneNumber) {
    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    contacts.push({ name, phoneNumber, contacts: [] }); // Додати нового абонента з пустим списком контактів
    localStorage.setItem('contacts', JSON.stringify(contacts));
    displayContactsInSelect();
    displayAllContacts();
}

// Функція для відображення абонентів у випадаючому списку
function displayContactsInSelect() {
    selectContact.innerHTML = '<option value="">Виберіть абонента</option>';

    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    contacts.forEach(function (contact, index) {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = contact.name;
        selectContact.appendChild(option);
    });
}

// Оновлена функція для відображення всіх абонентів у вигляді таблиці з можливістю редагування та видалення
function displayAllContacts() {
    const allContactsList = document.getElementById('allContactsList');
    allContactsList.innerHTML = ''; // Очистимо вміст перед оновленням

    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    contacts.forEach(function (contact, index) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.phoneNumber}</td>
            <td>
                <button onclick="editContacts(${index})">Редагувати</button>
                <button onclick="deleteContacts(${index})">Видалити</button>
            </td>
        `;
        allContactsList.appendChild(row);
    });
}

// Оновлена функція для редагування контакту
function editContacts(contactIndex) {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const contact = contacts[contactIndex];
    const newName = prompt('Введіть нове ім\'я для абонента:', contact.name);
    const newPhone = prompt('Введіть новий номер телефону для абонента:', contact.phoneNumber);

    if (newName !== null && newPhone !== null) {
        contact.name = newName.trim();
        contact.phoneNumber = newPhone.trim();
        localStorage.setItem('contacts', JSON.stringify(contacts));
        displayAllContacts(); // Оновити відображення всіх абонентів
    }
}

// Оновлена функція для видалення контакту
function deleteContacts(contactIndex) {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    contacts.splice(contactIndex, 1);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    displayAllContacts(); // Оновити відображення всіх абонентів
}


// Функція для відображення деталей обраного абонента
function loadContactDetails() {
    const selectedIndex = selectContact.value;
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    if (selectedIndex !== '') {
        const selectedContact = contacts[selectedIndex];
        selectedContactName.textContent = `Деталі абонента: ${selectedContact.name}`;

        contactDetails.innerHTML = `
                <h4>Контакти абонента:</h4>
                <table id="contactTable">
                    <thead>
                        <tr>
                            <th>Ім'я</th>
                            <th>Номер телефону</th>
                            <th>Дії</th>
                        </tr>
                    </thead>
                    <tbody id="contactTableBody"></tbody>
                </table>
                <form id="addContactForm">
                    <label for="newContactName">Ім'я контакту:</label>
                    <input type="text" id="newContactName" required><br>
                    <label for="newContactPhone">Номер телефону контакту:</label>
                    <input type="tel" id="newContactPhone" pattern="[0-9]{10}" required><br>
                    <button type="submit">Додати контакт</button>
                </form>
            `;

        const contactTableBody = document.getElementById('contactTableBody');
        selectedContact.contacts.forEach(function (contact, index) {
            const row = contactTableBody.insertRow();
            row.innerHTML = `
                    <td>${contact.name}</td>
                    <td>${contact.phoneNumber}</td>
                    <td>
                        <button onclick="editContact(${selectedIndex}, ${index})">Редагувати</button>
                        <button onclick="deleteContact(${selectedIndex}, ${index})">Видалити</button>
                    </td>
                `;
        });

        const addContactForm = document.getElementById('addContactForm');
        addContactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const newContactName = document.getElementById('newContactName').value.trim();
            const newContactPhone = document.getElementById('newContactPhone').value.trim();

            if (newContactName && newContactPhone) {
                selectedContact.contacts.push({ name: newContactName, phoneNumber: newContactPhone });
                localStorage.setItem('contacts', JSON.stringify(contacts));
                loadContactDetails(); // Поновлення відображення деталей абонента
                addContactForm.reset(); // Очищення полів форми
            } else {
                alert('Будь ласка, заповніть всі поля.');
            }
        });
    } else {
        selectedContactName.textContent = '';
        contactDetails.innerHTML = '';
    }
}

// Функція для редагування контакту
function editContact(contactIndex, index) {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const contact = contacts[contactIndex].contacts[index];
    const newName = prompt('Введіть нове ім\'я для контакту:', contact.name);
    const newPhone = prompt('Введіть новий номер телефону для контакту:', contact.phoneNumber);

    if (newName !== null && newPhone !== null) {
        contacts[contactIndex].contacts[index] = { name: newName.trim(), phoneNumber: newPhone.trim() };
        localStorage.setItem('contacts', JSON.stringify(contacts));
        loadContactDetails(); // Оновити відображення деталей абонента
    }
}

// Функція для видалення контакту
function deleteContact(contactIndex, index) {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    contacts[contactIndex].contacts.splice(index, 1);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    loadContactDetails(); // Оновити відображення деталей абонента
}

// Обробник події відправки форми додавання абонента
addForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();

    if (name && phoneNumber) {
        saveContact(name, phoneNumber);
        addForm.reset(); // Очищаємо поля форми після додавання
    } else {
        alert('Будь ласка, заповніть всі поля.');
    }
});

// Відображення абонентів при завантаженні сторінки
displayContactsInSelect();
displayAllContacts();


function loadCallHistory() {
    const selectedIndex = document.getElementById('selectCallContact').value;
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    if (selectedIndex !== '') {
        const selectedContact = contacts[selectedIndex];
        document.getElementById('selectedCallContactName').textContent = `Історія дзвінків для: ${selectedContact.name}`;

        const callHistoryDetails = document.getElementById('callHistoryDetails');
        callHistoryDetails.innerHTML = `
            <h4>Додати новий запис про дзвінок:</h4>
            <form id="addCallForm">
                <label for="callTime">Час дзвінка:</label>
                <input type="datetime-local" id="callTime" required><br>
                <label for="otherNumber">Номер іншого абонента:</label>
                <input type="tel" id="otherNumber" pattern="[0-9]{10}" required><br>
                <button type="submit">Додати запис</button>
            </form>
            <h4>Історія дзвінків:</h4>
            <ul id="callHistoryList"></ul>
        `;

        const callHistoryList = document.getElementById('callHistoryList');
        if (selectedContact.callHistory) {
            selectedContact.callHistory.forEach(call => {
                const li = document.createElement('li');
                li.textContent = `Час: ${call.time}, Номер: ${call.otherNumber}`;
                callHistoryList.appendChild(li);
            });
        }

        const addCallForm = document.getElementById('addCallForm');
        addCallForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const callTime = document.getElementById('callTime').value.trim();
            const otherNumber = document.getElementById('otherNumber').value.trim();
            
            if (callTime && otherNumber) {
                selectedContact.callHistory = selectedContact.callHistory || [];
                selectedContact.callHistory.push({ time: callTime, otherNumber: otherNumber });
                localStorage.setItem('contacts', JSON.stringify(contacts));
                loadCallHistory(); // Оновлення відображення історії дзвінків
                addCallForm.reset(); // Очищення полів форми
            } else {
                alert('Будь ласка, заповніть всі поля.');
            }
        });
    } else {
        document.getElementById('selectedCallContactName').textContent = '';
        document.getElementById('callHistoryDetails').innerHTML = '';
    }
}


// Оновлення відображення всіх абонентів у вигляді таблиці
function displayAllContacts() {
    const allContactsList = document.getElementById('allContactsList');
    allContactsList.innerHTML = '';

    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    contacts.forEach(function (contact, index) {
        const row = allContactsList.insertRow();
        row.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.phoneNumber}</td>
            <td>
                <button onclick="editContacts(${index})">Редагувати</button>
                <button onclick="deleteContacts(${index})">Видалити</button>
            </td>
        `;
    });
}

// Оновлена функція для відкриття вкладок
function openTab(evt, tabName) {
    const tabContent = document.getElementsByClassName('tabContent');
    for (let content of tabContent) {
        content.style.display = 'none';
    }

    const tablinks = document.getElementsByClassName('tablink');
    for (let link of tablinks) {
        link.className = link.className.replace(' active', '');
    }

    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';

    if (tabName === 'selectTab') {
        displayContactsInSelect();
    } else if (tabName === 'allContactsTab') {
        displayAllContacts();
    } else if (tabName === 'callHistoryTab') {
        displayContactsInCallHistorySelect();
    }
}

// Відображення абонентів при завантаженні сторінки
displayContactsInSelect();
displayAllContacts();

// Функція для відображення абонентів у випадаючому списку на вкладці "Історія дзвінків"
function displayContactsInCallHistorySelect() {
    const selectCallContact = document.getElementById('selectCallContact');
    selectCallContact.innerHTML = '<option value="">Оберіть абонента</option>';

    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    contacts.forEach(function (contact, index) {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = contact.name;
        selectCallContact.appendChild(option);
    });
}
