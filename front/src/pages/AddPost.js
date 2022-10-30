import React from 'react';
import { useState } from 'react';

export default function AddPost() {
    const [post, setPost] = useState({
        message: '',
        tag: '',
        picture: ''
    })
    const getToken = JSON.parse(localStorage.getItem('Token'));

    function handleSubmit(evt) {
        evt.preventDefault();
        console.log(post);
        fetch('http://localhost:4200/api/post/', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + getToken['token'],
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(post)
    })

    .then((res) => res.json())
    .then(() => {
        window.location.href = '/timeline';
    })
    .catch(() => {
        alert('Une erreur est survenue, veuillez réessayer plus tard.')
    })
        setPost({
            message: '',
            tag: '',
            picture: ''
        })
    }

    function handleChange(evt) {
        const { name, value } = evt.target;
        setPost({...post, [name]: value});
    }

    

    return (
        <div className="post-add">
            <h1>Nouveau message</h1>
            <div>
                <form onSubmit={(evt) => handleSubmit(evt)}>
                    <label htmlFor="message">Écrivez votre message :</label>
                    <br />
                    <textarea name="message" id="message" cols="30" rows="10" value={post.message} onChange={(evt) => handleChange(evt)}></textarea>
                    <br />
                    <label htmlFor="tag">Choisissez un tag :</label>
                    <br />
                    <select name="tag" id="tag" value={post.tag} onChange={(evt) => handleChange(evt)}>
                        <option value="none">(sélectionnez un tag)</option>
                        <option value="Work">Work</option>
                        <option value="Tech">Tech</option>
                        <option value="RH">RH</option>
                    </select>
                    <br />
                    <label htmlFor="file">Sélectionnez une image :</label>
                    <br />
                    <input type="file" id="picture" name="picture" accept="image/png, image/jpeg" value={post.picture} onChange={(evt) => handleChange(evt)}></input>
                    <br />
                    <input className="btn" type="submit" value="Envoyer" />
                </form>
            </div>
        </div>
    )
}