import React, { createContext, useEffect, useState } from 'react'

const PostContext = createContext()

export default PostContext

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [isPostsUpdated, setIsPostsUpdated] = useState(true);
    let tokens = JSON.parse(localStorage.getItem('authTokens'));

    const fetchPosts = async () => {
        try {
            let response = await fetch('http://127.0.0.1:8000/api/posts/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                    'Content-Type': 'application/json'
                },
            });

            let data = await response.json();
            if (response.ok) {
                setPosts(data);
            } else {
                console.log(data);
            }
        } catch (err) {
            console.log(JSON.stringify(err));
        }
    };

    const likePost = async (postId) => {
        try {
            let response = await fetch('http://127.0.0.1:8000/api/likes/like_post/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'post_id': postId })
            });
            let data = await response.json()
            if (response.ok) {
                console.log(data)
                fetchPosts()
            } else {
                console.log(data)
            }
        } catch (err) {
            console.log(err)
        }

    }

    const unlikePost = async (postId) => {
        try {
            let response = await fetch('http://127.0.0.1:8000/api/likes/unlike_post/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'post_id': postId })
            });
            let data = await response.json()

            if (response.ok) {
                console.log(data)
                fetchPosts()
            } else {
                console.log(data)
            }
        } catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
        if (isPostsUpdated) {
            fetchPosts();
            setIsPostsUpdated(false);
        }
    }, [posts]);

    let likeData = {
        likePost: likePost,
        unlikePost: unlikePost,
        posts: posts,
        setIsPostsUpdated: setIsPostsUpdated,
        fetchPosts: fetchPosts,
    }


    return (
        <PostContext.Provider value={likeData}>
            {children}
        </PostContext.Provider>
    )
}