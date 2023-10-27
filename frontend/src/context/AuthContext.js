import React, { Children, createContext, useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthToknes] = useState(null)
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const navigate = useNavigate()


    const registerUser = async (formData) => {
        try {
            let response = await fetch('http://localhost:8000/authentication/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                let data = await response.json();
                console.log(data);
                navigate('/login');
            } else {
                let errorData = await response.json();
                console.log(errorData);
                setError(errorData);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const loginUser = async () => {
        console.log('login')
    }

    const logoutUser = () => {
        console.log('logout')
    }

    const updateToken = async () => {
        console.log('updating tokens')
    }

    useEffect(() => {
        const refresher = 1000 * 60 * 14
        let timeout = setTimeout(() => {
            if (authTokens) {
                updateToken()
            }
        }, refresher)

        return () => clearTimeout(timeout)
    }, [authTokens])

    let authData = {
        user: user,
        registerUser: registerUser,
        error:error
    }

    return (
        <AuthContext.Provider value={authData}>
            {children}
        </AuthContext.Provider>
    )
}