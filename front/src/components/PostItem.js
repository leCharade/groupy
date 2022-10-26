import React from 'react';
import { NavLink } from 'react-router-dom';

export default function PostItem(props) {

    const { post } = props;

    const timePost = new Date(parseInt(post.time));

    const year = timePost.getFullYear(); 
    const month = (timePost.getMonth()+1).toString().padStart(2, "0");
    const day = timePost.getDate().toString().padStart(2, "0");
    const hour = timePost.getHours().toString().padStart(2, "0");
    const minute = timePost.getMinutes().toString().padStart(2, "0");

    return (  
        <div key={post._id}>
        <NavLink to="/post.html" className="post" post={post}>
            <h2 className="post__author">Tom Tournillon</h2>
            <div>
                
            </div>
            <p className="post__message">{post.message}</p>
            <div className="post__actions">
                <i className="fa-solid fa-comment"></i>
                <p className="post__actions__number-replies">{post.replies}</p>
                <i className="fa-solid fa-thumbs-up"></i>
                <p className="post__actions__number-likes">{post.likes}</p>
                <p>{day}/{month}/{year} {hour}:{minute}</p>
            </div>
        </NavLink>
    </div>
    )
}