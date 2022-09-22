const signUpButton = document.getElementById('button-signup');
signUpButton.addEventListener('click', function (event) {
    event.preventDefault();

    fetch('http://localhost:3000/api/auth/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: {
                    'email': document.getElementById('email-signup').value,
                    'password': document.getElementById('password-signup').value,
                    'firstName': document.getElementById('firstname-signup').value,
                    'lastName': document.getElementById('lastname-signup').value
                }
    })
})