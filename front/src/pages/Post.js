import React from 'react';
import PostThread from '../components/PostThread';
import EditPost from '../components/EditPost';
import DeletePost from '../components/DeletePost';
import { useState, useEffect } from 'react';

export default function Post(props) {
    const { post } = props;
    const [posts, setPosts] = useState([]);
    const [reply, setReply] = useState({
        message: ''
    })
    const [selectedFile, setSelectedFile] = useState();
    const [editPost, setEditPost] = useState({
        message: '',
        tag: '',
        editTag: false
    });
    const [deletePost, setDeletePost] = useState({postId:''})

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

    let fetchUrl = ''
    if (post === undefined) {
        const url = new URL(window.location.href);
        const postId = url.searchParams.get("id");
        fetchUrl = 'http://localhost:4200/api/post/' + postId;
    }
    else {
        fetchUrl = 'http://localhost:4200/api/post/' + post._id;
    }

    useEffect(() => {
        fetch(fetchUrl, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getToken,
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
        const data = new FormData();
        data.append('message', reply.message);
        data.append('image', selectedFile);
        fetch(fetchUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + getToken,
            },
            body: data
    })
    .then((res) => res.json())
    .then(() => {
        window.location.href = '/timeline';
    })
    .catch(() => {
        alert('Une erreur est survenue, veuillez r??essayer plus tard.')
    })

        setReply({
            message: ''
        })
    }

    function handleChange(evt) {
        const { name, value } = evt.target;
        setReply({...reply, [name]: value});
    }
    function handleFileChange(evt) {
		setSelectedFile(evt.target.files[0]);
	};
    function handleEditPost(editPost) {
        if (editPost.replyTo === 'ORIGINAL') {
            setEditPost({editPost, editTag: true});
        }
        else {
            setEditPost({editPost, editTag: false});
        }
    }
    function handleDisableEditPost() {
        setEditPost({message: '', tag: '', editTag:false});
    }
    function handleDeletePost(deletePost) {
        setDeletePost({postId:deletePost._id})
    }
    function handleDisableDeletePost() {
        setDeletePost({postId:''})
    }
    
    
        return (
            <div className="postpage">
                <div className="timeline">
                    {
                        posts.map(post => (
                            <PostThread post={post.post} author={post.authorName} handleEditPost={handleEditPost} handleDeletePost={handleDeletePost} key={post.post._id}/>
                        ))
                    }
                </div>
                <EditPost editPost={editPost} handleDisableEditPost={handleDisableEditPost}></EditPost>
                <DeletePost deletePost={deletePost} handleDisableDeletePost={handleDisableDeletePost}></DeletePost>
                <div className="post-add">
                    <h1>Nouveau message</h1>
                    <div>
                        <form onSubmit={(evt) => handleSubmit(evt)}>
                            <label htmlFor="message">??crivez votre message :</label>
                            <br />
                            <textarea name="message" id="message" cols="30" rows="10" value={reply.message} onChange={(evt) => handleChange(evt)}></textarea>
                            <br />
                            <label htmlFor="file">S??lectionnez une image :</label>
                            <br />
                            <input type="file" id="image" name="image" accept="image/png, image/jpeg" value={reply.image} onChange={(evt) => handleFileChange(evt)}></input>
                            <br />
                            <input className="btn" type="submit" value="Envoyer" />
                        </form>
                    </div>
                </div>
            </div>
        )
}

    