import React, { useEffect, useState } from 'react'
import Card from '../UI/Card'
import ThreadProfile from '../components/ThreadProfile'
import Post from '../components/Post'
import { useParams } from 'react-router-dom'

const ThreadPage = () => {
  const [threadPosts, setThreadsPosts] = useState([])
  const tokens = JSON.parse(localStorage.getItem('authTokens'));
  const { username } = useParams();

  const fetchPosts = async () => {
    try {
      let response = await fetch(`http://127.0.0.1:8000/api/posts/list_by_username/${username.substring(1,)}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
          'Content-Type': 'application/json'
        },
      });

      let data = await response.json();
      if (response.ok) {
        console.log(data)
        setThreadsPosts(data);
      } else {
        console.log(data);
      }
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [username]);

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
            threads={true}
            threadsPosts={fetchPosts}
          />
        ))
      ) : (
        <p>No posts available</p>
      )}
    </Card>
  )
}

export default ThreadPage