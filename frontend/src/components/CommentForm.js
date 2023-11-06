import React, { useContext, useState } from 'react'
import Input from '../UI/Input'
import classes from './CommentForm.module.css'
import AuthContext from '../context/AuthContext'

const CommentForm = (props) => {
    const [comment, setComment] = useState('')
    const { user } = useContext(AuthContext)

    const commentHandler = (e) => {
        setComment(e.target.value)
    }

    const createComment = async () => {
        const formData = new FormData();
        formData.append('thread_id', user.thread_id);
        formData.append('post_id', props.postId);
        formData.append('body', comment);

        if (JSON.parse(localStorage.getItem('authTokens')) && JSON.parse(localStorage.getItem('authTokens')).access) {
            try {
                let response = await fetch('http://127.0.0.1:8000/api/comments/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('authTokens')).access}`,
                    },
                    body: formData,
                });
                let data = await response.json()
                if (response.ok) {
                    console.log(response, data)
                } else {
                    console.log(response)
                }
            } catch (err) {
                console.log(err);
                console.log('xd')
            }
        } else {
            console.log("Tokens are missing or invalid");
        }
    }


    const submitForm = (e) => {
        e.preventDefault()
        createComment()
        setComment('')
        props.setRefresh(true)
    }


    return (
        <form className={classes['description-form']} onSubmit={submitForm}>
            <Input
                type='Text'
                placeholder='Say something'
                onChange={commentHandler}
                value={comment}
            />
            <button type='submit' className={classes['post-form-button']}>Send</button>
        </form>
    )
}

export default CommentForm