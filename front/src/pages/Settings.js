import React from 'react';

export default function Settings() {

    function handleLogout(evt) {
        evt.preventDefault();
        document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
        document.cookie = "userId=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
        document.cookie = "rank=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
        localStorage.clear();
        window.location.href = ''
    }

    return (
        <div className="settings">
            <h1>Paramètres du compte</h1>
            <button className="btn btn--logoff" onClick={(evt) => handleLogout(evt)}>Se déconnecter</button>
        </div>
    )
}