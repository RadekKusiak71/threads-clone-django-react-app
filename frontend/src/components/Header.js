import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import classes from './Header.module.css'
import threadsLogo from '../assets/icons/threads.png'
import AuthContext from '../context/AuthContext'

const Header = () => {
    let { user, logoutUser } = useContext(AuthContext)
    return (
        <header>
            <div className={classes.empty}></div>
            <div className={classes['header-middle']}>
                <Link to='/'>
                    <img src={threadsLogo} alt='threads-logo' />
                </Link>
            </div>
            <div className={classes['menu-links']}>
                {user ? (
                    <>
                        <Link to='/login' onClick={() => logoutUser()}>Logout</Link>
                    </>
                ) : (
                    <>
                        <Link to='/login'>Login</Link>
                        <Link to='/register'>Register</Link>
                    </>
                )}
            </div >
        </header >
    )
}

export default Header