import React from 'react';
import { useState } from 'react';

export default function EditPost(props) {
    const { editPost, handleDisableEditPost } = props;
    const [post, setPost] = useState({
        message: '',
        tag: ''
    })
    const [selectedFile, setSelectedFile] = useState();

    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }
    const getToken = getCookie("token");

    function handleSubmit(evt) {
        evt.preventDefault();
        const data = new FormData();
        data.append('message', post.message);
        data.append('tag', post.tag);
        data.append('image', selectedFile);
        console.log(post.message, post.tag, selectedFile);

        const fetchUrl = 'http://localhost:4200/api/post/' + editPost.editPost._id

        fetch(fetchUrl, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + getToken,
            },
            body: data
        })
            .then((res) => {console.log(res); res.json()})
            .then(() => {
                setPost({
                    message: '',
                    tag: '',
                })
                window.location.href = '/timeline';
            })
            .catch(() => {
                alert('Une erreur est survenue, veuillez réessayer plus tard.')
            })
    }

    function handleChange(evt) {
        const { name, value } = evt.target;
        setPost({...post, [name]: value});
    }
    function handleFileChange(evt) {
		setSelectedFile(evt.target.files[0]);
	};

    let showTag = 'tag-hide';
    if (editPost.editTag === true) {
        showTag = 'tag'
    }

    
    if (editPost.message !== '') {
        return (
            <>
                <div className="greybackground">
                </div>
                <div className="post-edit">
                    <h1>Éditer le message</h1>
                    <div>
                        <form onSubmit={(evt) => handleSubmit(evt)}>
                            <label htmlFor="message">Écrivez votre message :</label>
                            <br />
                            <textarea name="message" id="message" cols="30" rows="10" value={post.message} onChange={(evt) => handleChange(evt)}></textarea>
                            <br />
                            <label htmlFor="tag" className={showTag}>Choisissez un tag :</label>
                            <br className={showTag} />
                            <select name="tag" id="tag" className={showTag} value={post.tag} onChange={(evt) => handleChange(evt)}>
                                <option value="">(sélectionnez un tag)</option>
                                <option value="Work">Work</option>
                                <option value="Tech">Tech</option>
                                <option value="RH">RH</option>
                            </select>
                            <br className={showTag} />
                            <label htmlFor="file">Sélectionnez une image :</label>
                            <br />
                            <input type="file" id="image" name="image" accept="image/png, image/jpeg" value={post.image} onChange={(evt) => handleFileChange(evt)}></input>
                            <br />
                            <div className="validateOrAbort">
                                <input className="btn" type="submit" value="Modifier" />
                                <div className="btn btn--cancel" onClick={() => handleDisableEditPost()}><p>Annuler</p></div>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }
}