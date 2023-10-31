import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import classes from './PostForm.module.css';
import AuthContext from '../context/AuthContext';
import cancelIcon from '../assets/icons/delete.png'
import PostContext from '../context/PostContext';

const PostForm = () => {
    const [file, setFile] = useState(null);
    const [body, setBody] = useState('');
    const { user } = useContext(AuthContext);
    const { setIsPostsUpdated, fetchPosts } = useContext(PostContext)

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
            if (file) {
                formData.append('attachment', file);
            }
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
                setFile(null);
                setBody('');
                setIsPostsUpdated(true);
                fetchPosts();
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
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const cancelFilesHandler = () => {
        setFile(null)
    }

    return (
        <div className={classes['post-form-container']}>
            <form className={classes['post-form']} onSubmit={postCreateHandler} encType="multipart/form-data">
                <textarea onChange={handleTextarea} className={classes['post-text-input']} placeholder='Say something' maxLength={280} value={body} />
                <div
                    className={classes['drop-area']}
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                >
                    <label className={classes['post-file-upload']} onDrop={handleFileDrop} onDragOver={handleDragOver}>
                        <input type="file" onChange={handleFileChange} name="image_url" />
                        {file ?
                            <div className={classes['file']}>
                                <p>{file.name}</p>
                                <button type='button' onClick={cancelFilesHandler} className={classes['post-file-cancel']}>
                                    <img src={cancelIcon} alt='cancelIcon' />
                                </button>
                            </div>
                            : <p>Add an attachment</p>}
                    </label>
                </div>
                <button type='submit' className={classes['post-form-button']}>Send</button>
            </form>
        </div>
    );
};

export default PostForm;
