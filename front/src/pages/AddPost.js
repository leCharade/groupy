import React from 'react';
import { useState } from 'react';

export default function AddPost(props) {
    const [post, setPost] = useState({
        postmessage: '',
        posttag: ''
    })

    const { handleAddPost } = props;

    function handleSubmit(evt) {
        evt.preventDefault();
        handleAddPost(post);
        setPost({
            postmessage: '',
            posttag: ''
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
                    <label htmlFor="postmessage">Écrivez votre message :</label>
                    <br />
                    <textarea name="postmessage" id="postmessage" cols="30" rows="10" value={post.postmessage} onChange={(evt) => handleChange(evt)}></textarea>
                    <br />
                    <label htmlFor="posttag">Choisissez un tag :</label>
                    <br />
                    <select name="posttag" id="posttag" value={post.posttag} onChange={(evt) => handleChange(evt)}>
                        <option value="none">(sélectionnez un tag)</option>
                        <option value="Work">Work</option>
                        <option value="Tech">Tech</option>
                        <option value="RH">RH</option>
                    </select>
                    <br />
                    <input className="btn" type="submit" value="Envoyer" />
                </form>
            </div>
        </div>
    )
}