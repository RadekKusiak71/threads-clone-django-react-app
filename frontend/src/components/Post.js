import React, { useContext, useState } from 'react'
import classes from './Post.module.css'
import heart from '../assets/icons/heart.svg';
import heartRed from '../assets/icons/heart_red.png';
import chat from '../assets/icons/chat.svg'
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import timeAgo from '../utils/TimeAgo'
import profileIMG from '../assets/icons/profile.png'

const Post = (props) => {
    const [likeCount, setLikeCount] = useState(props.likeCount);
    let tokens = JSON.parse(localStorage.getItem('authTokens'));
    const { user } = useContext(AuthContext);

    const [isLiked, setIsLiked] = useState(() => {
        if (props.likesArray.includes(user.user_id)) {
            return true;
        }
        return false;
    });

    const fetchThisPost = async (postId) => {
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                    'Content-Type': 'application/json'
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
                fetchThisPost(postId)
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
                fetchThisPost(postId)
            } else {
                console.log(data)
            }
        } catch (err) {
            console.log(err)
        }

    }


    const handleLike = (postID) => {
        if (isLiked) {
            setIsLiked(false);
            unlikePost(postID);
        } else {
            setIsLiked(true);
            likePost(postID);
        }
    };


    return (
        <>

            <div className={classes['post-container']}>
                <div className={classes['post-middle']}>
                    <div className={classes['post-description']}>

                        <Link to={`/thread/@${props.profileName}`}>
                            {props.profileImg ? (
                                <img className={classes['profile-image']} src={`http://127.0.0.1:8000${props.profileImg}`} alt='Profile' />
                            ) : (
                                <img className={classes['profile-image']} src={profileIMG} alt='Profile' />
                            )}
                            @{props.profileName}
                        </Link>
                        <Link to={`/post/${props.postID}`}>
                            <p>{props.postBody}</p>
                        </Link>
                    </div>
                    <Link to={`/post/${props.postID}`}>
                        <div className={classes['post-attachment']}>
                            {props.file && (
                                <img src={`http://127.0.0.1:8000${props.file}`} alt='attachment' />
                            )}
                        </div>
                    </Link >
                    <div className={classes['post-actions']}>
                        <img
                            src={isLiked ? heartRed : heart}
                            className={classes['action']}
                            alt="heart-icon"
                            onClick={() => handleLike(props.postID)}
                        />
                        <Link to={`/post/${props.postID}`}><img src={chat} className={classes['action']} alt='chat icon' /></Link>
                    </div>
                    <div className={classes['post-reactions']}>
                        <p><Link to={`/post/${props.postID}`}>{props.commentsCount} answers</Link></p>
                        <p>   <Link to={`/post/${props.postID}`}>{likeCount} likes</Link></p>
                    </div>
                </div>
                <Link to={`/post/${props.postID}`}>
                    <div className={classes['post-right']}>
                        <p>{timeAgo(props.postDate)}</p>
                    </div>
                </Link>
            </div >
            <br></br>
            <hr />
        </>
    )
}

export default Post