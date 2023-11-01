import React, { createContext, useState } from 'react'

const PostContext = createContext()

export default PostContext

export const PostProvider = ({ children }) => {
    const [threadPosts, setThreadsPosts] = useState([])
    const [posts, setPosts] = useState([]);


    const fetchPosts = async (tokens) => {
        if (JSON.parse(localStorage.getItem('authTokens')) && JSON.parse(localStorage.getItem('authTokens')).access) {
            try {
                let response = await fetch('http://127.0.0.1:8000/api/posts/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('authTokens')).access}`,
                        'Content-Type': 'application/json'
                    },
                });

                let data = await response.json();
                if (response.ok) {
                    setPosts(data);
                    console.log(data);
                } else {
                    console.log(data);
                    if (data['code'] === 'token_not_valid') {
                        localStorage.removeItem('authTokens')
                    }
                }
            } catch (err) {
                console.log(JSON.stringify(err));
            }
        } else {
            console.log("Tokens are missing or invalid");
        }
    };

    const fetchThreadPosts = async (username) => {
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/posts/list_by_username/${username.substring(1,)}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('authTokens')).access}`,
                    'Content-Type': 'application/json'
                },
            });

            let data = await response.json();
            if (response.ok) {
                setThreadsPosts(data);
            } else {
                console.log(data);
                if (data['code'] === 'token_not_valid') {
                    localStorage.removeItem('authTokens')
                }
            }
        } catch (err) {
            console.log(JSON.stringify(err));
        }
    };


    let postData = {
        posts: posts,
        threadPosts: threadPosts,
        fetchPosts: fetchPosts,
        fetchThreadPosts: fetchThreadPosts,
    }


    return (
        <PostContext.Provider value={postData}>
            {children}
        </PostContext.Provider>
    )
}