import React from 'react';
import { useState } from 'react';

export default function DeletePost(props) {
    const { deletePost, handleDisableDeletePost } = props;

    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }
    const getToken = getCookie("token");

    function handleSubmit(evt) {
        evt.preventDefault();

        const fetchUrl = 'http://localhost:4200/api/post/' + deletePost.postId

        fetch(fetchUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + getToken,
            }
        })
            .then((res) => {console.log(res); res.json()})
            .then(() => {
                window.location.href = '/timeline';
            })
            .catch(() => {
                alert('Une erreur est survenue, veuillez réessayer plus tard.')
            })
    }
    
    if (deletePost.postId !== '') {
        return (
            <>
                <div className="greybackground">
                </div>
                <div className="post-edit post-edit--delete">
                    <h1>Souhaitez-vous vraiment effacer ce message ?</h1>
                    <form onSubmit={(evt) => handleSubmit(evt)}>
                        <div className="validateOrAbort">
                            <input className="btn" type="submit" value="Supprimer" />
                            <div className="btn btn--cancel" onClick={() => handleDisableDeletePost()}><p>Annuler</p></div>
                        </div>
                    </form>
                </div>
            </>
        )
    }
}