import React from 'react';
import { useState } from 'react';

export default function LogIn() { 

    const [login, setLogin] = useState({
        email: '',
        password: '',
    })

    function handleSubmit(evt) {
        evt.preventDefault();
        
        fetch('http://localhost:4200/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(login)
    })

    .then((res) => res.json())
    .then((loginInfos) => {
        localStorage.setItem('Token', JSON.stringify(loginInfos))
        window.location.href = '/timeline';
    })
    .catch(() => {
        alert('Une erreur est survenue, veuillez réessayer plus tard.')
    })

        setLogin({
            email: '',
            password: '',
        })
    }

    function handleChange(evt) {
        const { name, value } = evt.target;
        setLogin({...login, [name]: value});
    } 

    return (
        <section className="welcome__form welcome__form--login">
            <h2>Vous avez déjà un compte ?</h2>
            <form onSubmit={(evt) => handleSubmit(evt)}>
                <div className="form-group form-group__login">
                    <input type="email" name="email" id="email-login" placeholder="Adresse email" value={login.email} onChange={(evt) => handleChange(evt)}/>
                </div>
                <div className="form-group form-group__login">
                    <input type="password" name="password" id="password-login" placeholder="Mot de passe" value={login.password} onChange={(evt) => handleChange(evt)}/>
                </div>
                <input className="btn" type="submit" value="Se connecter" />
            </form>
        </section>
    )
}