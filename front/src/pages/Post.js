import React from 'react';
import PostThread from '../components/PostThread';
import { useState, useEffect } from 'react';

export default function Post(props) {
    const { post } = props;
    const [posts, setPosts] = useState([]);
    const [reply, setReply] = useState({
        message: ''
    })
    const getToken = JSON.parse(localStorage.getItem('Token'));
    const fetchUrl = 'http://localhost:4200/api/post/' + post._id;

    useEffect(() => {
        fetch(fetchUrl, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getToken['token'],
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setPosts(data);
            })
    }, [])

    function handleSubmit(evt) {
        evt.preventDefault();
        fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + getToken['token'],
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(reply)
    })
    .then((res) => res.json())
    .then(() => {
        window.location.href = '/timeline';
    })
    .catch(() => {
        alert('Une erreur est survenue, veuillez réessayer plus tard.')
    })

        setReply({
            message: ''
        })
    }

    function handleChange(evt) {
        const { name, value } = evt.target;
        setReply({...reply, [name]: value});
    }
    
        return (
            <>
                <div className="timeline">
                    {
                        posts.map(post => (
                            <PostThread post={post.post} author={post.authorName} key={post.post._id}/>
                        ))
                    }
                </div>
                <div className="post-add">
                    <h1>Nouveau message</h1>
                    <div>
                        <form onSubmit={(evt) => handleSubmit(evt)}>
                            <label htmlFor="message">Écrivez votre message :</label>
                            <br />
                            <textarea name="message" id="message" cols="30" rows="10" value={reply.message} onChange={(evt) => handleChange(evt)}></textarea>
                            <br />
                            <label htmlFor="tag">Choisissez un tag :</label>
                            <br />
                            <input className="btn" type="submit" value="Envoyer" />
                        </form>
                    </div>
                </div>
            </>
        )
}

    