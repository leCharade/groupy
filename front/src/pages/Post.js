import React from 'react';
import PostThread from '../components/PostThread';
import { useState, useEffect } from 'react';

export default function Post(props) {
    const { post } = props;
    const [posts, setPosts] = useState([]);
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
                console.log(data);
            })
    }, [])
    
        return (
            <div className="timeline">
                {
                    posts.map(post => (
                        <PostThread post={post.post} author={post.authorName} key={post.post._id}/>
                    ))
                }
            </div>
        )
}

    