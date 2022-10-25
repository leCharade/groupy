import React from 'react';
export default function Timeline(props) {
    const { posts } = props

    return (
        <div className="timeline">
            <h1>Derniers messages</h1>
            <div>
                {
                    posts.map(post => (
                        <div>
                            <a href="post.html?id=${post._id}" class="post">
                                <h2 className="post__author">Tom Tournillon</h2>
                                <div>
                                    
                                </div>
                                <p className="post__message">{post.postmessage}</p>
                                <div className="post__actions">
                                    <i className="fa-solid fa-comment"></i>
                                    <p className="post__actions__number-replies">69</p>
                                    <i className="fa-solid fa-thumbs-up"></i>
                                    <p className="post__actions__number-likes">420</p>
                                    <p>21/03/1992 04:20</p>
                                </div>
                            </a>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}