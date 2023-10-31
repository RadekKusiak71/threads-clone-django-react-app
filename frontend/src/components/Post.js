import React, { useContext, useEffect, useState } from 'react'
import classes from './Post.module.css'
import heart from '../assets/icons/heart.svg';
import heartRed from '../assets/icons/heart_red.png';
import chat from '../assets/icons/chat.svg'
import AuthContext from '../context/AuthContext';
import PostContext from '../context/PostContext';
import { Link } from 'react-router-dom';

function timeAgo(postDate) {
    const postDateTime = new Date(postDate).getTime();
    const now = new Date().getTime();
    const timeDiff = now - postDateTime;

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    } else {
        return `${seconds} sec${seconds !== 1 ? 's' : ''} ago`;
    }
}


const Post = (props) => {
    const { user } = useContext(AuthContext);
    const { likePost, unlikePost, fetchPosts } = useContext(PostContext);

    const checkLike = () => {
        if (props.likesArray.includes(user.user_id)) {
            return true;
        }
        return false;
    };

    const [isLiked, setIsLiked] = useState(() => checkLike(props.likesArray));

    const handleLike = (postID) => {
        if (isLiked) {
            setIsLiked(false);
            unlikePost(postID);
            if (props.threads) {
                props.threadsPosts(user.username.substring(1,))
            } else {
                fetchPosts()
            }
        } else {
            setIsLiked(true);
            likePost(postID);
            if (props.threads) {
                props.threadsPosts(user.username.substring(1,))
            } else {
                fetchPosts()
            }
        }
    };
    return (
        <>
            <div className={classes['post-container']}>
                <div className={classes['post-middle']}>
                    <div className={classes['post-description']}>

                        <Link to={`/thread/@${props.profileName}`}>
                            <img className={classes['profile-image']} src={`http://127.0.0.1:8000${props.profileImg}`} alt='profile-image' />
                            @{props.profileName}
                        </Link>
                        <p>{props.postBody}</p>
                    </div>
                    <div className={classes['post-attachment']}>
                        {props.file && (
                            <img src={`http://127.0.0.1:8000${props.file}`} />
                        )}
                    </div>
                    <div className={classes['post-actions']}>
                        <img
                            src={isLiked ? heartRed : heart}
                            className={classes['action']}
                            alt="heart-icon"
                            onClick={() => handleLike(props.postID)}
                        />
                        <img src={chat} className={classes['action']} />
                    </div>
                    <div className={classes['post-reactions']}>
                        <p>{props.commentsCount} answers</p>
                        <p>{props.likeCount} likes</p>
                    </div>
                </div>
                <div className={classes['post-right']}>
                    <p>{timeAgo(props.postDate)}</p>
                </div>
            </div >
            <br></br>
            <hr />
        </>
    )
}

export default Post