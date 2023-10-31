import React, { useState } from 'react'
import classes from './ProfileSettings.module.css'
import cancelIcon from '../assets/icons/delete.png'
import Input from '../UI/Input'

const ProfileSettings = (props) => {
    const [file, setFile] = useState(null);
    let tokens = JSON.parse(localStorage.getItem('authTokens'));
    const [description, setDescription] = useState('')

    const handleDescription = (e) => {
        setDescription(e.target.value)
    }

    const handleClick = (e) => {
        if (e.target === e.currentTarget) {
            props.showSettings();
        }
    }

    const handleDescriptionChange = async (e) => {
        e.preventDefault()
        try {
            let response = await fetch('http://127.0.0.1:8000/api/threads/change_description/', {
                method: 'Post',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'description': description })
            })
            let data = await response.json()
            if (response.ok) {
                console.log(data)
                props.showSettings();
            } else {
                console.log(data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleProfileImageChnage = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        if (file) {
            formData.append('profile_image', file);
        }
        try {
            let response = await fetch('http://127.0.0.1:8000/api/threads/change_image/', {
                method: 'Post',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                },
                body: formData
            })
            let data = await response.json()
            if (response.ok) {
                console.log(data)
                props.showSettings();
            } else {
                console.log(data)
            }
        } catch (err) {
            console.log(err)
        }
    }
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
        <div onClick={handleClick} className={classes['profile-settings-backdrop']}>

            <form onSubmit={handleProfileImageChnage} encType="multipart/form-data">
                <h1 className={classes['change-profile-image']}>Upload Profile Image</h1>
                <div
                    className={classes['drop-area']}
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                >
                    <label className={classes['post-file-upload']} onDrop={handleFileDrop} onDragOver={handleDragOver}>
                        <input type="file" onChange={handleFileChange} name="image_url" accept="image/png, image/jpeg" />
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

            <form className={classes['description-form']} onSubmit={handleDescriptionChange}>
                <h1 className={classes['change-profile-image']}>Change description</h1>
                <Input
                    type='Text'
                    placeholder='Description'
                    onChange={handleDescription}
                />
                <button type='submit' className={classes['post-form-button']}>Send</button>
            </form>
        </div>
    )
}

export default ProfileSettings