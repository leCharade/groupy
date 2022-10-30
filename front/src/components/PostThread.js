import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faThumbsUp, faBookmark } from '@fortawesome/free-regular-svg-icons'

export default function PostThread(props) {

    const { post, author } = props;

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

    const timePost = new Date(parseInt(post.time));

    const year = timePost.getFullYear(); 
    const month = (timePost.getMonth()+1).toString().padStart(2, "0");
    const day = timePost.getDate().toString().padStart(2, "0");
    const hour = timePost.getHours().toString().padStart(2, "0");
    const minute = timePost.getMinutes().toString().padStart(2, "0");
    let showTag = 'post__tag'

    let hideIfNotFirst = "display";
    if (post.replyTo !== "ORIGINAL") {
        hideIfNotFirst = "hide";
    }

    if (post.tag !== "" && post.replyTo === "ORIGINAL") {
        showTag = 'post__tag--show'
    }

    return (  
        <div key={post._id}>
            <div className="post">
                <div className="post__header">
                    <h2 className="post__author">{author}</h2>
                    <div className={showTag}>
                        <FontAwesomeIcon icon={faBookmark} />
                        <p>{post.tag}</p>
                    </div>
                </div>
                <p className="post__message">{post.message}</p>
                <img className="post__image" src={post.imageUrl} />
                <div className="post__actions">
                    <div>
                        <p className="post__actions__date">{day}/{month}/{year} {hour}:{minute}</p>
                    </div>
                    <div>
                    <FontAwesomeIcon icon={faThumbsUp} /> 
                        <p className="post__actions__number-likes">{post.likes}</p>
                        <div className={hideIfNotFirst}>
                            <FontAwesomeIcon icon={faComment} />
                            <p className="post__actions__number-replies">{post.replies}</p>
                        </div>
                    </div>
                    <div>
                        <p className={allowEdit}>Modifier</p>
                        <p className={allowDelete}>Supprimer</p>
                    </div>
                </div>
            </div>
        </div>
    )
}