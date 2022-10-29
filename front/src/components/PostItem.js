import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faThumbsUp } from '@fortawesome/free-regular-svg-icons'

export default function PostItem(props) {

    const { post, author, handleSelectPost } = props;

    const userId = JSON.parse(localStorage.getItem('Token')).userId;
    const rank = JSON.parse(localStorage.getItem('Token')).rank;
    let allowEdit = 'post__actions__edit';
    let allowDelete = 'post__actions__delete'
    let allowLike = 'post__actions__like';

    if (userId === post.userId || rank === 1) {
        allowEdit = 'post__actions__edit post__actions__edit__allow';
        allowDelete = 'post__actions__delete post__actions__delete__allow';
    }
    if (userId !== post.userId) {
        allowLike = 'post__actions__like post__actions__like__allow';
    }
    console.log(allowEdit, allowLike);

    const timePost = new Date(parseInt(post.time));

    const year = timePost.getFullYear(); 
    const month = (timePost.getMonth()+1).toString().padStart(2, "0");
    const day = timePost.getDate().toString().padStart(2, "0");
    const hour = timePost.getHours().toString().padStart(2, "0");
    const minute = timePost.getMinutes().toString().padStart(2, "0");

    return (  
        <div key={post._id}>
            <NavLink to="/post.html" className="post" post={post} onClick={() => handleSelectPost(post)}>
                <h2 className="post__author">{author}</h2>
                <div>
                    
                </div>
                <p className="post__message">{post.message}</p>
                <div className="post__actions">
                    <p className="post__actions__date">{day}/{month}/{year} {hour}:{minute}</p>
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <p className="post__actions__number-likes">{post.likes}</p>
                    <FontAwesomeIcon icon={faComment} />
                    <p className="post__actions__number-replies">{post.replies}</p>
                    <p className={allowEdit}>Modifier</p>
                    <p className={allowDelete}>Supprimer</p>
                </div>
            </NavLink>
        </div>
    )
}