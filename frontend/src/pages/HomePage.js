import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
const HomePage = () => {
    const { user } = useContext(AuthContext)
    return (
        <div>HomePage</div>
    )
}

export default HomePage