import React, { useEffect, useState } from 'react'
import classes from './PostPage.module.css'
import Card from '../UI/Card'
import { useParams } from 'react-router-dom'
import Post from '../components/Post'
import CommentForm from '../components/CommentForm'
import Comment from '../components/Comment'

const PostPage = () => {
    const [post, setPost] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [comments, setComments] = useState(null)
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
            let response = await fetch(`http://127.0.0.1:8000/api/comments/comments_for_posts/${postId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('authTokens')).access}`,
                }
            })
            let data = await response.json()
            if (response.ok) {
                setComments(data)
                console.log(data)
            } else {
                console.log(data)
                console.log(response)
            }
        } catch (err) {
            console.log(JSON.stringify(err))
        }
    }

    useEffect(() => {
        fetchPost()
        fetchComments()
    }, [refresh])


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
                <CommentForm postId={postId} setRefresh={setRefresh} />
            </div>
            <div className={classes['post-page-comments']}>
                {comments ? (
                    comments.map((comment) => (
                        <Comment
                            key={comment.id}
                            commentID={comment.id}
                            postID={comment.post}
                            profileName={comment.username}
                            profileImg={comment.profile_image}
                            likeCount={comment.likes_count}
                            commentBody={comment.body}
                            thread={comment.thread}
                            commentDate={comment.created_date}
                            likesArray={comment.likes}
                        />
                    ))

                ) : (
                    <h1 style={{ 'color': 'white', 'marginTop': '20px', 'textAlign': 'center' }}>There are no comments yet..</h1>
                )}
            </div>
        </Card >
    )
}

export default PostPage

