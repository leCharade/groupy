import React from 'react';
import PostItem from '../components/PostItem';
import { useState, useEffect } from 'react';
export default function Timeline() {

    const [posts, setPosts] = useState([]);
    const getToken = JSON.parse(localStorage.getItem('Token'));

    useEffect(() => {
        fetch('http://localhost:4200/api/post/', {
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
    
            return (
                <div className="timeline">
                    <h1>Derniers messages</h1>
                    <div>
                        {
                            posts.map(post => (
                                <PostItem post={post} key={post._id}/>
                            ))
                        }
                    </div>
                </div>
            )
        }
