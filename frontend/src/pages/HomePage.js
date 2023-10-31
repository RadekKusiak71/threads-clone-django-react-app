import React, { useContext, useEffect, useState } from 'react';
import Card from '../UI/Card';
import PostForm from '../components/PostForm';
import Post from '../components/Post';
import PostContext from '../context/PostContext';

const HomePage = () => {
    let { posts, fetchPosts } = useContext(PostContext)

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <Card>
            <PostForm />
            {posts.length > 0 ? (
                posts.map((post) => (
                    <Post
                        key={post.id}
                        postID={post.id}
                        file={post.attachment}
                        profileName={post.username}
                        profileImg={post.profile_image}
                        postBody={post.body}
                        commentsCount={post.comments_count}
                        likeCount={post.likes_count}
                        thread={post.thread}
                        postDate={post.created_date}
                        likesArray={post.likes}
                    />
                ))
            ) : (
                <h1 style={{ 'color': 'white', 'marginTop': '20px', 'textAlign': 'center' }}>No posts available</h1>
            )}
        </Card>
    );
};

export default HomePage;
