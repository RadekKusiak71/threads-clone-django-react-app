import React, { useContext, useEffect } from 'react'
import Card from '../UI/Card'
import ThreadProfile from '../components/ThreadProfile'
import Post from '../components/Post'
import { useParams } from 'react-router-dom'
import PostContext from '../context/PostContext'

const ThreadPage = () => {
  const { username } = useParams();
  const { threadPosts, fetchThreadPosts } = useContext(PostContext)

  useEffect(() => {
    fetchThreadPosts(username)
  }, [username])

  return (
    <Card>
      <ThreadProfile />
      <hr />
      {threadPosts.length > 0 ? (
        threadPosts.map((post) => (
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
        <p>No posts available</p>
      )}
    </Card>
  )
}

export default ThreadPage