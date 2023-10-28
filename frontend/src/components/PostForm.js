import React, { useState, useContext } from 'react';
import classes from './PostForm.module.css';
import AuthContext from '../context/AuthContext';

const PostForm = () => {
    const [file, setFile] = useState(null);
    const [body, setBody] = useState('');
    const { user } = useContext(AuthContext);

    let tokens = JSON.parse(localStorage.getItem('authTokens'));

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleTextarea = (e) => {
        setBody(e.target.value);
    };

    const createPost = async () => {
        try {
            const formData = new FormData();
            formData.append('thread_id', user.thread_id);
            formData.append('attachment', file);
            formData.append('body', body);

            let response = await fetch('http://127.0.0.1:8000/api/posts/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`
                },
                body: formData
            });

            let data = await response.json();
            if (response.ok) {
                console.log('POST CREATED', response);
                console.log(data);
                setFile(null)
                setBody('')
            } else {
                console.log(response);
                console.log(data);
            }
        } catch (err) {
            console.log(JSON.stringify(err));
        }
    };

    const postCreateHandler = (e) => {
        e.preventDefault();
        if (body.trim() !== '') {
            createPost();
        } else {
            console.log('Body is needed');
        }
    };

    return (
        <div className={classes['post-form-container']}>
            <form className={classes['post-form']} onSubmit={postCreateHandler} encType="multipart/form-data">
                <textarea onChange={handleTextarea} className={classes['post-text-input']} placeholder='Say something' maxLength={280} value={body} />
                <label className={classes['post-file-upload']}>
                    <input type="file" onChange={handleFileChange} name="image_url" />
                    {file ? <p>{file.name}</p> : <p>Add an attachment</p>}
                </label>
                <button type='submit' className={classes['post-form-button']}>Send</button>
            </form>
        </div>
    );
};

export default PostForm;
