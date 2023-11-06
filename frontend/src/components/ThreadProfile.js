import React, { useContext, useEffect, useState } from 'react';
import classes from './ThreadProfile.module.css';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import profileImg from '../assets/icons/profile.png'
import ProfileSettings from './ProfileSettings';

const ThreadProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [settings, setSettings] = useState(false);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const tokens = JSON.parse(localStorage.getItem('authTokens'));
    const { username } = useParams();
    let { user } = useContext(AuthContext)

    const getThreadInfo = async () => {
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/threads/list_by_username/${username.substring(1,)}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${tokens.access}`,
                    'Content-Type': 'application/json'
                }
            });
            let data = await response.json();
            if (response.ok) {
                setProfileData(data);
            } else {
                console.log(data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const openBackdrop = () => {
        setShowBackdrop(true);
    };

    const closeBackdrop = () => {
        setShowBackdrop(false);
    };

    const checkProfile = () => {
        if (username.substring(1,) === user.username) {
            return true
        } return false
    }

    const showSettings = () => {
        setSettings(!settings)
    }



    useEffect(() => {
        getThreadInfo(username);
        checkProfile()
    }, [username, settings]);

    return (
        <div className={classes['thread-profile']}>
            {profileData && (
                <div className={classes['thread-upper']}>
                    <div className={classes['thread-name']}>{username.substring(1,)}</div>
                    <div className={classes['thread-img']} onClick={openBackdrop}>
                        {profileData.profile_image ? (
                            <>
                                <img src={`http://127.0.0.1:8000/${profileData.profile_image}`} alt="Profile" />
                            </>
                        ) : (
                            <>
                                <img src={profileImg} alt="Profile" />
                            </>
                        )}
                    </div>
                </div>
            )}
            {profileData && showBackdrop && (
                <div className={classes['backdrop']} onClick={closeBackdrop}>
                    <div className={classes['backdrop-content']}>
                        {profileData.profile_image ? (
                            <>
                                <img src={`http://127.0.0.1:8000/${profileData.profile_image}`} alt="Profile" className={classes['enlarged-image']} />
                            </>
                        ) : (
                            <>
                                <img src={profileImg} alt="Profile" className={classes['enlarged-image']} />

                            </>
                        )}
                        <button onClick={closeBackdrop} className={classes['close-button']}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {settings && <ProfileSettings showSettings={showSettings} />}
            <div className={classes['thread-description']}>
                {profileData && <p>{profileData.description}</p>}
            </div>
            {checkProfile() && <button onClick={showSettings} className={classes['profile-settings']}>Profile Settings</button>}
        </div>
    );
};

export default ThreadProfile;
