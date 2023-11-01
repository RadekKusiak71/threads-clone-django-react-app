import React, { createContext, useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({ children }) => {

    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)
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
                navigate('/login');
            } else {
                let errorData = await response.json();
                setError(errorData);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const loginUser = async (formData) => {
        try {
            let response = await fetch('http://127.0.0.1:8000/authentication/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            let data = await response.json()
            if (response.ok) {
                setAuthTokens(data)
                setUser(jwtDecode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(data))
                navigate('/')
            } else {
                setError(data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

    const updateToken = async () => {
        try {
            let response = await fetch('http://127.0.0.1:8000/authentication/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'refresh': authTokens.refresh })
            });
            let data = await response.json();

            if (response.ok) {
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(data));
            } else {
                if (response.status === 401) {
                    logoutUser();
                    navigate('/login');
                } else {
                    setError('Token refresh failed');
                }
            }
        } catch (err) {
            console.log(err);
            setError('Network error');
            logoutUser();
            navigate('/login');
        }
    };


    useEffect(() => {
        const refresher = 1000 * 60 * 10
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            }
        }, refresher)

        return () => clearInterval(interval)
    }, [authTokens])

    let authData = {
        user: user,
        registerUser: registerUser,
        loginUser: loginUser,
        error: error,
        logoutUser: logoutUser
    }

    return (
        <AuthContext.Provider value={authData}>
            {children}
        </AuthContext.Provider>
    )
}