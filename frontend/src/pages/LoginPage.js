import React, { useContext, useState } from 'react'
import classes from './RegisterPage.module.css'
import Input from '../UI/Input'
import Button from '../UI/Button'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'
import PostContext from '../context/PostContext'

const LoginPage = () => {
    const { loginUser, error } = useContext(AuthContext)


    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };

    const areInputsFilled = () => {
        if (loginData.username.trim() === '' || loginData.password.trim() === '') {
            return false
        } else {
            return true
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
        const data = {
            'username': loginData.username,
            'password': loginData.password,
        }
        loginUser(data)
    }
    return (
        <div className={classes['register-page']}>
            <p className={classes['register-form-title']}>Enter your data and login</p>
            <form className={classes['register-form']} onSubmit={submitHandler}>
                <Input
                    type='text'
                    placeholder='Username'
                    name='username'
                    onChange={handleInputChange}
                />
                <Input
                    type='password'
                    placeholder='Password'
                    name='password'
                    onChange={handleInputChange}
                />
                <Button type='submit' areInputsFilled={areInputsFilled}>Submit</Button>
                <p className={classes['form-account']}>If you don't have account already.<Link to='/register'> Click here.</Link></p>
                {error && <p className={classes['register-error']}>{error.username}</p>}
                {error && <p className={classes['register-error']}>{error.password}</p>}
            </form>
        </div>
    )
}


export default LoginPage