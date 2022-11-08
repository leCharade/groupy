import React from 'react';
import { useState } from 'react';

export default function SignUp() { 

    const [signup, setSignup] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    })

    function handleSubmit(evt) {
        evt.preventDefault();
        fetch('http://localhost:4200/api/auth/signup/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(signup)
        })
    
            .then((res) => res.json())
            .then((loginInfos) => {
                if (loginInfos.message === "Votre mot de passe doit comporter au moins 8 caractères dont au moins une lettre majuscule, une lettre minuscule et un chiffre !") {
                    alert('Votre mot de passe doit comporter au moins 8 caractères dont au moins une lettre majuscule, une lettre minuscule et un chiffre.');
                }
                else {
                    localStorage.setItem('Token', JSON.stringify(loginInfos))
                    window.location.href = '/timeline';
                }
            })
            .catch(() => {
                alert('Une erreur est survenue, veuillez réessayer plus tard.')
            })

        setSignup({
            email: '',
            password: '',
            firstName: '',
            lastName: ''
        })
    }

    function handleChange(evt) {
        const { name, value } = evt.target;
        setSignup({...signup, [name]: value});
    }

    return (

        <section className="welcome__form welcome__form--signup">
            <h2>Inscrivez-vous !</h2>
            <form onSubmit={(evt) => handleSubmit(evt)}>
                <div className="form-group form-group__signup">
                    <input type="text" name="firstName" id="signupfirstname" placeholder="Prénom" value={signup.firstName} onChange={(evt) => handleChange(evt)}/>
                </div>
                <div className="form-group form-group__signup">
                    <input type="text" name="lastName" id="signuplastname" placeholder="Nom" value={signup.lastName} onChange={(evt) => handleChange(evt)}/>
                </div>
                <div className="form-group form-group__signup">
                    <input type="email" name="email" id="signupemail" placeholder="Adresse email" value={signup.email} onChange={(evt) => handleChange(evt)}/>
                </div>
                <div className="form-group form-group__signup">
                <input type="password" name="password" id="signuppassword" placeholder="Mot de passe" value={signup.password} onChange={(evt) => handleChange(evt)}/>
                </div>
                <input className="btn" type="submit" value="S'inscrire" />
            </form>
        </section>
    )
}