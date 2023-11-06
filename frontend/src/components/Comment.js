import React, { useState, useContext } from 'react';
import classes from './Comment.module.css';
import heart from '../assets/icons/heart.svg';
import heartRed from '../assets/icons/heart_red.png';
import timeAgo from '../utils/TimeAgo';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import profileImg from '../assets/icons/profile.png'

const Comment = (props) => {
  const [likeCount, setLikeCount] = useState(props.likeCount);
  let tokens = JSON.parse(localStorage.getItem('authTokens'));
  const { user } = useContext(AuthContext);

  const [isLiked, setIsLiked] = useState(() => {
    if (props.likesArray.includes(user.user_id)) {
      return true;
    }
    return false;
  });

  const fetchComment = async (commentID) => {
    try {
      let response = await fetch(`http://127.0.0.1:8000/api/comments/${commentID}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
          'Content-Type': 'application/json',
        }
      });

      let data = await response.json();
      if (response.ok) {
        setLikeCount(data.likes_count);
      } else {
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const likeComment = async (commentID) => {
    try {
      let response = await fetch('http://127.0.0.1:8000/api/clikes/like_comment/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'comment_id': commentID })
      });
      let data = await response.json()
      if (response.ok) {
        fetchComment(commentID);
      } else {
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const unlikeComment = async (commentID) => {
    try {
      let response = await fetch('http://127.0.0.1:8000/api/clikes/unlike_comment/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'comment_id': commentID })
      });
      let data = await response.json();

      if (response.ok) {
        fetchComment(commentID);
      } else {
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = (commentID) => {
    if (isLiked) {
      setIsLiked(false);
      unlikeComment(commentID);
    } else {
      setIsLiked(true);
      likeComment(commentID);
    }
  };

  return (
    <>
      <div className={classes['post-container']}>
        <div className={classes['post-middle']}>
          <div className={classes['post-description']}>
            <Link to={`/thread/@${props.profileName}`}>
              {props.profile_image ? (
                <>
                  <img src={`http://127.0.0.1:8000/${props.profile_image}`} alt="Profile" className={classes['enlarged-image']} />
                </>
              ) : (
                <>
                  <img src={profileImg} alt="Profile" className={classes['enlarged-image']} />

                </>
              )}
              @{props.profileName}
            </Link>
            <p>{props.commentBody}</p>
          </div>
          <div className={classes['post-actions']}>
            <img
              src={isLiked ? heartRed : heart}
              className={classes['action']}
              alt="heart-icon"
              onClick={() => handleLike(props.commentID)}
            />
          </div>
          <div className={classes['post-reactions']}>
            <p> {likeCount} likes</p>
          </div>
        </div>
        <div className={classes['post-right']}>
          <p>{timeAgo(props.commentDate)}</p>
        </div>
      </div>
      <br></br>
      <hr />
    </>
  );
};

export default Comment;

