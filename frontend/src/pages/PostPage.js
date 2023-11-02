import React, { useEffect, useState } from 'react'
import classes from './PostPage.module.css'
import Card from '../UI/Card'
import { useParams } from 'react-router-dom'
import Post from '../components/Post'
import CommentForm from '../components/CommentForm'


const PostPage = () => {
    const [post, setPost] = useState(null);
    const { postId } = useParams();

    const fetchPost = async () => {
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('authTokens')).access}`,
                    'Content-Type': 'application/json'
                }
            })
            let data = await response.json()
            if (response.ok) {
                setPost(data)
            } else {
                console.log(data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const fetchComments = async () => {
        try {
            console.log('fetching comments')
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchPost()
        fetchComments()
    }, [])


    return (
        <Card>
            {post ? (
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

            ) : (
                <h1 style={{ 'color': 'white', 'marginTop': '20px', 'textAlign': 'center' }}>Loading</h1>
            )}
            <div className={classes['post-page-comment-form']}>
                <CommentForm postId={postId} />
            </div>
            <div className={classes['post-page-comments']}>
                <p>Comments</p>
            </div>
        </Card >
    )
}

export default PostPage