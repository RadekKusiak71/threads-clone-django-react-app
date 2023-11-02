import React, { useState } from 'react'
import Input from '../UI/Input'
import classes from './CommentForm.module.css'

const CommentForm = (props) => {
    const [comment, setComment] = useState('')

    const commentHandler = (e) => {
        setComment(e.target.value)
    }

    const submitForm = (e) => {
        e.preventDefault()
        console.log(comment)
        setComment('')
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