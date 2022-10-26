import React from 'react';

export default function Settings() {

    function handleLogout(evt) {
        evt.preventDefault();

        localStorage.clear();
        window.location.href = 'welcome.html'
    }

    return (
        <div className="settings">
            <h1>Paramètres du compte</h1>
            <button className="btn" onClick={(evt) => handleLogout(evt)}>Se déconnecter</button>
        </div>
    )
}