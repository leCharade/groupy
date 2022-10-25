export default function SigninLogin() { 

    const signUpButton = document.getElementById('button-signup');
    signUpButton.addEventListener('click', function (event) {
        event.preventDefault();

        const newUser = {
            email: document.getElementById('email-signup').value,
            password: document.getElementById('password-signup').value,
            firstName: document.getElementById('firstname-signup').value,
            lastName: document.getElementById('lastname-signup').value
        };

        fetch('http://localhost:4200/api/auth/signup/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(newUser)
        })

            .then((res) => res.json())
            .then((loginInfos) => {
                localStorage.setItem('Token', JSON.stringify(loginInfos))
                window.location.href = 'index.html'
            })
            .catch(() => {
                alert('Une erreur est survenue, veuillez réessayer plus tard.')
            })
    })

    const loginButton = document.getElementById('button-login');
    loginButton.addEventListener('click', function (event) {
        event.preventDefault();

        const user = {
            email: document.getElementById('email-login').value,
            password: document.getElementById('password-login').value,
        };
        console.log(user);

        fetch('http://localhost:4200/api/auth/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(user)
        })

            .then((res) => res.json())
            .then((loginInfos) => {
                localStorage.setItem('Token', JSON.stringify(loginInfos))
                window.location.href = 'index.html'
            })
            .catch(() => {
                alert('Une erreur est survenue, veuillez réessayer plus tard.')
            })
    })
}