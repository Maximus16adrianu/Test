document.addEventListener('DOMContentLoaded', () => {
    // Referenzen zu den Formularelementen
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const passwordLength = document.getElementById('passwordLength');
    const confirmPasswordLength = document.getElementById('confirmPasswordLength');
    const passwordStrengthBar = document.getElementById('passwordStrengthBar');
    const passwordStrengthText = document.getElementById('passwordStrengthText');
    const passwordStrengthCheck = document.getElementById('passwordStrengthCheck');
    const messageElement = document.getElementById('registerMessage');

    // Validierungsfunktionen
    const validateUsername = () => {
        const username = usernameField.value;
        const usernamePattern = /^[A-Za-z][A-Za-z0-9_]*[A-Za-z0-9]$/;

        if (!usernamePattern.test(username) || username.length > 20) {
            document.getElementById('validUsername').style.color = 'red';
            return false;
        } else {
            document.getElementById('validUsername').style.color = 'green';
            return true;
        }
    };

    const validatePasswordMatch = () => {
        const password = passwordField.value;
        const confirmPassword = confirmPasswordField.value;
        if (password !== confirmPassword) {
            document.getElementById('passwordMatch').style.color = 'red';
            return false;
        } else {
            document.getElementById('passwordMatch').style.color = 'green';
            return true;
        }
    };

    const validatePasswordLength = () => {
        const password = passwordField.value;
        if (password.length < 5 || password.length > 21) {
            document.getElementById('passwordLengthCheck').style.color = 'red';
            return false;
        } else {
            document.getElementById('passwordLengthCheck').style.color = 'green';
            return true;
        }
    };

    const validatePasswordStrength = () => {
        const password = passwordField.value;
        const strength = getPasswordStrength(password);
        let color = 'red';
        let strengthText = 'Very Weak';

        if (strength >= 80) {
            color = 'green';
            strengthText = 'Strong';
            passwordStrengthCheck.style.color = 'green';
        } else if (strength >= 60) {
            color = 'orange';
            strengthText = 'Moderate';
            passwordStrengthCheck.style.color = 'orange';
        } else if (strength >= 40) {
            color = 'yellow';
            strengthText = 'Weak';
            passwordStrengthCheck.style.color = 'yellow';
        } else {
            passwordStrengthCheck.style.color = 'red';
        }

        passwordStrengthBar.style.backgroundColor = color;
        passwordStrengthBar.style.width = strength + '%';
        passwordStrengthText.textContent = strengthText;
    };

    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 5) strength += 20;
        if (password.length >= 10) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[@$!%*?&]/.test(password)) strength += 20;
        return strength;
    };

    const updatePasswordDisplays = () => {
        passwordLength.textContent = passwordField.value.length;
        confirmPasswordLength.textContent = confirmPasswordField.value.length;
        validatePasswordStrength();
        validateUsername();
        validatePasswordMatch();
        validatePasswordLength();
    };

    const validateForm = () => {
        const isUsernameValid = validateUsername();
        const isPasswordMatch = validatePasswordMatch();
        const isPasswordLengthValid = validatePasswordLength();
        const isPasswordStrong = getPasswordStrength(passwordField.value) >= 50;

        return isUsernameValid && isPasswordMatch && isPasswordLengthValid && isPasswordStrong;
    };

    // Echtzeit-Überprüfung der Eingaben
    usernameField.addEventListener('input', updatePasswordDisplays);
    passwordField.addEventListener('input', updatePasswordDisplays);
    confirmPasswordField.addEventListener('input', updatePasswordDisplays);

    // Toggle Passwortsichtbarkeit
    const togglePassword = document.getElementById('togglePassword');
    togglePassword.addEventListener('click', () => {
        const type = passwordField.type === 'password' ? 'text' : 'password';
        passwordField.type = type;
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // Formularabsendung
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateForm()) {
            const username = usernameField.value;
            const password = passwordField.value;

            fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    messageElement.textContent = 'Account created successfully!';
                    messageElement.style.color = 'green';
                    setTimeout(() => window.location.href = '/', 2000); // Redirect to login page after 2 seconds
                } else {
                    messageElement.textContent = data.message || 'Registration failed';
                    messageElement.style.color = 'red';
                }
            });
        } else {
            messageElement.textContent = 'Please correct the errors in the form.';
            messageElement.style.color = 'red';
        }
    });
});
