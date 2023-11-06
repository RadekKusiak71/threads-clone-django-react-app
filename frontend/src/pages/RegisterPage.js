import React, { useContext, useState } from 'react'
import classes from './RegisterPage.module.css'
import Input from '../UI/Input'
import Button from '../UI/Button'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'

const RegisterPage = () => {
    const { registerUser, error } = useContext(AuthContext)

    const [registerData, setRegisterData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password2: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({
            ...registerData,
            [name]: value,
        });
    };

    const areInputsFilled = () => {
        if (registerData.username.trim() === '' || registerData.first_name.trim() === ''
            || registerData.last_name.trim() === '' || registerData.email.trim() === ''
            || registerData.password.trim() === '' || registerData.password2.trim() === '') {
            return false
        } else {
            return true
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
        const data = {
            'username': registerData.username,
            'email': registerData.email,
            'first_name': registerData.first_name,
            'last_name': registerData.last_name,
            'password': registerData.password,
            'password2': registerData.password2
        }
        registerUser(data)
    }
    return (
        <div className={classes['register-page']}>
            <p className={classes['register-form-title']}>Enter your data and register</p>
            <form className={classes['register-form']} onSubmit={submitHandler}>
                <Input
                    type='text'
                    placeholder='Username'
                    name='username'
                    onChange={handleInputChange}
                />
                <Input
                    type='text'
                    placeholder='First name'
                    name='first_name'
                    onChange={handleInputChange}
                />
                <Input
                    type='text'
                    placeholder='Last name'
                    name='last_name'
                    onChange={handleInputChange}
                />
                <Input
                    type='text'
                    placeholder='Email address'
                    name='email'
                    onChange={handleInputChange}
                />
                <Input
                    type='password'
                    placeholder='Password'
                    name='password'
                    onChange={handleInputChange}
                />
                <Input
                    type='password'
                    placeholder='Re-type password'
                    name='password2'
                    onChange={handleInputChange}
                />
                <Button type='submit' areInputsFilled={areInputsFilled}>Submit</Button>
                <p className={classes['form-account']}>If you already have account.<Link to='/login'> Click here.</Link></p>
                {error && <p className={classes['register-error']}>{error.email}</p>}
                {error && <p className={classes['register-error']}>{error.username}</p>}
                {error && <p className={classes['register-error']}>{error.password}</p>}
            </form>
        </div>
    )
}

export default RegisterPage