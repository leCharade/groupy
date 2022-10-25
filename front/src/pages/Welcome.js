import React from 'react';
import Logo from '../logo.png';
import { useState } from 'react';

export default function Welcome() { 

    const [signup, setSignup] = useState({
        signupfirstname: '',
        signuplastname: '',
        signupemail: '',
        signuppassword: ''
    })

    return (
        <>
        <header>
            <img className="logo" src={Logo} alt="Logo Groupy" title="Logo Groupy"/>
        </header>

        <div className="welcome">
            <section className="welcome__title">
                <h1>Connectez-vous au réseau Groupomania</h1>
            </section>
            <section className="welcome__form welcome__form--login">
                <h2>Vous avez déjà un compte ?</h2>
                <form>
                    <div className="form-group form-group__login">
                        <input type="email" id="email-login" placeholder="Adresse email" />
                    </div>
                    <div className="form-group form-group__login">
                        <input type="password" id="password-login" placeholder="Mot de passe" />
                    </div>
                    <button className="btn" type="submit" id="button-login" >Se connecter</button>
                </form>
            </section>
            <div className="welcome__verticalbar"></div>
            <section className="welcome__form welcome__form--signup">
                <h2>Inscrivez-vous !</h2>
                    <form>
                        <div className="form-group form-group__signup">
                            <input type="text" id="firstname-signup" placeholder="Prénom" />
                        </div>
                        <div className="form-group form-group__signup">
                            <input type="text" id="lastname-signup" placeholder="Nom" />
                        </div>
                        <div className="form-group form-group__signup">
                            <input type="email" id="email-signup" placeholder="Adresse email" />
                        </div>
                        <div className="form-group form-group__signup">
                        <input type="password" id="password-signup" placeholder="Mot de passe" />
                        </div>
                        <button className="btn" type="submit" id="button-signup" >S'inscrire</button>
                    </form>
            </section>
        </div>
        </>
    )
}




<footer>

</footer>

        