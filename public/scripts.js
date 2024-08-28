// Funktion zum Setzen eines Cookies
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Funktion zum Abrufen eines Cookies
function getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Funktion zum Löschen eines Cookies
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// Füge Event Listener für das Formular hinzu
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');
    const saveCookies = document.getElementById('saveCookies').checked;
    
    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (saveCookies) {
                setCookie('username', username, 7); // Cookie für 7 Tage speichern
                setCookie('password', password, 7); // Cookie für 7 Tage speichern
            }
            messageElement.textContent = 'Redirecting...';
            messageElement.style.color = 'green';
            messageElement.classList.add('show');
            setTimeout(() => window.location.href = '/next-page', 2000); // 2 Sekunden Verzögerung
        } else {
            messageElement.textContent = 'Invalid username or password';
            messageElement.style.color = 'red';
            messageElement.classList.add('show');
        }
    });
});

// Event-Listener für den "Create Account" Button
document.getElementById('createAccount').addEventListener('click', () => {
    window.location.href = '/register'; // Weiterleitung zur Registrierungsseite
});

// Toggle Passwortsichtbarkeit
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
});

// Passwortlänge anzeigen
const passwordField = document.getElementById('password');
const passwordLength = document.getElementById('passwordLength');
const showLengthCheckbox = document.getElementById('showLength');

passwordField.addEventListener('input', () => {
    if (showLengthCheckbox.checked) {
        passwordLength.textContent = passwordField.value.length;
    } else {
        passwordLength.textContent = '';
    }
});

showLengthCheckbox.addEventListener('change', () => {
    if (showLengthCheckbox.checked) {
        passwordLength.textContent = passwordField.value.length;
    } else {
        passwordLength.textContent = '';
    }
});

// Fehlernachricht beim Fokus der Eingabefelder animiert ausblenden
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        const messageElement = document.getElementById('message');
        messageElement.classList.remove('show');
        messageElement.classList.add('fadeOut');
        setTimeout(() => messageElement.classList.remove('fadeOut'), 500); // Nach der Animation die Klasse entfernen
    });
});

// Bei Seitenladen Cookie-Werte einfügen, falls vorhanden
document.addEventListener('DOMContentLoaded', () => {
    const savedUsername = getCookie('username');
    const savedPassword = getCookie('password');

    if (savedUsername) {
        document.getElementById('username').value = savedUsername;
    }

    if (savedPassword) {
        document.getElementById('password').value = savedPassword;
    }
});

// Lösche Cookies beim Klicken auf den Button
document.getElementById('deleteCookies').addEventListener('click', () => {
    deleteCookie('username');
    deleteCookie('password');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';

    const notification = document.getElementById('notification');
    notification.textContent = 'Cookies successfully deleted!';
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000); // Nachricht für 3 Sekunden anzeigen
});
