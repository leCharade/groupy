import React from 'react';
import PostItem from '../components/PostItem';
import { useState, useEffect } from 'react';
export default function Timeline(props) {
    const { handleSelectPost } = props;

    const [posts, setPosts] = useState([]);

    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }
    
    const cname = "token";
    const getToken = getCookie(cname);

    useEffect(() => {
        fetch('http://localhost:4200/api/post/', {
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
            .catch()
    }, [])
    
            return (
                <div className="timeline">
                    <h1>Derniers messages</h1>
                    <div>
                        {
                            posts.map(post => (
                                <PostItem post={post.postContent} author={post.authorName} key={post.postContent._id} handleSelectPost={handleSelectPost}/>
                            ))
                        }
                    </div>
                </div>
            )
        }
